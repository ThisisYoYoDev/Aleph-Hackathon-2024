import os
import http.server
import socketserver
import urllib.parse

react_build_dir = '/opt/react/build'

os.chdir(react_build_dir)

port = 8001

class ReactHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        parsed_url = urllib.parse.urlparse(self.path)
        if os.path.exists(parsed_url.path.strip('/')):
            return http.server.SimpleHTTPRequestHandler.do_GET(self)

        self.path = '/index.html'
        return http.server.SimpleHTTPRequestHandler.do_GET(self)

httpd = socketserver.TCPServer(("", port), ReactHandler)

print("Serving React app at http://localhost:" + str(port))

try:
    httpd.serve_forever()
except KeyboardInterrupt:
    httpd.shutdown()