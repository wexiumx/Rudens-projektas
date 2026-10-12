import json
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from threading import Lock
from urllib.parse import parse_qs

project_folder = Path(__file__).resolve().parent.parent
user_info_file = Path(__file__).with_name("UserInfo.json")
save_lock = Lock()


class ContactHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(project_folder), **kwargs)

    def log_message(self, format, *args):
        return

    def reply(self, status):
        self.send_response(status)
        self.end_headers()

    def do_POST(self):
        if self.path != "/submit":
            self.reply(404)
            return

        try:
            length = int(self.headers.get("Content-Length", "0"))
            if length <= 0 or length > 1000000:
                self.reply(400)
                return

            form = parse_qs(self.rfile.read(length).decode("utf-8"), keep_blank_values=True)
        except (ValueError, UnicodeDecodeError):
            self.reply(400)
            return

        fields = ["name", "email", "company-name", "title", "message"]
        user_info = {field: form.get(field, [""])[0].strip() for field in fields}
        if any(not value for value in user_info.values()):
            self.reply(400)
            return

        try:
            with save_lock:
                text = user_info_file.read_text(encoding="utf-8").strip() if user_info_file.exists() else ""
                saved_users = json.loads(text) if text else []
                if not isinstance(saved_users, list):
                    self.reply(500)
                    return
                saved_users.append(user_info)
                user_info_file.write_text(json.dumps(saved_users, indent=2) + "\n", encoding="utf-8")
        except (json.JSONDecodeError, OSError) as error:
            print(f"Could not save contact form: {error}")
            self.reply(500)
            return

        self.reply(204)


if __name__ == "__main__":
    server = ThreadingHTTPServer(("127.0.0.1", 8000), ContactHandler)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        server.server_close()
