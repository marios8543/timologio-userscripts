from win32com.client import Dispatch
from http.server import BaseHTTPRequestHandler, HTTPServer
from os import path
import sys

if getattr(sys, 'frozen', False):
    curdir = path.dirname(sys.executable)
else:
    curdir = path.dirname(path.abspath(__file__))
label = path.join(curdir, 'template.label')


def print_label(text):
    labelCom = Dispatch('Dymo.DymoAddIn')
    labelText = Dispatch('Dymo.DymoLabels')
    labelCom.Open(label)
    labelCom.SelectPrinter('DYMO LabelWriter 450')
    labelText.SetField('ADDR', text)

    labelCom.StartPrintJob()
    labelCom.Print(1, False)
    labelCom.EndPrintJob()


class Handler(BaseHTTPRequestHandler):
    def _set_response(self):
        self.send_response(200)
        self.send_header('Content-type', 'text/html')
        self.end_headers()

    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length).decode("utf-8")
        print(post_data, "\n\n")
        print_label(post_data)
        self._set_response()
        self.wfile.write("OK".encode("utf-8"))


server = HTTPServer(("", 5000), Handler)
server.serve_forever()
