#!/bin/bash
cd frontend && npm install && npm run build && cd ..
docker build -t janitor .
