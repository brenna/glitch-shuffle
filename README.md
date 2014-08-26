#Glitch Shuffle
An express app that abides by the [revist.link spec.](http://revisit.link/spec.html) and glitches out images according to a random shuffle alorithm!

##Installation:
 - `npm install -g nodemon`
 - `npm install`
 - `cp local.json-dist local.json`

##Usage:
 - `npm start`

The API provides a single `/service` endpoint to POST an image to, which
responds with the image as modifified by the shuffle algorithm.

The shuffle algorithm generates between 5 and 10 vertial cut points, slices the image into pieces at these points, then randomly reararranges the peices. 

eg. ![sample shuffled image](https://i.cloudup.com/kks6Kd11WP.png)

This also comes with a sample client interface for posting images to, located
at `/`.

By default the app runs on port 8000, this can be configred in local.json.

