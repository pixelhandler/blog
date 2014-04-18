#!/bin/bash

client_dir="$(dirname `pwd`)/client"
example_env_file=$client_dir"/env-example.js"
env_file=$client_dir"/app/env.js"

echo "Check if "$env_file" exists..."
if [ -e $env_file ]; then
  echo "Yep, found "$env_file
else
  echo "Nope, "$env_file" not found"
  cp $example_env_file $env_file
  echo "Copied "$example_env_file" to "$env_file
fi

unset client_dir
unset example_env_file
unset env_file
