import datetime
import random

import pytest

import src


@pytest.fixture()
def client(app):
    return app.test_client()


@pytest.mark.parametrize(
    ["path", "title"],
    [
        ("/", "Translation Telephone"),
        ("/recent", "Translation Telephone: Recent"),
        ("/popular", "Translation Telephone: Popular"),
        ("/yours", "Translation Telephone: Yours"),
    ],
)
def test_html_routes(client, path, title):
    response = client.get(path)
    assert response.status_code == 200
    assert f"<title>{title} </title>" in str(response.data)


def test_translate_route(client, monkeypatch):
    monkeypatch.delenv("AZURE_TRANSLATE_API_KEY", raising=False)
    monkeypatch.setattr(src.routes, "translate_with_azure", lambda text, t, f: ("hola", None, "AZURE"))
    response = client.post("/translate", json={"text": "hi", "from": "en", "to": "es"})
    response_json = response.get_json()
    assert response_json["text"] == "hola"
    assert response_json["status"] == "success"


def test_translate_route_error(client, monkeypatch):
    monkeypatch.delenv("AZURE_TRANSLATE_API_KEY", raising=False)
    monkeypatch.setattr(src.routes, "translate_with_azure", lambda text, t, f: (None, "Error", "AZURE"))
    response = client.post("/translate", json={"text": "hi", "from": "en", "to": "esp"})
    response_json = response.get_json()
    assert response_json["status"] == "error"
    assert response_json["message"] == "Error"


def test_rounds_get_by_id(client, session):
    round = src.models.RoundModel(message="Hi", translations={"es": "Hola"})
    session.add(round)
    session.commit()
    response = client.get(f"/rounds/{round.id}")
    assert response.status_code == 200
    response_json = response.get_json()
    assert response_json["status"] == "success"
    assert response_json["round"]["id"] == 1
    assert response_json["round"]["message"] == "Hi"
    assert response_json["round"]["translations"] == {"es": "Hola"}
    assert response_json["round"]["views"] == 2


def test_rounds_get_by_id_404(client, session):
    response = client.get("/rounds/1")
    assert response.status_code == 404


def test_rounds_post(client, session):
    round_data = {
        "translations": [
            {"language": "ENGLISH", "message": "seize the day!"},
            {"language": "MONGOLIAN", "message": "тэр өдрийг нь хураан ав!"},
            {"language": "NORWEGIAN", "message": "plukk opp dagen!"},
            {"language": "POLISH", "message": "odbierz dzień!"},
            {"language": "SERBIAN", "message": "Da dobijem dan!"},
            {"language": "WELSH", "message": "I gael y diwrnod!"},
            {"language": "PUNJABI", "message": "ਦਿਨ ਬਿਤਾਉਣ ਲਈ!"},
            {"language": "KAZAKH", "message": "Күнді өткізу үшін!"},
            {"language": "KOREAN", "message": "하루를 지나치려면!"},
            {"language": "SPANISH", "message": "¡Para pasar el día!"},
            {"language": "AMHARIC", "message": "ቀኑን ለማሳለፍ!"},
            {"language": "GEORGIAN", "message": "დღის გასატარებლად!"},
            {"language": "LITHUANIAN", "message": "Praleisti dieną!"},
            {"language": "ENGLISH", "message": "Spend the day!"},
        ],
        "usergen": True,
        "message": "seize the day!",
        "language": "ENGLISH",
        "endmessage": "Spend the day!",
    }
    response = client.post("/rounds", json=round_data)
    assert response.status_code == 200
    response_json = response.get_json()
    assert response_json["status"] == "success"
    assert response_json["round"]["message"] == round_data["message"]
    assert response_json["round"]["translations"] == round_data["translations"]
    assert response_json["round"]["views"] == 1


def test_rounds_post_bybot(client, session):
    round_data = {
        "translations": [
            {"language": "ENGLISH", "message": "seize the day!"},
            {"language": "MONGOLIAN", "message": "тэр өдрийг нь хураан ав!"},
            {"language": "NORWEGIAN", "message": "plukk opp dagen!"},
            {"language": "POLISH", "message": "odbierz dzień!"},
            {"language": "SERBIAN", "message": "Da dobijem dan!"},
            {"language": "WELSH", "message": "I gael y diwrnod!"},
            {"language": "PUNJABI", "message": "ਦਿਨ ਬਿਤਾਉਣ ਲਈ!"},
            {"language": "KAZAKH", "message": "Күнді өткізу үшін!"},
            {"language": "KOREAN", "message": "하루를 지나치려면!"},
            {"language": "SPANISH", "message": "¡Para pasar el día!"},
            {"language": "AMHARIC", "message": "ቀኑን ለማሳለፍ!"},
            {"language": "GEORGIAN", "message": "დღის გასატარებლად!"},
            {"language": "LITHUANIAN", "message": "Praleisti dieną!"},
            {"language": "ENGLISH", "message": "Spend the day!"},
        ],
        "usergen": False,
        "message": "seize the day!",
        "language": "ENGLISH",
        "endmessage": "Spend the day!",
    }
    response = client.post("/rounds", json=round_data)
    assert response.status_code == 200
    response_json = response.get_json()
    assert response_json["status"] == "success"
    assert response_json["round"]["message"] == round_data["message"]
    assert response_json["round"]["translations"] == round_data["translations"]
    assert response_json["round"]["views"] == 1


@pytest.fixture()
def fake_rounds(session):
    r1 = src.models.RoundModel(message="Hi", translations={"es": "Hola"}, views=1)
    r2 = src.models.RoundModel(message="Bye", translations={"es": "Adios"}, views=5)
    r3 = src.models.RoundModel(message="I", translations={"es": "Yo"}, views=2)
    # session.bulk_save_objects([r1, r2, r3])
    session.add(r1)
    session.add(r2)
    session.add(r3)
    session.commit()
    # Now update their dates so that r3 is the most recent
    fake_datetime = datetime.datetime.now()
    r1.date = fake_datetime
    r2.date = fake_datetime + datetime.timedelta(seconds=10)
    r3.date = fake_datetime + datetime.timedelta(seconds=20)
    session.commit()


def test_rounds_get_recent(client, session, fake_rounds):
    response = client.get("/rounds?num=2&order=recent")
    assert response.status_code == 200
    response_json = response.get_json()
    assert response_json["status"] == "success"
    assert len(response_json["rounds"]) == 2
    assert response_json["rounds"][0]["message"] == "I"
    assert response_json["rounds"][1]["message"] == "Bye"


def test_rounds_get_popular(client, session, fake_rounds):
    response = client.get("/rounds?num=10&order=popular")
    assert response.status_code == 200
    response_json = response.get_json()
    assert response_json["status"] == "success"
    assert len(response_json["rounds"]) == 3
    assert response_json["rounds"][0]["message"] == "Bye"
    assert response_json["rounds"][1]["message"] == "I"


def test_rounds_get_popular_random(client, session, fake_rounds):
    random.seed(2)
    response = client.get("/rounds?num=3&order=popular")
    assert response.status_code == 200
    response_json = response.get_json()
    assert response_json["status"] == "success"
    assert len(response_json["rounds"]) == 3
    assert response_json["rounds"][0]["message"] == "I"
    assert response_json["rounds"][1]["message"] == "Hi"
