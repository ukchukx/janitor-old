#!/bin/bash
cd frontend && npm i && npm run build && cd ..
docker build -t janitor .
