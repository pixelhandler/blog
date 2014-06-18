#!/bin/bash

CLIENT_DIR="$(dirname `pwd`)/client"
VENDOR_DIR=$CLIENT_DIR"/vendor"
BOWER_DIR=$CLIENT_DIR"/bower_components"
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

function clone_and_build() {
  # $1 - url, $2 - dir

  repo=$BOWER_DIR/$2
  if [ ! -d $repo ]; then
    echo "Clone "$1" to "$repo
    mkdir $VENDOR_DIR
    git clone $1 $repo
  else
    echo "Pull "$repo
    cd $repo
    git fetch origin
    git pull origin master
  fi

  cd $repo
  npm install
  grunt package
}

file="ember-orbit"
src="https://github.com/orbitjs/ember-orbit.git"
clone_and_build $src $file

unset CLIENT_DIR
unset VENDOR_DIR
unset BOWER_DIR
unset DEV_DIR
unset PROD_DIR
unset file
unset src
unset remove_file
unset clone_and_build
