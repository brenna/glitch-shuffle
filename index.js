var nconf = require('nconf')
var bodyParser = require('body-parser')
var dataUriToBuffer = require('data-uri-to-buffer')
var Canvas = require('canvas');
var Image = Canvas.Image;
var express = require('express')
var app = express()

nconf.argv().env().file({ file: 'local.json'})

app.use(bodyParser.json({limit: '2mb'}))
app.use(express.static(__dirname + '/public'))

app.get('/', function(req, res) {
  res.sendFile( __dirname + '/index.html')
})


app.post('/service', function(req, res) {
  var imgBuff = dataUriToBuffer(req.body.content.data)
  var chopped = chop(imgBuff);
  req.body.content.data = chopped;
  req.body.content.type = imgBuff.type
  res.json(req.body)
})

var port = nconf.get('port')
app.listen(port)
console.log('server running on port: ', port)

function chop(buf) {

  var img = new Image;
  img.src = buf;
  var canvas = new Canvas(img.width,img.height);
  var ctx = canvas.getContext('2d');
  var numCuts = rng(5,10);
  var cuts = [];
  var pieces = [];

  //random array of cut points
  for(var i=0; i<numCuts; i++) {
    cuts.push(rng(1, img.height));
  }

  //order the cut points to so we can generate the pieces
  cuts.sort(function(a,b) { return a - b; });

  // n cuts will generate n+1 pieces, so add the height of image
  // to the end of the array so we can loop nicely from 0 to n+1
  cuts.push(img.height);

  for (var i = 0; i< cuts.length; i++){
    var newPiece = {};
    if (i == 0){
        //top piece is a special case
        newPiece.y = 0;
        newPiece.h = cuts[i];
    } else {
        newPiece.y = cuts[i-1];
        newPiece.h = cuts[i] - cuts[i-1];
    }

    pieces.push(newPiece);
  }

  //randomize the order of the pieces
  var shuffled = shuffle(pieces);

  //draw pieces on the canvas
  var filledHeight = 0;
  for(var i=0; i<shuffled.length; i++){
      ctx.drawImage(img, 0, shuffled[i].y, img.width, img.height, 0, filledHeight, img.width, img.height);
      filledHeight += shuffled[i].h;
  }

  buf = canvas.toDataURL();
  return buf
}

function rng(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// Fisher-Yates shuffle
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex ;

  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}
