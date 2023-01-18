#!/bin/bash

draw_one() {
	local NAME=$1
	NAMEENCODED=$(node -e "console.log(encodeURIComponent('${NAME}'))")
	qrencode \
		--size=10 \
		--inline \
		--symversion=3 \
		--type=SVG \
		--output=temp-qr.svg \
		"davidhomeventory://${NAMEENCODED}"
	magick -size 1000x1000 -background white  \
		-font "Source-Code-Pro-Bold" \
		-pointsize 108 \
		-gravity North \
		caption:"${NAME}" \
		-rotate 90 \
		temp-bg-with-text.png
	magick -size 2100x1510 xc:white \
		-draw "image multiply 800,255 0,0 'temp-bg-with-text.png'" \
		-draw "image multiply 0,0 1510,1510 'temp-qr.svg'" \
		"result-${NAMEENCODED}.png"
	echo "${NAME}. done"
}

rm result-*
rm temp-*
rm tiles-*
rm tile-*

# Make Fixed titles
for NAME in "Beépített szekrény teteje" "Beépített szekrény alja" "Ágytartó" "Ágyalatt" "Pince" "Hálószoba Szekrény Alja" "Hálószoba Szekrény Teteje" "BarnaSzekrény" "Fürdőszoba"; do
	draw_one "${NAME}"
done

# Make automatic titles
for NAME in {1..6}; do
	NAME=$(node index.js)
	draw_one "${NAME}"
done

magick montage result-* -tile 3x5 -geometry 2100x1510+0+0 tile.png
magick -size 6300x8910 -density 300x300 xc:white tile.png -gravity center -composite result.pdf
echo "done"