#!/bin/bash

CLIENT_DIR="$(dirname `pwd`)/client"
BOWER_DIR=$CLIENT_DIR"/bower_components"
STYLESHEETS_DIR=$CLIENT_DIR"/app/stylesheets"

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

src=$BOWER_DIR"/normalize-css"
copy_file normalize.css $src $STYLESHEETS_DIR

unset CLIENT_DIR
unset BOWER_DIR
unset STYLESHEETS_DIR
unset src
unset copy_file
