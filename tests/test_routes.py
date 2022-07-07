import unittest.mock

import pytest

import src


@pytest.fixture()
def client():
    return src.app.test_client()


@pytest.fixture()
def fake_(monkeypatch):
    monkeypatch.delenv("GOOGLE_API_KEY", raising=False)
    monkeypatch.setattr(src, "get_worksheet_data", lambda _: [])


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
    monkeypatch.setattr(src.translations, "translate_with_azure", lambda text, t, f: ("hola", None))
    response = client.post("/translate", json={"text": "hi", "from": "en", "to": "es"})
    response_json = response.get_json()
    assert response_json["text"] == "hola"
    assert response_json["status"] == "success"


def test_translate_route_error(client, monkeypatch):
    monkeypatch.delenv("AZURE_TRANSLATE_API_KEY", raising=False)
    monkeypatch.setattr(
        src.translations, "translate_with_azure", lambda text, t, f: (None, "Error")
    )
    response = client.post("/translate", json={"text": "hi", "from": "en", "to": "esp"})
    response_json = response.get_json()
    assert response_json["status"] == "error"
    assert response_json["message"] == "Error"
