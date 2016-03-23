#!/usr/bin/env bash

# Error trap and message
set -e
trap 'echo "";echo "";echo "------------------------";echo "FAILED !";echo "------------------------"' ERR

#!/bin/bash
cd "$(dirname "$0")"

./ember-clean.sh

echo "------------------------"
echo "BUILDING 'ember deploy production'"
echo "------------------------"

#ember build --environment=production --output-path=../webapp/static/
node_modules/.bin/ember deploy production;
