# Translation Telephone

This web app is fun online version of the classic "Telephone" game - pass a message through a sequence of random languages and see what comes out!

Technologies used:

* Backend:
  * Python 3
  * Flask
  * SQLAlchemy
  * Alembic
  * PostGreSQL
  * Dev Tools: Pytest, Flake8, Black Pre-commit
* Frontend
  * Lit Web Components
  * Dev Tools: ESLint, Lit-Analyzer, Prettier, Rollup

## Local development

Install the dependencies:

```python3 -m pip install -r requirements-dev.txt```

```pre-commit install```

```npm install```

Setup the database:

  ```flask db upgrade```

To run the server:

```npm run dev```

That will watch for frontend changes and re-compile the CSS/JS as needed.

Other useful commands:

* `pytest`: Run all the Python tests.
* `npm run lint`: Run eslint and lit-analyzer.
* `npm run format`: Run prettier over the frontend files.

When attempting to commit, pre-commit will run various checks (black, flake8, eslint, prettier).
A Github action will also run similar checks as well as all the tests.

## Deployment

The app is currently hosted on Microsoft Azure. Specifically:

* Azure App Service
* Azure Database for PostGreSQL flexible server
* Azure Cognitive Services (for Translation)

To deploy your own instance, follow the [tutorial for Flask app + PostGreSQL deployment](https://docs.microsoft.com/en-us/azure/app-service/tutorial-python-postgresql-app) but using this app instead of the sample app.

Make sure you specify the following environment variables in the App Service configuration:

* `DBHOST`, `DBNAME`, `DBPASS`, `DBUSER`: The above linked tutorial shows how to set these.
* `FLASK_APP`: Set to 'src'
* `AZURE_TRANSLATE_API_KEY`: Get this by registering for Azure Cognitive Services.

You will also need to migrate the database by using the App Service SSH and running `flask db upgrade`.
