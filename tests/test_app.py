import unittest.mock

import pytest

import app


@pytest.fixture()
def client():
    return app.app.test_client()


@pytest.fixture()
def fake_worksheet_data(monkeypatch):
    monkeypatch.delenv("GOOGLE_API_KEY", raising=False)
    monkeypatch.setattr(src, "get_worksheet_data", lambda _: [])


def test_homepage(client):
    response = client.get("/")
    assert response.status_code == 200
    assert b"I am a human" in response.data

