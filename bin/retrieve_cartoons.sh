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
DATA_GIT_DIR="$(realpath "$SCRIPT_DIR/../data/caption-contest-data")"
DATA_GIT_CARTOONS_DIR="$(realpath "$SCRIPT_DIR/../data/caption-contest-data/cartoons")"
DATA_CARTOONS_DIR="$(realpath "$SCRIPT_DIR/../data/cartoons")"

if [ -d "$DATA_GIT_DIR" ] 
then
    cd "$DATA_GIT_DIR"
    git pull --rebase
else
    git clone https://github.com/nextml/caption-contest-data.git $DATA_GIT_DIR
fi

mkdir -p $DATA_CARTOONS_DIR
touch "$DATA_CARTOONS_DIR/index.html"
rsync -av $DATA_GIT_CARTOONS_DIR/* $DATA_CARTOONS_DIR