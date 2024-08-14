class Button{
    
    // simple circular button class

    constructor(id, x, y, rad){
        this.position = createVector(x,y);
        this.radius = rad;
        this.id = id;
    }

    // ----------------------------------------------------------------

    render(){
        push();
        translate(this.position.x, this.position.y);
        textAlign(CENTER,CENTER);
        textFont(debugFont);
        textSize(16);
        fill(255);
        noStroke();
        text(this.id,0,-2);
        noFill();
        stroke(255);
        ellipse(0,0,this.radius*2, this.radius*2);
        pop();
    }

    // ----------------------------------------------------------------

    checkClick(){
        let pressed = false;
        if(dist(mouseX, mouseY, this.position.x, this.position.y) < this.radius){
            pressed = true;
        }
        return pressed;
    }

    // ----------------------------------------------------------------

}