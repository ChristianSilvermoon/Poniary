#!/bin/bash

if [ "$(command -v convert)" = "" ]; then
	echo "Please ensure ImageMagick is installed!"
	exit 1
fi

if [ "$1" = "" ]; then
	echo "No delay specified, default to 60..."
	delay="60"
else
	delay="$1"
fi

if [ "$1" = "--help" -o "$1" = "-?" ]; then
	echo "USAGE: create.sh [DELAY]"
fi

convert -delay $delay -loop 0 frame_00* result.gif
