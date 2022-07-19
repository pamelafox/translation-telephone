import os

from src import create_app

app = create_app()

if __name__ == "__main__":
    app.run(debug=not os.environ.get("WEBSITE_HOSTNAME"))
