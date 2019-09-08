# Janitor

An app to schedule and download periodic database backups.

## To run
Add your hostname to `ALLOWED_HOSTS` in `janitor/settings.py`.
Set the `JANITOR_DEBUG` environment variable to `True` if you want the app to run in `DEBUG` mode.

With Docker:
* Build a Docker image with `./build.sh`
* Start the Docker container with `docker-compose up`.
* Access the app on port 20000.

Without Docker (plain Django):
* Install requirements with `pip install -r requirements.txt`.
* Start the app with `python manage.py runserver`.
* Visit [localhost:8000](http://localhost:8000).
