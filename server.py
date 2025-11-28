import http.server
import socketserver
from pathlib import Path

# Simple static file server to satisfy client requirement for a Python entry point.
# Serves the current directory so the PWA assets load with correct relative paths.

ROOT = Path(__file__).resolve().parent
PORT = 8080


class PWARequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def end_headers(self):
        # Ensure manifest gets the correct content type for install prompts.
        if self.path.endswith(".webmanifest"):
            self.send_header("Content-Type", "application/manifest+json")
        super().end_headers()


def main():
    with socketserver.TCPServer(("", PORT), PWARequestHandler) as httpd:
        print(f"Serving nextwave PWA at http://localhost:{PORT}")
        print("Press Ctrl+C to stop.")
        httpd.serve_forever()


if __name__ == "__main__":
    main()

