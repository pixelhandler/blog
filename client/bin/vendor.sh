#!/bin/bash

CLIENT_DIR="$(dirname `pwd`)/client"
BOWER_DIR=$CLIENT_DIR"/bower_components"
VENDOR_DIR=$CLIENT_DIR"/vendor"
DEV_DIR=$VENDOR_DIR"/development"
PROD_DIR=$VENDOR_DIR"/production"

rm -fr $DEV_DIR/*canary*

if [ ! -d $VENDOR_DIR ]; then
  echo "Creating vendor directory"
  mkdir $VENDOR_DIR
fi

if [ ! -d $DEV_DIR ]; then
  echo "Creating vendor/development directory"
  mkdir -p $DEV_DIR
fi

if [ ! -d $PROD_DIR ]; then
  echo "Creating vendor/production directory"
  mkdir -p $PROD_DIR
fi

function copy_file() {
  # $1 - filename, $2 - src directory, $3 - vendor directory
  SRC_FILE=$2"/"$1
  DEST_FILE=$3"/"$1
  echo "Try to remove... "$DEST_FILE
  if [ -e $DEST_FILE ]; then
    rm $DEST_FILE
    echo "Removed... "$DEST_FILE
  fi
  echo "Try to copy... "$SRC_FILE
  cp $SRC_FILE $DEST_FILE
  echo "Copied to..."
  find $3 -name "*"$1 -type f | xargs echo
}

src=$BOWER_DIR"/jquery/dist"
copy_file jquery.js $src $DEV_DIR
copy_file jquery.min.js $src $PROD_DIR

src=$BOWER_DIR"/handlebars"
copy_file handlebars.js $src $DEV_DIR
copy_file handlebars.min.js $src $PROD_DIR

src=$BOWER_DIR"/ember"
copy_file ember.js $src $DEV_DIR
copy_file ember.min.js $src $PROD_DIR

src=$BOWER_DIR"/ember-data"
copy_file ember-data.js $src $DEV_DIR
copy_file ember-data.min.js $src $PROD_DIR

src=$BOWER_DIR"/showdown"
copy_file showdown.js $src"/src" $DEV_DIR
copy_file showdown.js $src"/compressed" $PROD_DIR

src=$BOWER_DIR"/momentjs"
copy_file moment.js $src $DEV_DIR
copy_file moment.min.js $src"/min" $PROD_DIR

unset CLIENT_DIR
unset VENDOR_DIR
unset BOWER_DIR
unset DEV_DIR
unset PROD_DIR
unset src
unset copy_file
