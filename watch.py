import sys
import os
import time
import logging
import argparse
from os.path import splitext
from subprocess import call
from watchdog.observers.kqueue import KqueueObserver as Observer
from watchdog.events import FileSystemEventHandler


KHEPRI = "node %s" % os.path.join(os.path.dirname(os.path.realpath(__file__)), "compile.js")


class KhepriMatchingEventHandler(FileSystemEventHandler):
    def __init__(self, relative, out):
        super(KhepriMatchingEventHandler, self).__init__()
        self.relative = relative
        self.out = out
    
    def _compile(self, path):
        rel = os.path.relpath(path, self.relative)
        out_path = os.path.join(
            self.out if self.out is not None else self.relative,
            "%s.js" % splitext(rel)[0])
        header = "/*\n * THIS FILE IS AUTO GENERATED from '%s'\n * DO NOT EDIT\n*/" % os.path.relpath(path)
        call('%s --header "%s" -o %s %s' % (KHEPRI, header, out_path, path), shell=True)
    
    def on_any_event(self, event):
        if event.is_directory:
            return
        path = event.src_path
        if splitext(path)[1] == '.kep':
            self._compile(path)

def watch(path, out):
    event_handler = KhepriMatchingEventHandler(path, out)
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
    args = parser.parse_args()
    watch(args.path[0], args.out)