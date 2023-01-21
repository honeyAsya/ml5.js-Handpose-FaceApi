let handpose; //model handpose
let video;
let faceapi; //model faceapi
let state_hand = 'loading'; //condition model handpose
let predictions = []; //handpose handpose
let detections = []; //faceapi results

function setup() {
  myCanvas = createCanvas(640, 480);


  video = createCapture(VIDEO);
  video.size(width, height)


  const faceOptions = { withLandmarks: true, withExpressions: true, withDescriptors: false }; //options for faceapi
  faceapi = ml5.faceApi(video, faceOptions, faceReady);

handpose = ml5.handpose(video, modelReady);

handpose.on("predict", function(results){
  predictions = results;
});
video.hide();
}

function faceReady() { // model faceapi state of readiness
  faceapi.detect(gotFaces);
  console.log("Face-Api ready");
}


function modelReady() { //model handpose state of readiness
console.log("Handpose ready!");
state_hand = 'running';
}

function gotFaces(error, result) { //results of faceapi model
  if (error) {
    console.log(error);
    return;
  }
  detections = result;
  faceapi.detect(gotFaces);
}

function draw() {
  image(video, 0, 0, width, height);
  if (state_hand === 'loading'){
    loading();
  }
 else if (state_hand === 'running') {
  running();
  }
}

function loading(){ //screen during model import
  background(255);
  push();
  textSize(32);
  textStyle(BOLD);
  textAlign(CENTER, CENTER);
  text('Model loading...', width/2, height/2);
  pop();
}

function running() { //start models

drawKeypoints();
FacePoints();
}

function FacePoints(){
  if (detections.length > 0) { //paint faceapi results
    let points = detections[0].landmarks.positions;
    for (let a = 0; a < points.length; a++) {
      stroke(0, 0, 255);
      strokeWeight(4);
      point(points[a]._x, points[a]._y);
    } 
  }
}

function drawKeypoints() { //paint handpose results
  for (let i = 0; i < predictions.length; i += 1) {
    const prediction = predictions[i];
    for (let j = 0; j < prediction.landmarks.length; j += 1) {
      const keypoint = prediction.landmarks[j];
      fill(0, 255, 0);
      noStroke();
      ellipse(keypoint[0], keypoint[1], 5, 5);
    }
  }
}
