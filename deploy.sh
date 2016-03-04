# Error trap and message
set -e
trap 'echo "";echo "";echo "------------------------";echo "FAILED !";echo "------------------------"' ERR

cd ../../topspectrum/topspectrum-common-webmvc; git pull; mvn clean install;
cd ../../dotfeedback/dotfeedback-lib; git pull; mvn clean install;
cd ../../dotfeedback/dotfeedback-free/src/main/javascript/; rm -rf node_modules/; rm -rf bower_components/; npm install && bower install && ember deploy production;
cd ../../../;
cd ../../dotfeedback/dotfeedback-free; git pull; mvn clean package beanstalk:upload-source-bundle beanstalk:create-application-version beanstalk:update-environment
