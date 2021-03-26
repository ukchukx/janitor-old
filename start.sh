#!/bin/sh
# Start Gunicorn processes
echo Starting Gunicorn.
exec gunicorn -b 0.0.0.0:8000 -w 1 janitor.wsgi
