import requests, uuid, json

def translate_with_azure(text, from_lang, to_lang):
  # TODO: Make it an environment secret
  key = "6fa8272ae3b24d9eae647ce8ba169844"
  endpoint = "https://api.cognitive.microsofttranslator.com"
  location = "westus2"
  path = '/translate'
  constructed_url = endpoint + path
  params = {
    'api-version': '3.0',
    'from': from_lang,
    'to': to_lang
  }
  headers = {
    'Ocp-Apim-Subscription-Key': key,
    'Ocp-Apim-Subscription-Region': location,
    'Content-type': 'application/json',
    'X-ClientTraceId': str(uuid.uuid4())
  }
  body = [{'text': text}]

  request = requests.post(constructed_url, params=params, headers=headers, json=body)
  response = request.json()
  print(response)
  return response
