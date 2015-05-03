#!/bin/bash

CLIENT_DIR="$(dirname `pwd`)/client"
VENDOR_DIR=$CLIENT_DIR"/bower_components"
EMBER_DIR=$VENDOR_DIR"/ember-canary"

if [ ! -d $EMBER_DIR ]; then
  echo "Creating "$EMBER_DIR" directory"
  mkdir -p $EMBER_DIR
fi

function remove_file() {
  # $1 - filename
  echo "Try to remove "$1
  if [ -e $1 ]; then
    rm $1
    echo "Removed "$1
  fi
}

function update_file_via_curl() {
  # $1 - filename, $2 - url, $3 - directory

  remove_file $1
  echo "Download "$2" to "$1
  curl -o $1 $2
}

file=$EMBER_DIR"/ember.js"
src="http://builds.emberjs.com/canary/ember.js"
update_file_via_curl $file $src $EMBER_DIR

file=$EMBER_DIR"/ember-data.js"
src="http://builds.emberjs.com/canary/ember-data.js"
update_file_via_curl $file $src $EMBER_DIR

unset CLIENT_DIR
unset VENDOR_DIR
unset EMBER_DIR
unset file
unset src
unset update_file_via_curl
unset remove_file
