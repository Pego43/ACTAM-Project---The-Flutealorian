const obstaclesArray = [];

class Obstacle{
    constructor(note, duration){
        this.note = note;
        this.duration = duration;
        this.stack = stack;
        this.top = canvas.height-((notesHeight*this.note)+ notesHeight + this.stack);
        this.bottom = (notesHeight*this.note) - this.stack;
        this.x = canvas.width; //Da dove iniziano a comparire i blocchi
        //this.width = 30 * duration;
        this.width = 120;
        this.color = 'gold';
        this.counted = false;
        this.endGame = false;
        this.collision = false;
        this.speed = velocity; 
    }

    draw(c){
        if(this.note == -1){
            // Note doesn't not identified
            this.top = 20;
            this.bottom = 20;
            this.color = 'hsla('+ frame + ',100%, 50%, 1)';
        }
        else if(this.note== -2){
            // Pause
            this.top = 1;
            this.bottom = 1;
            this.color = 'hsla('+ frame + ',100%, 50%, 1)';
        }
        else if(this.collision == true){
            c.fillStyle = 'red';
            c.fillRect(this.x, 0, this.width, this.top);
            c.fillRect(this.x,canvas.height - this.bottom, this.width, this.bottom);    
        }else{
            if(this.width<=30){
                c.drawImage(laser, this.x, 0, this.width, this.top);
                c.drawImage(laser, this.x, canvas.height - this.bottom, this.width, this.bottom);
            }else{
                c.fillStyle = this.color;
                c.fillRect(this.x, 0, this.width, this.top);
                c.fillRect(this.x,canvas.height - this.bottom, this.width, this.bottom);
            }

            /* Draw the notes */
            c.lineWidth = 3;
            //Notes taken
            if(player.x >= this.x-5 && !player.collision){
                c.strokeStyle = 'lightgreen';
            }
            //Notes not available
            else if (player.collision && player.collision) c.strokeStyle = 'red';
            //Notes to take
            else c.strokeStyle = background.colorText;

            //If there are note with # ore b
            if(this.note == 1 || this.note == 3 ||this.note == 6 ||this.note == 8 ||this.note == 10){
                c.font = "40px Georgia";
                c.strokeText(noteStrings[this.note], this.x - 50, this.top + 75);
            }else{
                c.font = "50px Georgia";
                c.strokeText(noteStrings[this.note], this.x - 5, this.top + 75);
            }
        }
    }

    updateScore(p){
        if(p.x > this.x && p.collision && !this.collision ){
            score++;
        }
    }

    update(speedSong){
        this.speed = speedSong;
        //this.width = speedSong*60*this.duration;
        this.x -= this.speed;
            if(!this.counted && (this.x+this.width) < 1 && this.note != -1){
                if(!this.collision) score++;
                indexMelody++;
                this.counted = true;
                obstaclesArray.pop(obstaclesArray[0]);
            }
        this.draw(ctx);
    }
}

function undefinedNote(n){
    if (n.innerText == 'undefined'){
        n.innerText = '';
    }
    return n;
}

function handleObstacles(currentNote, currentDur, melodyLength){
    
    if( (counterMelody == 0 && counterMelody < melodyLength)    ||
        (counterMelody < melodyLength && (obstaclesArray[0].x + obstaclesArray[0].width + distance <= canvas.width) )
        ){
            obstaclesArray.unshift(new Obstacle(currentNote,currentDur));   
            counterMelody++;            
    }
    
    // I create my obstacle
        for(let i=0; i < obstaclesArray.length; i++){
            obstaclesArray[i].update(velocity);
        }

    //I delete an obstacle if the length of the array is more then a number
    if(obstaclesArray.length > 30){
       obstaclesArray.pop(obstaclesArray[0]);
    }
}

function addScore(p,o){
    if(p.x > o.x && p.collision == true && o.collision == false){
        score++;
    }
}