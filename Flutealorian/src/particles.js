const particlesArray = [];

class Particle{
    constructor(){
    this.x = player.x + player.width/2;
    this.y = player.y + player.height + 10;
    this.size = (Math.random() * 20) + 10;
    this.speedY = (Math.random() * 3);
    this.color = 'hsla(1, 50%, 100%, 0.08)';                                         
    }
    update(){
        this.x -= backgroundSpeed;
        this.y += this.speedY + 3;
    }
    draw(){
        if(player.y < canvas.height - player.height){
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 9 );
            ctx.fill();
        }
    }
}

function handleParticles(){
    particlesArray.unshift(new Particle);
    for(i=0; i< particlesArray.length; i++){
        particlesArray[i].update();
        particlesArray[i].draw();
    }
    if(particlesArray.length > 200){
        for(let i = 0; i< 20; i++){
            particlesArray.pop(particlesArray[i]);
        }
    }
}