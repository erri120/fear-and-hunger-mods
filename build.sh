#!/usr/bin/env bash

current_dir="$(dirname -- "$(readlink -f -- "$0";)";)"

cd $current_dir/tails-never-fails
zip erri120_TailsNeverFails.zip erri120_TailsNeverFails.js

cd $current_dir/unlocked-fps
zip erri120_UnlockedFPS.zip erri120_UnlockedFPS.js

