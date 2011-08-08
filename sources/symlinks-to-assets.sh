if [ -n "$1" ]; then
   API_VER=$1
else
   API_VER='7'
fi

echo "API version: $API_VER"

START_DIR=`pwd`
APK_DIR="./apk-API$API_VER"
rm -Rf $APK_DIR/assets/*
cd ./js
for i in *.js
do
  echo "Link for $i ..."
  ln -s ../../js/$i ../$APK_DIR/assets/$i
done
cd $START_DIR

