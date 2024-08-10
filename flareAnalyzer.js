class FlareAnalizer{
    constructor(angle, radius, width, height){

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

    }

    render(){
        push();
        noFill();
        stroke(255);
        rectMode(CENTER);
        rotate(radians(this.angle));
        line(0,0,this.radius,0);
        translate(this.radius + this.height/2, 0);
        rotate(HALF_PI);
        
        rect(0,0,this.width,this.height);
        let lineY = this.height/2 - (this.amplitude*this.height);
        line(-this.width/2, lineY, this.width/2, lineY);
        stroke(255,255,0);
        lineY = this.height/2 - (this.amplitudeSmooth*this.height);
        line(-this.width/2, lineY, this.width/2, lineY);
        

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

}