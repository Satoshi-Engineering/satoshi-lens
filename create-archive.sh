#!/bin/bash

mkdir -p dist
name=$(date '+%Y-%m-%d_%H%M%S')
zip -r "dist/release_$name.zip" manifest.json iconmenu icons background.js content-script.js converter.js editor.js