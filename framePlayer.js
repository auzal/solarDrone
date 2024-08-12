class FramePlayer{

    constructor(frameCount, path, padding, fps){

        this.frames = [];
        this.index = 0;
        this.fps = fps;
        this.loadImages(path, padding, frameCount);
        this.frameWidth = 0;
        this.frameHeight = 0;

        this.frameDuration = 1000 / this.fps;
        this.lastFrameFire = 0;
        this.lastFrame = 0;
        this.timeAcum = 0;
        this.newFrame = false;
        this.step = 1;



    }

    // ----------------------------------------------------------------

    loadImages(path, padding, frameCount){

        for (let i=0; i < frameCount; i++) {
            let filename = path + nf(i+1,6) + '.png';
           // console.log(filename);
            this.frames[i] = loadImage(filename, loadSuccess, loadFail);
          }
    }

    // ----------------------------------------------------------------

    init(){
        this.frameWidth = this.frames[0].width;
        this.frameHeight = this.frames[0].height;
        this.lastFrameFire = millis();
        this.lastFrame = millis();
        this.newFrame = true;

    }

    // ----------------------------------------------------------------

    render(){

        push();
            
        translate(width/2 - this.frameWidth/2, height/2 - this.frameHeight/2);
        image(this.frames[this.index], 0, 0);
        
                
        pop();

        this.renderProgressBar();    
    
    
    }

    // ----------------------------------------------------------------

    update(){

        this.timeAcum += (millis() - this.lastFrame);
        this.lastFrame = millis();

        if(this.timeAcum > this.frameDuration){
            this.index += this.step;
            if(this.index >= this.frames.length){
                this.index = this.frames.length-2;
                this.step = -1;
            }else if(this.index < 0){
                    this.index = 1;
                    this.step = 1;
            }
            
            this.newFrame = true;
            this.timeAcum -= this.frameDuration;
        }
        
        
    }

    // ----------------------------------------------------------------

    renderProgressBar(){
     
       
        push();
        let barHeight = 2;
        translate(0, height);
        fill(0,0,0);
        noStroke();
        rect(0,0,this.frameWidth, -barHeight);
        fill(242, 190, 92);
        rect(0,0,this.index/this.frames.length * this.frameWidth, -barHeight);
        pop();
      
    }

    // ----------------------------------------------------------------

    getFrame(){
        return(this.frames[this.index]);
    }

    // ----------------------------------------------------------------

    lowerNewFrameFlag(){
        this.newFrame = false;
    }

    // ----------------------------------------------------------------


}


// TO DO : 
// implement fps
