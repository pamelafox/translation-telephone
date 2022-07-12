import random

from flask import Blueprint, render_template, request, jsonify

from .translations import translate_with_azure
from .models import RoundModel
from .database import db

main = Blueprint("main", __name__, template_folder="templates")


def init_app(app):
    app.register_blueprint(main)


# TODO: Cache-Control headers
@main.route("/")
def homepage():
    return render_template("index.html")


@main.route("/recent")
def recent():
    return render_template("recent.html")


@main.route("/popular")
def popular():
    return render_template("popular.html")


@main.route("/yours")
def yours():
    return render_template("yours.html")


@main.route("/rounds/<round_id>", methods=["GET"])
def round(round_id):
    round = RoundModel.query.get_or_404(round_id)
    round.views += 1
    db.session.add(round)
    db.session.commit()
    return jsonify({"status": "success", "round": round.to_dict()})


@main.route("/rounds", methods=["GET", "POST"])
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
                RoundModel.query.filter(RoundModel.usergen == True)  # noqa
                .order_by(RoundModel.views.desc())
                .limit(30)
            )
            random.shuffle(rounds)
            rounds = rounds[0:num]
        elif order == "-views":
            rounds = (
                RoundModel.query.filter(RoundModel.usergen == True)  # noqa
                .order_by(RoundModel.views.desc())
                .limit(num)
            )
        else:
            rounds = (
                RoundModel.query.filter(RoundModel.usergen == True)  # noqa
                .order_by(RoundModel.date.desc())
                .limit(num)
            )
        return jsonify({"status": "success", "rounds": [r.to_dict() for r in rounds]})


@main.route("/translate", methods=["POST"])
def translate():
    text = request.json["text"]
    from_lang = request.json["from"]
    to_lang = request.json["to"]
    translation, error = translate_with_azure(text, from_lang, to_lang)
    if error:
        # TODO: if over quota, try yandex
        return jsonify({"status": "error", "message": error})
    return jsonify({"status": "success", "text": translation})
