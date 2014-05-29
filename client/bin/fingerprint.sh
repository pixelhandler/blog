#!/bin/bash

CLIENT_DIR="$(dirname `pwd`)/client"
PUBLIC_DIR=$CLIENT_DIR"/public"
STYLES_DIR=$PUBLIC_DIR"/stylesheets"
INDEX_FILE=$PUBLIC_DIR"/index.html"

# For dry run... add option -d or --dry-run
# `bin/fingerprint.sh -d`
# `bin/fingerprint.sh --dry-run`

# To skip changes to index.html... add option -s or --skip-index
# `bin/fingerprint.sh -s`
# `bin/fingerprint.sh --skip-index`

dry_run=false
skip_index=false
if [ "$1" == "--dry-run" -o "$1" == "-d" -o "$2" == "--dry-run" -o "$2" == "-d" ]; then
  echo "Dry run..."
  dry_run=true
fi
if [ "$1" == "--skip-index" -o "$1" == "-s" ]; then
  echo "Skipping index.html changes..."
  skip_index=true
fi
if [ $skip_index = false -a $dry_run = false ]; then
  cp $INDEX_FILE $INDEX_FILE"~"
fi

# To use CDN links in index.html... add option -c or --use-cdn
# `bin/fingerprint.sh -c`
# `bin/fingerprint.sh --use-cdn`

use_cdn=false
if [ "$1" == "--use-cdn" -o "$1" == "-c" ]; then
  echo "Using CDN..."
  use_cdn=true
fi

cdn_path="\/\/s3.amazonaws.com\/cdn.pixelhandler.com\/stylesheets"
stylesheets="\/stylesheets"

function fingerprint() {
  file_name=$1
  if [ -e $1 ]; then
    file_hash=`openssl md5 $1`
    arr_file_hash=(`echo $file_hash | sed -e 's/=/\n/g'`)
    md5_hash=${arr_file_hash[1]}

    OLD_IFS="$IFS"
    IFS="."
    arr_file_name=( $file_name )
    IFS="$OLD_IFS"

    hashed_file_name=${arr_file_name[0]}"-"${md5_hash}"."${arr_file_name[1]}
    if [ ${arr_file_name[1]} == 'css' ]; then
      if [ $dry_run = false ]; then
        gzip --best $hashed_file_name
      fi
      echo "gzip'd CSS file: "$hashed_file_name
    fi
    if [ $dry_run = false ]; then
      cp $file_name $hashed_file_name
    fi
    echo "Copied "$file_name" to "$hashed_file_name

    if [ -e $INDEX_FILE ]; then
      arr_file_name=(${file_name//\// })
      match_fine_name=${arr_file_name[${#arr_file_name[@]} - 1]}

      hashed_file_name=(${hashed_file_name//\// })
      replace_file_name=${hashed_file_name[${#hashed_file_name[@]} - 1]}

      if [ $dry_run = false -a $skip_index = false ]; then
        sed -i.bak -e "s/$match_fine_name/$replace_file_name/g" $INDEX_FILE
      fi
      if [ $skip_index = false ]; then
        echo "Replaced link "$hashed_file_name" with "$replace_file_name" in "$INDEX_FILE
      fi
    fi
  fi
}

fingerprint $PUBLIC_DIR"/app.js"
fingerprint $PUBLIC_DIR"/env.js"
fingerprint $PUBLIC_DIR"/vendor.js"
fingerprint $STYLES_DIR"/normalize.css"
fingerprint $STYLES_DIR"/app.css"


if [ -e $INDEX_FILE ]; then
  if [ $dry_run = false -a $skip_index = false ]; then
    if [ $use_cdn = true ]; then
      sed -i.bak -e "s/$stylesheets/$cdn_path/g" $INDEX_FILE
    fi
  fi
  if [ $dry_run = true -a $use_cdn = true ]; then
    echo "Changed ${stylesheets} link to use ${cdn_path}"
  fi
fi

unset dry_run
unset skip_index
unset CLIENT_DIR
unset PUBLIC_DIR
unset STYLES_DIR
unset INDEX_FILE
unset fingerprint
unset cdn_path
unset stylesheets
