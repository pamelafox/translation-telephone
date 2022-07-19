from sqlalchemy.sql import func

from .database import db, migrate


def init_app(app):
    db.init_app(app)
    migrate.init_app(app, db)


class RoundModel(db.Model):
    __tablename__ = "rounds"

    id = db.Column(db.Integer, primary_key=True)
    message = db.Column(db.String())
    endmessage = db.Column(db.String())
    language = db.Column(db.String())
    translations = db.Column(db.JSON())
    date = db.Column(db.DateTime(timezone=True), server_default=func.now())
    views = db.Column(db.SmallInteger(), default=1)
    funny_count = db.Column(db.SmallInteger(), default=0)
    deeep_count = db.Column(db.SmallInteger(), default=0)
    flags_count = db.Column(db.SmallInteger(), default=0)
    usergen = db.Column(db.Boolean(), default=True)

    def to_dict(self):
        return {
            "id": self.id,
            "message": self.message,
            "language": self.language,
            "translations": self.translations,
            "views": self.views,
            "funny_count": self.funny_count,
            "deeep_count": self.deeep_count,
            "flags_count": self.flags_count,
            "date": self.date,
        }
