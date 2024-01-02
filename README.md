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

To deploy your own instance, follow these steps:

1. Sign up for a [free Azure account](https://azure.microsoft.com/free/?WT.mc_id=python-79461-pamelafox)
2. Install the [Azure Dev CLI](https://learn.microsoft.com/azure/developer/azure-developer-cli/install-azd?WT.mc_id=python-79461-pamelafox). (If you open this repository in Codespaces or with the VS Code Dev Containers extension, that part will be done for you.)
3. Initialize a new `azd` environment:

    ```shell
    azd init
    ```

    It will prompt you to provide a name (like "flask-app") that will later be used in the name of the deployed resources.

4. Provision and deploy all the resources:

    ```shell
    azd up
    ```

    It will prompt you to login, pick a subscription, and provide a location (like "eastus"). Then it will provision the resources in your account and deploy the latest code. If you get an error with deployment, changing the location (like to "centralus") can help, as there may be availability constraints for some of the resources.

5. When azd has finished deploying, you'll see an endpoint URI in the command output. Visit that URI and you should see the website and be able to translate messages.

6. For the website to work fully (i.e. save translations to the database), you must migrate the database. Navigate to the App Service in the Azure Portal, select SSH, and run this command once you're in the SSH terminal:

```shell
flask db upgrade
```

6. When you've made any changes to the app code, you can just run:

    ```shell
    azd deploy
    ```
