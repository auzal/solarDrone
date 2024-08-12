let player;
let frameNum = 300;
//frameNum = 20;
let loadImageNum = 0;
let synth;
let freqs = [51.91, 100.8, 327.5, 349.3, 393.0, 436.7, 491.2, 80.0, 589.5];
let ampOffsets = [1, 0.8, 0.8, 0.7, 0.6, 0.5, 0.4, 0.35, 0.3];
let stepCount = 9;
let sunDiameter = 578;
let videoFPS = 20;

let state = 'loading';

let grain = [];

let UIMargin = 6;

function preload(){
	debugFont = loadFont('assets/benderregular.otf');
  grain = loadImage("assets/grain.jpg");
	
}

// ----------------------------------------------------------------

function setup() {

  var cnv = createCanvas(800, 900);
  var x = (windowWidth - width) / 2;
  var y = (windowHeight - height) / 2;
  cnv.position(x, y);


  player = new FramePlayer(frameNum, 'assets/frames/flare-', 6, videoFPS);
  synth = new FlareSynth(width/2, height/2, sunDiameter, stepCount);
  loadGrainFrames();
  strokeWeight(1);
 
}

// ----------------------------------------------------------------

function draw() {
  background(0,0,0);

  updateState();


  if(state == 'loading'){
    renderLoading();
  }else if(state == 'waiting'){
    renderWaiting();
  }else if(state == 'running'){
    
  
    player.update();
    player.render();
    if(player.newFrame){
      synth.newFrame(player.getFrame());
      player.lowerNewFrameFlag();
    }
    synth.update(player.getFrame());
    synth.render();

    blendMode(OVERLAY);
    image(grain[frameCount%4], 0, 0);
    blendMode(BLEND);

    stroke(255);
    noFill();
    rect(0, 0,width, height);
  } 


  
}

// ----------------------------------------------------------------

function renderLoading(){
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
	line(0,0,(loadImageNum/frameNum)*rectW,0);
	pop();
}

// ----------------------------------------------------------------

function renderWaiting(){
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
	loadImageNum ++;
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
  if(loadImageNum === frameNum + 4 && state == 'loading'){
    loaded = true;
    state = 'waiting';
  }else if(state == 'waiting'){
    if(mouseIsPressed){
      player.init();
      synth.init();
      initialized = true;
      state = 'running';
    }
  }
}

// ----------------------------------------------------------------

function loadGrainFrames(){
  for (let i=0; i < 4; i++) {
    let filename = 'assets/grain-' + (i+1) + '.jpg';
    grain[i] = loadImage(filename, loadSuccess, loadFail);
  }
}
