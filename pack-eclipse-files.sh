if [ -n "$1" ]; then
   API_VER=$1
else
   API_VER='7'
fi

echo "API version: $API_VER"

rm ./eclipse-files-API$API_VER.zip
rm ./eclipse-files-API$API_VER-test.zip

START_DIR=`pwd`
cd ./sources/apk-API$API_VER
zip ../../eclipse-files-API$API_VER.zip \
    ./.classpath \
    ./.project
cd $START_DIR

cd ./sources/apk-API$API_VER-test
zip ../../eclipse-files-API$API_VER-test.zip \
    ./.classpath \
    ./.project
cd $START_DIR
