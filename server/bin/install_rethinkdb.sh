#!/bin/bash

echo "Install rethinkdb..."

if hash rethinkdb 2>/dev/null; then
  echo "rethinkdb already installed"
else
  if hash brew 2>/dev/null; then
    echo "brew installed, installing rethinkdb"
    brew update && brew install rethinkdb
  else
    echo "brew required, but not installed, aborting."
  fi
fi
