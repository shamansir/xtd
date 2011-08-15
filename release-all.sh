#APP_VER=`cat version`

#if [ -z "$APP_VER" ]; then
#   echo "no version file found!"
#   exit
#fi

#echo "Application version: $APP_VER"

START_DIR=`pwd`
for i in 7
do
   API_VER=$i
   echo "Building for API: $API_VER"
   cd $START_DIR/sources/apk-API$API_VER
   ant release
done

cd $START_DIR

