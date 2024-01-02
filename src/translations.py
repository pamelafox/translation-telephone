import os
import uuid

import requests


def translate_with_azure(text, from_lang, to_lang):
    url = "https://api.cognitive.microsofttranslator.com/translate"
    # REGION_NAME is read-only env var from App Service Environment
    # Reference: https://learn.microsoft.com/azure/app-service/reference-app-settings#app-environment
    location = os.environ.get("REGION_NAME", "NoRegionFound")
    params = {"api-version": "3.0", "from": from_lang, "to": to_lang}
    headers = {
        "Ocp-Apim-Subscription-Key": os.environ.get("AZURE_TRANSLATE_API_KEY", "NoKeyFound"),
        "Ocp-Apim-Subscription-Region": location,
        "Content-type": "application/json",
        "X-ClientTraceId": str(uuid.uuid4()),
    }
    body = [{"text": text}]

    request = requests.post(url, params=params, headers=headers, json=body)
    response = request.json()
    if (type(response) is dict) and (err := response.get("error", None)):
        return None, err["message"], "AZURE"
    return response[0]["translations"][0]["text"], None, "AZURE"
