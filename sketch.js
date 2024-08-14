// solar drone
// by ariel uzal
// auzal.net


// CONFIG

let frameNumber = 300; // how many animation frames to load
let freqs = [51.91, 80.0, 100.8, 327.5, 349.3, 393.0, 436.7, 491.2, 589.5]; //frequencies for each oscillator
let ampOffsets = [1, 0.8, 0.8, 0.7, 0.6, 0.5, 0.4, 0.35, 0.3]; //amplitude offsets for each oscillator, make every 
let waveform = 'sine'; // waveform for oscillators. Currently all are the same. Options are: 'sine', 'triangle', 'sawtooth', 'square'
let sunDiameter = 578; // in pixels, diameter of the sun in downloaded video frames
let videoFPS = 20; // video playback speed
let state = 'loading'; // state machine for controlling image loading and audio context
let UIMargin = 6; // in pixels, margin for connecting lines
let analyzerCount = 9; // how many analyzers and oscillators at once

// OBJECTS

let synth; // the synth object, contains oscillators and flare analyzers
let framePlayer; // the frame player for the solar frame video
let infoButton; // little button to display project info

// MISC

let grain = []; // grain images to overlay on video
let infoDiv; // little div that contains project info
let loadedImageNumber = 0; // variable for controlling image loading
p5.disableFriendlyErrors = true; // turn off friendly error system

 
// ----------------------------------------------------------------

function preload(){
	debugFont = loadFont('assets/benderregular.otf'); // load font file
}

// ----------------------------------------------------------------

function setup(){ 
  // create and position canvas
  let canvas = createCanvas(800, 900);
  let canvasX = (windowWidth - width) / 2;
  let canvasY = (windowHeight - height) / 2;
  canvas.position(canvasX, canvasY);

  //create and initialize frame player and synth objects
  framePlayer = new FramePlayer(frameNumber, 'assets/frames/flare-', 6, videoFPS);
  synth = new FlareSynth(width/2, height/2, sunDiameter, analyzerCount);

  //load grain overlay images
  loadGrainFrames();
  
  //set global stroke weight
  strokeWeight(1);

  // create and hide project information div
  infoDiv = createDiv('EACH NUMBERED RECTANGLE ANALYZES HOW MUCH SOLAR FLARE ACTIVITY IT CONTAINS. <br> THIS VALUE IS USED TO CONTROL DE AMPLITUDE OF A FIXED FREQUENCY OSCILLATOR. <br> A ROTATING BRIGHTNESS ANALYZER CONTROLS THE CUTOFF FOR A LOW PASS FILTER.<br><br> BY <a href="https://auzal.net" target="_blank"> ARIEL UZAL</a>');
  infoDiv.position(windowWidth/2 - 500, windowHeight/2 + 100);
  infoDiv.size(200,190);
  infoDiv.id("info");
  infoDiv.hide();

  // create button to show or hide info
  infoButton = new Button("I", 70, height-120, 15); 
}

// ----------------------------------------------------------------

function draw() {

  background(0,0,0);

  // run state machine
  updateState();
  if(state == 'loading'){
    renderLoading();
  }else if(state == 'waiting'){
    renderWaiting();
  }else if(state == 'running'){
    // if everything has started
  
    // update and render the video player
    framePlayer.update();
    framePlayer.render();

    // if there's a new frame available, send it to the synth to analyze
    if(framePlayer.newFrame){
      synth.newFrame(framePlayer.getFrame());
      framePlayer.lowerNewFrameFlag();
    }

    // update and render the synth
    synth.update(framePlayer.getFrame());
    synth.render();

    // add grain 
    renderGrain();

    // render information button
    infoButton.render();
  } 
  // render border for sketch
  renderBorder();
}

// ----------------------------------------------------------------

function renderLoading(){
  // render loading bar for images
	push();
	textAlign(CENTER, CENTER);
	textFont(debugFont);
	textSize(16);
	fill(255);
	text("LOADING",width/2, height/2);
	let rectW = width/4;
	stroke(255,30);
	strokeWeight(2);
	translate(width/2 - rectW/2, height/2 + 20);
	line(0,0,rectW,0);
	stroke(255);
	line(0,0,(loadedImageNumber/frameNumber)*rectW,0);
	pop();
}

// ----------------------------------------------------------------

function renderWaiting(){
  // render waiting screen
	push();
	textAlign(CENTER, CENTER);
	textFont(debugFont);
	textSize(16);
	fill(255);
	text("CLICK",width/2, height/2);
	
	pop();
}

// ----------------------------------------------------------------

function loadSuccess(){
	loadedImageNumber ++;
}

// ----------------------------------------------------------------

function loadFail(){
  console.log('Failed to load image');
}

// ----------------------------------------------------------------

function keyPressed(){
 // synth.logMaxAmplitudes();
}

// ----------------------------------------------------------------

function updateState(){
  // handle state changes
  if(loadedImageNumber === frameNumber && state == 'loading'){
    loaded = true;
    state = 'waiting';
  }else if(state == 'waiting'){
    if(mouseIsPressed){
      framePlayer.init();
      synth.init();
      initialized = true;
      state = 'running';
    }
  }
}

// ----------------------------------------------------------------

function loadGrainFrames(){
  // load grain images
  frameNumber += 4;
  for (let i=0; i < 4; i++) {
    let filename = 'assets/grain-' + (i+1) + '.jpg';
    grain[i] = loadImage(filename, loadSuccess, loadFail);
  }
}

// ----------------------------------------------------------------

function mousePressed(){
  // handle info button press
  if(state =='running'){
    if(infoButton.checkClick()){
      var x = document.getElementById("info");
      if (x.style.display === "none") {
        infoDiv.show();
      }else{
        infoDiv.hide();
      }
    }
  }
}

// ----------------------------------------------------------------

function renderGrain(){
  // render grain images
  blendMode(OVERLAY);
  image(grain[frameCount%4], 0, 0);
  blendMode(BLEND);
}

// ----------------------------------------------------------------

function renderBorder(){
  // render sketch border
  stroke(255);
  noFill();
  rect(0, 0,width, height);
}

// ----------------------------------------------------------------