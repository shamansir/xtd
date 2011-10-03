Development environment
-----------------------

* Eclipse
* Google Android Tools
* Git
* Apache Ant
* Mozilla Rhino
* Node.js
* Peg.js

Eclipse
-------

Eclipse files with my own system directories could be found at *Downloads* section, this file named `eclipse-files-<version>.zip`, depending of the version it belongs. You can use them to Import Existing Project and then just correct paths, if required. You'll need to extract it to corresponding `./sources/apk-<version>/` folder. Also, ensure you have installed Android Plugin into eclipse.

**Required**: Download a `rhino-*.jar` file from Android Scripting Layer sources (currently [located here](http://code.google.com/p/android-scripting/source/browse/#hg%2Frhino)) and put it to `./sources/apk-*/libs` folder, current version is `rhino1_7R2`. If you are using newer version, correct the `./sources/apk-*/build.properties` file.

To build, you may use Eclipse Android Tools as usual or build from command line, running `ant release` from any `./sources/apk-*/` folder. If you are running Windows,assets symlinks possibly will not be created, you need to create them manually: they point to `./js/*.js files` from `sources/apk-*/assets` folder.
