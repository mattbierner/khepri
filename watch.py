import sys
import os
import time
import logging
import argparse
import json
from os.path import splitext
from subprocess import call
from watchdog.observers.kqueue import KqueueObserver as Observer
from watchdog.events import PatternMatchingEventHandler


KHEPRI = "node %s" % os.path.join(os.path.dirname(os.path.realpath(__file__)), "bin/khepri")
KHEPRI_FILE_PATTERN = '*.kep'

class KhepriMatchingEventHandler(PatternMatchingEventHandler):
    def __init__(self, relative, out, other_args):
        super(KhepriMatchingEventHandler, self).__init__(
            patterns=[KHEPRI_FILE_PATTERN],
            ignore_directories=True)
        self.relative = relative
        self.out = out
        self.other_args = other_args
    
    def _out_path(self, path):
        rel = os.path.relpath(path, self.relative)
        return os.path.join(
            self.out if self.out is not None else self.relative,
            "%s.js" % splitext(rel)[0])
    
    def _compile(self, path):
        out_path = self._out_path(path)
        out_dir = os.path.split(out_path)[0]
        if out_dir:
            try: 
                os.makedirs(out_dir)
            except OSError:
                if not os.path.isdir(out_dir):
                    raise
        
        call(
            '%s -o %s %s %s' % (
                KHEPRI,
                out_path,
                self.other_args,
                os.path.relpath(path)),
            shell=True)
    
    def on_moved(self, event):
        self._compile(event.dest_path)
        
    def on_modified(self, event):
        self._compile(event.src_path)
    
    def on_created(self, event):
        self._compile(event.src_path)
        
    def on_deleted(self, event):
        out_path = self._out_path(event.src_path)
        if os.path.isfile(out_path):
            os.remove(out_path)



def watch(path, out, other_args):
    event_handler = KhepriMatchingEventHandler(path, out, other_args)
    observer = Observer()
    observer.schedule(event_handler, path, recursive=True)
    observer.start()
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
    observer.join()

parser = argparse.ArgumentParser(description='Khepri automatic compiler')
parser.add_argument('path', nargs=1,
                   help='file path to watch')
parser.add_argument('out', nargs='?', default=None,
                   help='path to output to')

if __name__ == "__main__":
    args, other = parser.parse_known_args()
    watch(args.path[0], args.out, ' '.join(other))
