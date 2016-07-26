#!/bin/bash
# Error trap and message
set -e
trap 'echo "";echo "";echo "------------------------";echo "FAILED !";echo "------------------------"' ERR

cd "$(dirname "$0")"
cd ../../topspectrum/topspectrum-common-webmvc; git pull; mvn clean install;
cd ../../dotfeedback/dotfeedback-lib; git pull; mvn clean install;

mvn deploy
