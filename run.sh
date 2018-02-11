#!/usr/bin/env bash


CODEDIR=/home/aw/projects/biblicalNamesWebhook/biblicalNamesWebhook

## explicitly source settings file (where environment vars are defined)
## To consider: move CLIACKATELL_AUTH_TOKEN, HYDRO_CONTROL, HYDRO_CONTROL_KEY
## here instead.
. /home/aw/projects/Hydrobalcony/apiKeys.sh

## to make relative paths work
cd $CODEDIR

## Environment variables
. $CODEDIR/tokens.sh

## exec, to follow existing thread (service-PID will be accurate). Fire!
exec /home/aw/.nvm/versions/node/v8.9.4/bin/node ./bin/www
