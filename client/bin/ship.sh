#!/bin/bash

# ./bin/ship.sh [username]
# $1 - username

# For dry run... add option -d or --dry-run
# ./bin/ship [username] -d
# ./bin/ship [username] --dry-run

if [ "$2" == "--dry-run" -o "$2" == "-d" ]; then
  echo "Dry run..."
  dry_run=true
else
  dry_run=false
fi

CLIENT_DIR="$(dirname `pwd`)/client"
DIST="dist"
PUBLIC="public"
SRC=$CLIENT_DIR"/"$DIST"/"
APP="/home/"$1"/www/blog/client/"
DOMAIN="pixelhandler.com"
DEPLOY_TO="$(date +%s)"
DEST=$APP$DEPLOY_TO"/"
DIR=$APP$PUBLIC

echo "Setup deploy target directory..."
CMD="cd "$APP" && mkdir ./"$DEPLOY_TO
#" && sudo chown "$1":www-data ./"$DEPLOY_TO
echo "Sending command to remote: "
echo $CMD
ssh $1@$DOMAIN $CMD

echo "Push up files to remote deploy directory"
if [ $dry_run = false ]; then
  echo "rsync ${SRC} to ${1}@${DOMAIN}:${DEST}"
  rsync -vrhe ssh --progress --exclude '*.css' --exclude 'fonts' $SRC $1@$DOMAIN:$DEST
else
  echo "Dry run... rsync ${SRC} to ${1}@${DOMAIN}:${DEST}"
  rsync -vrhe ssh --dry-run --progress --exclude '*.css' --exclude 'fonts' $SRC $1@$DOMAIN:$DEST
fi

#scp -r -v -i $CLIENT_DIR/public $1@pixelhandler.com:/home/$1/www/blog/client/public/

if [ $dry_run = false ]; then
  CMD="cd "$APP" && mv ./"$PUBLIC" ./last && ln -s ./"$DEPLOY_TO" ./"$PUBLIC
  echo "Move 'public' directory to 'last' and create a new 'public' symlink to deploy directory..."
  echo "Sending command to remote: "
  echo $CMD
  ssh $1@$DOMAIN $CMD
else
  echo 'Dry run, remove deploy target directory'
  CMD="cd "$APP" && rm -fr "$DEPLOY_TO
  echo $CMD
  ssh $1@$DOMAIN $CMD
fi

unset CLIENT_DIR
unset PUBLIC
unset SRC
unset APP
unset DIST
unset DOMAIN
unset DEPLOY_TO
unset DEST
unset DIR
unset CMD
unset dry_run
