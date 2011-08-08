APP_VER=`cat version`

if [ -z "$APP_VER" ]; then
   echo "no version file found!"
   exit
fi

echo "Application version: $APP_VER"

START_DIR=`pwd`
for i in 7
do
   API_VER=$i
   echo "Building for API: $API_VER, Application version: $APP_VER"
   cd $START_DIR/apk-API$API_VER
   # ../copy-to-assets.sh # done in build.xml
   ant release
   cp ./bin/*-unsigned.apk $START_DIR/xtd-API$API_VER-$APP_VER.apk
done
