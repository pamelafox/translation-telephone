import json

from src import translations


def test_translate_with_azure(requests_mock):
    fake_response = [{"translations": [{"text": "pruebas 1 2 3", "to": "es"}]}]
    requests_mock.post(
        "https://api.cognitive.microsofttranslator.com/translate", text=json.dumps(fake_response)
    )
    translation, error, source = translations.translate_with_azure("testing 1 2 3", "en", "es")
    assert translation == "pruebas 1 2 3"
    assert error is None
    assert source == "AZURE"


def test_translate_with_azure_error(requests_mock):
    fake_response = {"error": {"code": 400036, "message": "The target language is not valid."}}
    requests_mock.post(
        "https://api.cognitive.microsofttranslator.com/translate", text=json.dumps(fake_response)
    )
    translation, error, source = translations.translate_with_azure("testing 1 2 3", "en", "esp")
    assert translation is None
    assert error == "The target language is not valid."
    assert source == "AZURE"
