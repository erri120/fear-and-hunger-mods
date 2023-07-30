#!/usr/bin/env bash

current_dir="$(dirname -- "$(readlink -f -- "$0";)";)"

cd $current_dir/always-win-coin-tosses
zip erri120_AlwaysWinCoinTosses.zip erri120_AlwaysWinCoinTosses.js

cd $current_dir/unlocked-fps
zip erri120_UnlockedFPS.zip erri120_UnlockedFPS.js

