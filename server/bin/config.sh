#!/bin/bash

server_dir="$(dirname `pwd`)/server"
example_env_file=$server_dir"/env-example.json"
env_file=$server_dir"/env.json"

echo "Check if "$env_file" exists..."
if [ -e $env_file ]; then
  echo "Yep, found "$env_file
else
  echo "Nope, "$env_file" not found"
  cp $example_env_file $env_file
  echo "Copied "$example_env_file" to "$env_file
fi

unset server_dir
unset example_env_file
unset env_file
