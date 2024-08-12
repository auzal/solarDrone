class FlareAnalizer{
    constructor(angle, radius, width, height, id, freq){

        this.angle = angle;
        this.radius = radius;
        this.width = width;
        this.height = height;

        this.sampleImage = createGraphics(width, height, WEBGL);
        this.sampleImage.background(random(255),128,0);
        this.brightness = 0;
        this.amplitude = 0;
       // this.newAmplitude = 0;
        this.maxAmplitude = 0;
        this.amplitudeSmooth = 0;
        this.easingFactor = 0.03;
        this.angularSpeed = random(0.03, 0.3);
        this.id = id;
        this.freq = freq;

    }

    render(){
        push();
        noFill();
        stroke(255);
        rectMode(CENTER);
        rotate(radians(this.angle));
        line(15 + UIMargin, 0, this.radius - UIMargin, 0);
        translate(this.radius + this.height/2, 0);
        rotate(HALF_PI);
        
        rect(0,0,this.width,this.height);
        let lineY = this.height/2 - (this.amplitude*this.height);
        line(-this.width/2, lineY, this.width/2, lineY);
      //  stroke(255,255,0);
      //  lineY = this.height/2 - (this.amplitudeSmooth*this.height);
      //  line(-this.width/2, lineY, this.width/2, lineY);
        
        translate(0,-this.height);   
        rotate(-radians(this.angle + 90));
        textAlign(CENTER, CENTER);
	    textFont(debugFont);
	    textSize(16);
	    fill(255);
        noStroke();
        text(this.id, 0, 0);

        pop();
    }

    takeSample(frame){


        let deltaX = cos(radians(this.angle)) * this.radius;
        let deltaY = sin(radians(this.angle)) * this.radius;

        this.sampleImage.push();
        this.sampleImage.imageMode(CENTER);
        this.sampleImage.translate(0, this.height/2); 
        this.sampleImage.rotate(radians(360-this.angle-90));
        this.sampleImage.translate(-deltaX,-deltaY);
        this.sampleImage.image(frame,0,0);
        this.sampleImage.pop();
        
    }

    analyze(){
        this.brightness = 0;

        this.sampleImage.loadPixels();

        let acum = 0;

        for(let i = 0 ; i < this.sampleImage.pixels.length ; i+=4){
            let b = this.sampleImage.pixels[i];
            this.brightness += b;
            acum ++;
        }

        this.brightness = this.brightness/ acum;
        this.amplitude = this.brightness / 255.0;

        if(this.amplitude > this.maxAmplitude  ){

            this.maxAmplitude = this.amplitude;

        }


       // console.log(this.amplitude);

    }


    update(){

        this.amplitudeSmooth = (this.amplitude*this.easingFactor) + ((1-this.easingFactor) * this.amplitudeSmooth);
        this.changeAngle(this.angularSpeed);

    }

    changeAngle(delta){
        this.angle += delta;
    }

    getAmplitude(){
        return(this.amplitude);
    }

    getAmplitudeSmooth(){
        return(this.amplitudeSmooth);
    }

    renderData(){
        push();
        let w = this.width;
        let h =  this.height;
        image(this.sampleImage,0,0);         
            
        push();
        textAlign(CENTER, CENTER);
        textFont(debugFont);
        textSize(14);
        fill(255);
        noStroke();
        text(this.id, w/2, -12);
        textAlign(LEFT, CENTER);
        fill(242, 190, 92);
        text(nf(this.amplitudeSmooth, 0, 2), w + 5, 3);
        fill(255);
        text(nf(this.amplitude, 0, 2), w + 5, 18);
        text(nf(this.freq, 0, 1), w + 5, 33);
        pop();
        // push(this.);
        push();
        translate(w/2, h/2);
        let lineY = h/2 - (this.amplitude*h);
        stroke(255);
        line(-w/2, lineY, w/2, lineY);
        //  pop();
        fill(242, 190, 92,180);
        noStroke();
        lineY =  (this.amplitudeSmooth * h);
        // line(-w/2, lineY, w/2, lineY);
        rect(0-w/2,h/2,w,-lineY);
        pop();

        noFill();
        stroke(255);
        rect(0,0, w, h);
        
        pop();
    }

}