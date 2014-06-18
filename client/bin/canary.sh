#!/bin/bash

CLIENT_DIR="$(dirname `pwd`)/client"
VENDOR_DIR=$CLIENT_DIR"/vendor"
DEV_DIR=$VENDOR_DIR"/development"
PROD_DIR=$VENDOR_DIR"/production"

function remove_file() {
  # $1 - filename
  echo "Try to remove "$1
  if [ -e $1 ]; then
    rm $1
    echo "Removed "$1
  fi
}

function update_file_via_curl() {
  # $1 - filename, $2 - url
  remove_file $1
  echo "Download "$2" to "$1
  curl -o $1 $2
}

file=$DEV_DIR"/ember.js"
src="http://builds.emberjs.com/canary/ember.js"
update_file_via_curl $file $src

unset CLIENT_DIR
unset VENDOR_DIR
unset DEV_DIR
unset PROD_DIR
unset file
unset src
unset update_file_via_curl
unset remove_file
