class FlareSynth{

    // synth class
    // handles the analyzers, the oscillators and the filter

    constructor(x, y, diam, analyzerCount){

        // CONFIG:

        this.sampleWidth = 20;
        this.sampleHeight =40;

        this.samplerRadius = 200;

        // OTHER STUFF

        this.x = x;
        this.y = y;
        this.diam = diam;
        this.analyzers = [];
        this.samplerX = 0;
        this.samplerY = 0;
        this.samplerAngle = 0;
        this.filterFreq = 0;

        // create the analyzers

        for(let i = 0 ; i < analyzerCount ; i++){
            this.analyzers[i] = new FlareAnalizer((360/analyzerCount * i) - 90, this.diam/2, this.sampleWidth, this.sampleHeight, i+1, freqs[i]); 
        }

        // create the filter

        this.lowPass = new p5.LowPass();
        
        // create the oscillators

        this.oscillators = [];
        for(let i = 0 ; i < analyzerCount ; i++){
            this.oscillators[i] = new p5.Oscillator(freqs[i], waveform);
            this.oscillators[i].amp(0);
            this.oscillators[i].disconnect();
            this.oscillators[i].connect(this.lowPass); 
        }
    }

    // ----------------------------------------------------------------

    init(){
        // turn oscillators on
        for(let i = 0 ; i < analyzerCount ; i++){
            this.oscillators[i].start();
        }
    }

    // ----------------------------------------------------------------

    newFrame(frame){
        for(let i = 0 ; i < this.analyzers.length ; i++){
            this.analyzers[i].takeSample(frame);
            this.analyzers[i].analyze(); 
        }
    }

    // ----------------------------------------------------------------

    update(frame){
        for(let i = 0 ; i < this.analyzers.length ; i++){
            this.analyzers[i].update(); 
        }
        for(let i = 0 ; i < analyzerCount ; i++){
            let amp = this.analyzers[i].getAmplitudeSmooth() * ampOffsets[i];
            this.oscillators[i].amp(amp);  
        }
        this.samplerAngle -=0.2;
        this.samplerX = cos(radians(this.samplerAngle)) * this.samplerRadius;
        this.samplerY = sin(radians(this.samplerAngle)) * this.samplerRadius;
        this.samplerValue = brightness(frame.get(int(this.samplerX) + frame.width/2, int(this.samplerY) +frame.height/2)) / 100.0;
        this.filterFreq = constrain(map(this.samplerValue, 0, 1.0, 200, 600), 200, 600);
        this.lowPass.freq(this.filterFreq);
        this.lowPass.amp(0.2);
    }

    // ----------------------------------------------------------------

    logMaxAmplitudes(){
        for(let i = 0 ; i < this.analyzers.length ; i ++){
            let amp = this.analyzers[i].maxAmplitude;
            console.log(amp);
        }
    }  

    // ----------------------------------------------------------------

     render(){
        push();
        translate(this.x,this.y);
        noFill();
        stroke(255,0,0);
        for(let i = 0 ; i < this.analyzers.length ; i++){
            this.analyzers[i].render(); 
        }
        this.renderFilterSampler();
        pop();
        this.renderData();
    }
    
    // ----------------------------------------------------------------

    renderFilterSampler(){
        push();
        noFill();
        stroke(255);        
        ellipse(0,0,30,30);
        rotate(radians(this.samplerAngle));
        line(15 + UIMargin,0,this.samplerRadius-4 - UIMargin,0);
        translate(this.samplerRadius, 0);  
        ellipse(0,0,8,8); 
        push();
        rotate(radians(45));
        line(4 + UIMargin ,0, 40 - 10 - UIMargin,0);
        fill(this.samplerValue * 255);
        ellipse(40,0,20,20);
        pop();
        push();
        rotate(radians(-45));
        line(4 + UIMargin ,0, 35 - UIMargin,0);
        translate(45,0);
        rotate(-radians(this.samplerAngle - 45));
        textAlign(CENTER, CENTER);
	    textFont(debugFont);
	    textSize(16);
	    fill(255);
        noStroke();
        text('F', 0, 0);
        pop();
        pop();
    }

    // ----------------------------------------------------------------

    renderData(){
        push();
        noFill();
        let spacing = 60;
        translate(spacing, height - 50);
        for(let i = 0 ; i < this.analyzers.length ; i++){
            this.analyzers[i].renderData();
            translate(this.analyzers[i]. width + spacing,0);
        }
        pop();
        this.renderFilter();
    }

    // ----------------------------------------------------------------

    renderFilter(){
       push();
       translate(width-70, height - 120);
       stroke(255);
       noFill();
       ellipse(0,0,30,30);
       textAlign(CENTER, CENTER);
	   textFont(debugFont);
	   textSize(16);
       noStroke();
       fill(255);
       text("F",0,-2);
       stroke(255);
       rotate(radians(-90));
       push();
       rotate(radians(-135))
       line(20,0,25,0);
       push();
       noStroke();
       textSize(12);
       translate(20,0);
       rotate(-radians(135));
       text("200",-5,10);
       pop();
       pop();
       push();
       rotate(radians(135))
       line(20,0,25,0);
       push();
       noStroke();
       textSize(12);
       translate(20,0);
       rotate(radians(135 + 180));
       text("600",5,10);
       pop();
       pop();
       push();
       stroke(242, 190, 92);
       noFill();
       let currentAngle = map(this.filterFreq, 200, 600, -135, 135);
       arc(0, 0, 45, 45, radians(-135), radians(currentAngle ));
       rotate(radians(currentAngle));
       pop();
       pop();
    }

    // ----------------------------------------------------------------
    
}



