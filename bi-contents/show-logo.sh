#!/bin/bash
curl -d '{ "content": "http://blue-indico-tvs-manager.s3-website-eu-west-1.amazonaws.com/logo.html","type": "web" }' -H  "Content-Type: application/json"  -X POST  http://localhost/content
