if [ -n "$1" ]; then
   API_VER=$1
else
   API_VER='7'
fi

echo "API version: $API_VER"

START_DIR=`pwd`
cd ./sources/apk-API$API_VER
zip ../../eclipse-files-API$API_VER.zip \
    ./.classpath \
    ./.project
cd $START_DIR
