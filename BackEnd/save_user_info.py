import codecs
import os
import sqlite3
import sys
import time
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import parse_qs

project_folder = Path(__file__).resolve().parent.parent
database_file = Path(__file__).with_name("UserData.db")
schema_file = Path(__file__).with_name("UserData.sql")
fields = ["name", "email", "company-name", "title", "message"]


def show_startup_message(encoded_message):
    decoded_message = codecs.decode(encoded_message, "rot_13")
    delay = 10 / (len(encoded_message) + len(decoded_message))
    green = "\033[92m" if sys.stdout.isatty() else ""
    red = "\033[91m" if sys.stdout.isatty() else ""
    dim = "\033[90m" if sys.stdout.isatty() else ""
    reset = "\033[0m" if sys.stdout.isatty() else ""

    message = ""
    for letter in encoded_message:
        message += letter
        print(f"\r{red}{message}{reset}", end="", flush=True)
        time.sleep(delay)

    time.sleep(5)

    for index in range(1, len(decoded_message) + 1):
        message = (
            f"{green}{decoded_message[:index]}"
            f"{red}{encoded_message[index:]}{reset}"
        )
        print(f"\r{message}", end="", flush=True)
        time.sleep(delay)

    print(file=sys.stdout)


def setup_database():
    connection = sqlite3.connect(database_file)
    try:
        connection.executescript(schema_file.read_text(encoding="utf-8"))
    finally:
        connection.close()


def save_user_info(user_info):
    connection = sqlite3.connect(database_file)
    try:
        with connection:
            connection.execute(
                """
                INSERT INTO UserData (name, email, company_name, title, message)
                VALUES (?, ?, ?, ?, ?)
                """,
                (
                    user_info["name"],
                    user_info["email"],
                    user_info["company-name"],
                    user_info["title"],
                    user_info["message"],
                ),
            )
    finally:
        connection.close()


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

            form = parse_qs(
                self.rfile.read(length).decode("utf-8"),
                keep_blank_values=True,
            )
        except (ValueError, UnicodeDecodeError):
            self.reply(400)
            return

        user_info = {field: form.get(field, [""])[0].strip() for field in fields}
        if any(not value for value in user_info.values()):
            self.reply(400)
            return

        try:
            save_user_info(user_info)
        except sqlite3.Error as error:
            print(f"Could not save contact form: {error}")
            self.reply(500)
            return

        self.reply(204)


class LocalServer(ThreadingHTTPServer):
    allow_reuse_address = False


if __name__ == "__main__":
    setup_database()
    port = int(os.environ.get("PORT", "8000"))
    try:
        server = LocalServer(("127.0.0.1", port), ContactHandler)
    except OSError:
        server = LocalServer(("127.0.0.1", 0), ContactHandler)

    print(f"Open http://127.0.0.1:{server.server_port}")
    encoded_message = (
        "Onpxraq qbar ol gur TBNG, gur yrtraq, AbeguFuvsg uvzfrys. "
        "Naljnl, gur freire vf jbexvat."
    )
    show_startup_message(encoded_message)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        server.server_close()
