#!/usr/bin/env bash
touch generated-searchIndex.json
touch generated-nameFacts.json
node ./convertCSVtoJSON.js
