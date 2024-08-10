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

        for(let i = 0 ; i < stepCount ; i++){
            this.analyzers[i] = new FlareAnalizer((360/stepCount * i) - 90, this.diam/2, this.sampleWidth, this.sampleHeight); 
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

      

       // this.renderDebug();
    }
    
    // ----------------------------------------------------------------

    renderFilterSampler(){

        push();

        noFill();
        stroke(255);
        ellipse(this.samplerX,this.samplerY,5,5);
        line(this.samplerX, this.samplerY, 0, 0);
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
       let  lp_freq = constrain(map(this.samplerValue, 0, 1.0, 200, 600), 200, 600);
       //console.log(lp_freq);
       this.lowPass.freq(lp_freq);
       this.lowPass.amp(0.1);
     
    }

    // ----------------------------------------------------------------

    renderDebug(){

        push();
        noFill();
        let spacing = 10;
        stroke(255,40);
        
        translate(spacing, spacing);
       // ellipse(0,0,20,20);
        for(let i = 0 ; i < this.analyzers.length ; i++){

            image(this.analyzers[i].sampleImage,0,0); 
            rect(0,0,this.analyzers[i].sampleImage.width, this.analyzers[i].sampleImage.height);
            translate(this.analyzers[i].sampleImage.width + spacing,0);
        }

        pop();

        fill(255,0,0);
        text(frameRate(), 50, 100);

    }

    // ----------------------------------------------------------------

    logMaxAmplitudes(){
        for(let i = 0 ; i < this.analyzers.length ; i ++){
            let amp = this.analyzers[i].maxAmplitude;
            console.log(amp);
        }
    }
    

}



