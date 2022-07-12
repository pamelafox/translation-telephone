from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate


def create_app():
    app = Flask(__name__)
    from . import models, routes

    models.init_app(app)
    routes.init_app(app)
    return app
