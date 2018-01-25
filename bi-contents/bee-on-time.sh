#!/bin/bash
curl -d '{ "content": "https://bee-on-time-92bd5.firebaseapp.com/","type": "web" }' -H  "Content-Type: application/json"  -X POST  http://localhost/content
