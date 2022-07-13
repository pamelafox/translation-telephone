from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate


def create_app(config=None):
    app = Flask(__name__)
    app.config["SQLALCHEMY_DATABASE_URI"] = "postgresql://postgres:postgres@localhost:5432/pamelafox"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    if config:
        app.config.update(config)
    from . import models, routes

    models.init_app(app)
    routes.init_app(app)
    return app
