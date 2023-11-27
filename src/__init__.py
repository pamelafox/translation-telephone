import os

from flask import Flask
from azure.identity import DefaultAzureCredential
from azure.keyvault.secrets import SecretClient

def create_app(config=None):
    app = Flask(__name__)
    db_user = os.environ.get("DBUSER", "postgres")
    db_pass = os.environ.get("DBPASS", "postgres")
    db_host = os.environ.get("DBHOST", "localhost:5432")
    db_name = os.environ.get("DBNAME", "transtel")
    db_uri = f"postgresql://{db_user}:{db_pass}@{db_host}/{db_name}"

    # Get Azure Translate API Key from Azure Key Vault
    credential = DefaultAzureCredential()
    secret_client = SecretClient(os.environ.get("AZURE_KEY_VAULT_ENDPOINT"), credential)
    translate_api_key = secret_client.get_secret(os.environ.get("AZURE_COGNITIVE_SERVICE_KEY")).value
    os.environ["AZURE_TRANSLATE_API_KEY"] = translate_api_key
    app.config["SQLALCHEMY_DATABASE_URI"] = db_uri
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    if config:
        app.config.update(config)
    from . import models, routes

    models.init_app(app)
    routes.init_app(app)
    return app
