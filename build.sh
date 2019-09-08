#!/bin/bash
cd frontend && npm run build && cd ..
docker build -t janitor .
