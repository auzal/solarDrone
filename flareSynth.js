class FlareSynth{

    constructor(x, y, diam, stepCount){

        this.x = x;
        this.y = y;
        this.diam = diam;
        this.analyzers = [];
        this.sampleWidth = 20;
        this.sampleHeight =40;

        this.samplerX = 0;
        this.samplerY = 0;
        this.samplerRadius = 200;
        this.samplerAngle = 0;
        this.filterFreq = 0;

        for(let i = 0 ; i < stepCount ; i++){
            this.analyzers[i] = new FlareAnalizer((360/stepCount * i) - 90, this.diam/2, this.sampleWidth, this.sampleHeight, i+1, freqs[i]); 
        }

        this.lowPass = new p5.LowPass();
        

      
        this.oscillators = [];
        for(let i = 0 ; i < stepCount ; i++){
            this.oscillators[i] = new p5.Oscillator(freqs[i], 'sine');
            this.oscillators[i].amp(0);
            this.oscillators[i].disconnect();
            this.oscillators[i].connect(this.lowPass); 
        }
        
    }

    // ----------------------------------------------------------------

    init(){
        for(let i = 0 ; i < stepCount ; i++){
            this.oscillators[i].start();
           
        }
    }

    // ----------------------------------------------------------------

    render(){
        push();
        translate(this.x,this.y);
        noFill();
        stroke(255,0,0);
      //  ellipse(0,0,this.diam,this.diam);
        
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
      //  rect(0,0,10,10);
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
       // rotate(radians(45));
        //translate(30,0);
        rotate(radians(-45));
        line(4 + UIMargin ,0, 35 - UIMargin,0);
        //ellipse(40,0,20,20);
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

    newFrame(frame){

        for(let i = 0 ; i < this.analyzers.length ; i++){
            this.analyzers[i].takeSample(frame);
            this.analyzers[i].analyze(); 
        }

    }

    update(frame){

        for(let i = 0 ; i < this.analyzers.length ; i++){
         //   this.analyzers[i].changeAngle(0.1); 
            this.analyzers[i].update(); 

            
        }

        for(let i = 0 ; i < stepCount ; i++){
            let amp = this.analyzers[i].getAmplitudeSmooth() * ampOffsets[i];
       
            this.oscillators[i].amp(amp);
           
        }


       this.samplerAngle -=0.2;
       this.samplerX = cos(radians(this.samplerAngle)) * this.samplerRadius;
       this.samplerY = sin(radians(this.samplerAngle)) * this.samplerRadius;

    //   this.samplerX = mouseX ; 
     //  this.samplerY = mouseY;

       this.samplerValue = brightness(frame.get(int(this.samplerX) + frame.width/2, int(this.samplerY) +frame.height/2)) / 100.0;
       // console.log(int(this.samplerX) + frame.width/2);
     //  let  lp_freq = constrain(map(mouseY, height, 0, 10, 500), 10, 600);
       this.filterFreq = constrain(map(this.samplerValue, 0, 1.0, 200, 600), 200, 600);
       //console.log(lp_freq);
       this.lowPass.freq(this.filterFreq);
       this.lowPass.amp(0.2);
     
    }

    // ----------------------------------------------------------------

    renderData(){

        push();
        noFill();
        let spacing = 60;
        
        translate(spacing, height - 50);
       // ellipse(0,0,20,20);
        for(let i = 0 ; i < this.analyzers.length ; i++){
            this.analyzers[i].renderData();
            translate(this.analyzers[i]. width + spacing,0);
        }

        pop();

        //fill(255,0,0);
       // text(frameRate(), 50, 100);

      this.renderFilter();


    }

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
      // line(20,0,25,0);
       
       pop();


       pop();
    }

    // ----------------------------------------------------------------

    logMaxAmplitudes(){
        for(let i = 0 ; i < this.analyzers.length ; i ++){
            let amp = this.analyzers[i].maxAmplitude;
            console.log(amp);
        }
    }
    

}



