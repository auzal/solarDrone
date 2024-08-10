let player;
let frameCount = 300;
let loadImageNum = 0;
let synth;
let freqs = [51.91, 100.8, 327.5, 349.3, 393.0, 436.7, 491.2, 524.0, 589.5];
let ampOffsets = [1, 0.8, 0.8, 0.7, 0.6, 0.5, 0.4, 0.35, 0.3];
let stepCount = 9;
let sunDiameter = 578;
let videoFPS = 20;

let state = 'loading';

function preload(){
	debugFont = loadFont('assets/RobotoMono-ExtraLight.ttf');
	
}

// ----------------------------------------------------------------

function setup() {

  var cnv = createCanvas(800, 800);
  var x = (windowWidth - width) / 2;
  var y = (windowHeight - height) / 2;
  cnv.position(x, y);


  player = new FramePlayer(frameCount, 'assets/frames/flare-', 6, videoFPS);
  synth = new FlareSynth(width/2, height/2, sunDiameter, stepCount);
 
}

// ----------------------------------------------------------------

function draw() {
  background(0);

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
  } 


  
}

// ----------------------------------------------------------------

function renderLoading(){
	push();
	textAlign(CENTER, CENTER);
	textFont(debugFont);
	textSize(14);
	fill(255);
	text("loading",width/2, height/2);
	let rectW = width/4;
	stroke(255,30);
	strokeWeight(2);
	translate(width/2 - rectW/2, height/2 + 20);
	line(0,0,rectW,0);
	stroke(255);
	line(0,0,(loadImageNum/frameCount)*rectW,0);
	pop();
}

// ----------------------------------------------------------------

function renderWaiting(){
	push();
	textAlign(CENTER, CENTER);
	textFont(debugFont);
	textSize(14);
	fill(255);
	text("click",width/2, height/2);
	
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
  if(loadImageNum === frameCount && state == 'loading'){
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
