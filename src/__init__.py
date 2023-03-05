import os

from flask import Flask


def create_app(config=None):
    app = Flask(__name__)
    db_user = os.environ.get("DBUSER", "postgres")
    db_pass = os.environ.get("DBPASS", "postgres")
    db_host = os.environ.get("DBHOST", "localhost:5432")
    db_name = os.environ.get("DBNAME", "transtel")
    db_uri = f"postgresql://{db_user}:{db_pass}@{db_host}/{db_name}"
    app.config["SQLALCHEMY_DATABASE_URI"] = db_uri
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    if config:
        app.config.update(config)
    from . import models, routes

    models.init_app(app)
    routes.init_app(app)
    return app
