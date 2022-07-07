import os
import random

from flask import Flask, render_template, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from sqlalchemy.sql import func

import translations

app = Flask(__name__)
app.config[
    "SQLALCHEMY_DATABASE_URI"
] = "postgresql://postgres:postgres@localhost:5432/pamelafox"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db = SQLAlchemy(app)
migrate = Migrate(app, db)


class RoundModel(db.Model):
    __tablename__ = "rounds"

    id = db.Column(db.Integer, primary_key=True)
    message = db.Column(db.String())
    endmessage = db.Column(db.String())
    language = db.Column(db.String())
    translations = db.Column(db.JSON())
    date = db.Column(db.DateTime(timezone=True), server_default=func.now())
    views = db.Column(db.SmallInteger(), default=1)
    usergen = db.Column(db.Boolean(), default=True)

    def __repr__(self):
        return f"<RoundModel {self.message}>"

    def to_dict(self):
        return {
            "id": self.id,
            "message": self.message,
            "translations": self.translations,
            "views": self.views,
        }


def is_debug():
    if os.environ["SERVER_SOFTWARE"].startswith("Dev"):
        return True
    else:
        return False


# TODO: Cache-Control headers
@app.route("/")
def homepage():
    return render_template("index.html")


@app.route("/recent")
def recent():
    return render_template("recent.html")


@app.route("/popular")
def popular():
    return render_template("popular.html")


@app.route("/yours")
def yours():
    return render_template("yours.html")


@app.route("/rounds/<round_id>", methods=["GET"])
def round(round_id):
    round = RoundModel.query.get_or_404(round_id)
    round.views += 1
    db.session.add(round)
    db.session.commit()
    return jsonify({"status": "success", "round": round.to_dict()})


@app.route("/rounds", methods=["GET", "POST"])
def rounds():
    if request.method == "POST":
        round = RoundModel()
        round.translations = request.json["translations"]
        round.message = request.json["message"]
        round.language = request.json["language"]
        round.endmessage = request.json["endmessage"]
        if request.json["usergen"] == "false":
            round.usergen = False
        db.session.add(round)
        db.session.commit()
        return jsonify({"status": "success", "round": round.to_dict()})

    elif request.method == "GET":
        order = request.args.get("order")
        num = int(request.args.get("num"))
        if order == "-views" and num < 5:  # Get 5 random popular ones
            rounds = (
                RoundModel.query.filter(RoundModel.usergen == True) # noqa
                .order_by(RoundModel.views.desc())
                .limit(30)
            )
            random.shuffle(rounds)
            rounds = rounds[0:num]
        elif order == "-views":
            rounds = (
                RoundModel.query.filter(RoundModel.usergen == True) # noqa
                .order_by(RoundModel.views.desc())
                .limit(num)
            )
        else:
            rounds = (
                RoundModel.query.filter(RoundModel.usergen == True) # noqa
                .order_by(RoundModel.date.desc())
                .limit(num)
            )
        return jsonify({"status": "success", "rounds": [r.to_dict() for r in rounds]})


@app.route("/translate", methods=["POST"])
def translate():
    text = request.json["text"]
    from_lang = request.json["from"]
    to_lang = request.json["to"]
    result = translations.translate_with_azure(text, from_lang, to_lang)[0]
    if result.get("error"):
        return "Error", 420
        # TODO: if over quota, try yandex
    return jsonify({"text": result["translations"][0]["text"], "code": 200})


if __name__ == "__main__":
    # This is used when running locally only. When deploying to Google App
    # Engine, a webserver process such as Gunicorn will serve the app. This
    # can be configured by adding an `entrypoint` to app.yaml.
    # Flask's development server will automatically serve static files in
    # the "static" directory. See:
    # http://flask.pocoo.org/docs/1.0/quickstart/#static-files. Once deployed,
    # App Engine itself will serve those files as configured in app.yaml.
    app.run(host="127.0.0.1", port=8080, debug=True)
