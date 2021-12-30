class Player{
    constructor(){
        this.x = 100;
        this.y = 400;
        this.vy = 0;
        this.width = 50;
        this.height = 70;
        this.collision = false;
    }

    update(){
            if(this.y < 0){
                this.y = 0;
                this.vy = 0
            }else if(this.y >= canvas.height-this.height){
                this.y = canvas.height-this.height -1;  // The '-1' is for delete the slowling
                this.vy = 0;
            }else{
                this.y += 0.5;
            }
        }

    draw(){
        ctx.drawImage(mando,this.x, this.y, this.width, this.height);
    }
}

const player = new Player();