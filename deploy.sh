#!/usr/bin/env bash

# Error trap and message
set -e
trap 'echo "";echo "";echo "------------------------";echo "FAILED !";echo "------------------------"' ERR

cd ../../thymeleaf-extras-cache-dialect; git pull; mvn clean install;
cd ../topspectrum/topspectrum-common-webmvc; git pull; mvn clean install;
cd ../../dotfeedback/dotfeedback-lib; git pull; mvn clean install;

cd ../../dotfeedback/dotfeedback-free; git pull; mvn clean deploy;

