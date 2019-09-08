#!/bin/sh
# Start Gunicorn processes
echo Starting Gunicorn.
exec gunicorn -b 0.0.0.0:20000 -w 1 janitor.wsgi
