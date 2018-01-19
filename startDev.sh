#!/bin/sh

case "$1" in
    dev)
		export EBENEZER_API_URL=localhost
		export EBENEZER_API_PORT=3000
	;;
    fia)
		export EBENEZER_API_URL='fiasps.unitec.edu'
		export EBENEZER_API_PORT=8060
	;;
esac

npm run dev