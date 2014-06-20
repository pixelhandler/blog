#!/bin/bash

# ./bin/ship [username]
# $1 - username

CLIENT_DIR="$(dirname `pwd`)/client"
PUBLIC="public"
SRC=$CLIENT_DIR"/"$PUBLIC"/"
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

echo "Push up files to remote deploy directory..."
echo "rsyc "$SRC" to "$1"@"$DOMAIN":"$DEST
rsync -vrhe ssh --progress --exclude 'stylesheets' --exclude 'fonts' $SRC $1@$DOMAIN:$DEST

#scp -r -v -i $CLIENT_DIR/public $1@pixelhandler.com:/home/$1/www/blog/client/public/

echo "Move 'public' directory to 'last' and create a new 'public' symlink to deploy directory..."
CMD="cd "$APP" && mv ./"$PUBLIC" ./last && ln -s ./"$DEPLOY_TO" ./"$PUBLIC
echo "Sending command to remote: "
echo $CMD
ssh $1@$DOMAIN $CMD


unset CLIENT_DIR
unset PUBLIC
unset SRC
unset APP
unset DOMAIN
unset DEPLOY_TO
unset DEST
unset DIR
unset CMD
