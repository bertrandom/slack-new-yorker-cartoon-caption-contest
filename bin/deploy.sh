#!/bin/bash

# https://www.baeldung.com/linux/bash-get-location-within-script#4-full-bash-script-location
SCRIPT_PATH="${BASH_SOURCE}"
while [ -L "${SCRIPT_PATH}" ]; do
  SCRIPT_DIR="$(cd -P "$(dirname "${SCRIPT_PATH}")" >/dev/null 2>&1 && pwd)"
  SCRIPT_PATH="$(readlink "${SCRIPT_PATH}")"
  [[ ${SCRIPT_PATH} != /* ]] && SCRIPT_PATH="${SCRIPT_DIR}/${SCRIPT_PATH}"
done
SCRIPT_PATH="$(readlink -f "${SCRIPT_PATH}")"
SCRIPT_DIR="$(cd -P "$(dirname -- "${SCRIPT_PATH}")" >/dev/null 2>&1 && pwd)"

# Okay, let's define some directories
MAIN_DIR="$(realpath "$SCRIPT_DIR/..")"
DATA_CARTOONS_DIR="$(realpath "$SCRIPT_DIR/../data/cartoons")"

rsync --exclude-from=.gitignore --exclude=.git -av $MAIN_DIR/ bertrand@server:/web/slack-new-yorker-cartoon-caption-contest/
rsync -av $DATA_CARTOONS_DIR/ bertrand@server:/web/slack-new-yorker-cartoon-caption-contest/data/cartoons/
scp config/prod.json5 bertrand@server:/web/slack-new-yorker-cartoon-caption-contest/config/