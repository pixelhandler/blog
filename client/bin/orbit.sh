#!/bin/bash

CLIENT_DIR="$(dirname `pwd`)/client"
VENDOR_DIR=$CLIENT_DIR"/bower_components"
EMBER_ORBIT_DIR=$VENDOR_DIR"/ember-orbit"

cd $EMBER_ORBIT_DIR
npm install
grunt package
