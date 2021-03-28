#!/bin/sh
# Start Gunicorn processes
echo Starting Gunicorn.
exec gunicorn janitor.wsgi
