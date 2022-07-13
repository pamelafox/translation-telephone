import requests
import uuid
import os


def translate_with_azure(text, from_lang, to_lang):
    endpoint = "https://api.cognitive.microsofttranslator.com"
    location = "westus2"
    path = "/translate"
    constructed_url = endpoint + path
    params = {"api-version": "3.0", "from": from_lang, "to": to_lang}
    headers = {
        "Ocp-Apim-Subscription-Key": os.environ.get("AZURE_TRANSLATE_API_KEY", "NoKeyFound"),
        "Ocp-Apim-Subscription-Region": location,
        "Content-type": "application/json",
        "X-ClientTraceId": str(uuid.uuid4()),
    }
    body = [{"text": text}]

    request = requests.post(constructed_url, params=params, headers=headers, json=body)
    response = request.json()
    if (type(response) is dict) and (err := response.get("error", None)):
        return None, err["message"], "AZURE"
    return response[0]["translations"][0]["text"], None, "AZURE"

