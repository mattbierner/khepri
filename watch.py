import sys
import os
import time
import logging
from os.path import splitext
from subprocess import call
from watchdog.observers.kqueue import KqueueObserver as Observer
from watchdog.events import FileSystemEventHandler


KHEPRI = "node %s" % os.path.join(os.path.dirname(os.path.realpath(__file__)), "compile.js")

class KhepriMatchingEventHandler(FileSystemEventHandler):
    def __init__(self):
        super(KhepriMatchingEventHandler, self).__init__()
    
    def _compile(self, path):
        out_path = "%s.js" % splitext(path)[0]
        header = "/*\n * THIS FILE IS AUTO GENERATED from '%s'\n * DO NOT EDIT\n*/" % os.path.relpath(path)
        call('%s --header "%s" -o %s %s' % (KHEPRI, header, out_path, path), shell=True)
    
    def on_any_event(self, event):
        if event.is_directory:
            return
        path = event.src_path
        if splitext(path)[1] == '.kep':
            self._compile(path)


def watch(paths):
    event_handler = KhepriMatchingEventHandler()
    observer = Observer()
    for path in paths:
        observer.schedule(event_handler, path, recursive=True)
    observer.start()
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
    observer.join()

if __name__ == "__main__":
    paths = sys.argv[1:] if len(sys.argv) > 1 else ['.']
    watch(paths)