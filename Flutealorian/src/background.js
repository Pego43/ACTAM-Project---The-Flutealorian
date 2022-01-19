class Background{
    constructor(cw,ch,s,p,speed){
        this.cw = cw;
        this.ch = ch;
        this.s = s;
        this.p = p;
        this.speed = speed;
        this.colorText = 'lightgray';
        //this.colorText = 'hsla('+ frame + ',100%, 80%, 1)';
        this.back = 200;

        this.b1 = new Image();
        this.b2 = new Image();

        this.BG ={
                x1: 0,
                x2: this.cw,
                y:0,
                width: this.cw,
                height: this.ch
            }
        }
        
        handleBackground(bgValue){
        //Setting background
            switch(bgValue){
                case 1:
                    this.b1.src = 'D1.jpg';
                    this.b2.src = 'D2.jpg';
                    setThreeButtonColors('desertBackground','spaceBackground','shuttleBackground');
                    break;
                case 2:
                    this.b1.src = 'Shuttle1.jpg';
                    this.b2.src = 'Shuttle2.jpg';
                    setThreeButtonColors('shuttleBackground','spaceBackground','desertBackground');
                    break;
                default:
                    this.b1.src = 'Space_1.jpg';
                    this.b2.src = 'Space_2.jpg';
                    setThreeButtonColors('spaceBackground','desertBackground','shuttleBackground');
                    break;
            }
            //Background movement
            if(this.BG.x1 <= -this.BG.width) this.BG.x1 = this.BG.width - backgroundSpeed;
            else this.BG.x1 -= this.s;
            if(this.BG.x2 <= -this.BG.width) this.BG.x2 = this.BG.width - backgroundSpeed;
            else this.BG.x2 -= this.s;
            ctx.drawImage(this.b1, this.BG.x1, this.BG.y, this.BG.width, this.BG.height);
            ctx.drawImage(this.b2, this.BG.x2, this.BG.y, this.BG.width, this.BG.height);
            
            //Draw the note played from the player
            ctx.lineWidth = 1;
            ctx.font = '35px Georgia';
            ctx.strokeStyle = "white";
            if(document.getElementById("note").innerText != '--') ctx.strokeText(document.getElementById("note").innerText,0,this.p.y + this.p.height/2 );
        
            /* Draw the notes */

            //Notes taken
            if(player.x >= this.x-5 && !player.collision){
                ctx.lineWidth = 3;
                ctx.strokeStyle = 'lightgreen';
            //Notes not available
            }else if (player.collision && player.collision){
                ctx.lineWidth = 1;
                ctx.strokeStyle = 'red';
            //Notes to take
            }else{
                ctx.lineWidth = 3;
                ctx.strokeStyle = this.color;  
            }
            
            //If there are note with # ore b
            if(this.note == 1 || this.note == 3 ||this.note == 6 ||this.note == 8 ||this.note == 10){
                ctx.font = "40px Georgia";
                ctx.strokeText(noteStrings[this.note], this.x - 50, this.top + 75);
            }else{
                ctx.font = "50px Georgia";
                ctx.strokeText(noteStrings[this.note], this.x - 5, this.top + 75);
            }
        }
}

/* Functions */

// Function for show the game over
function gameOver(c){
    c.drawImage(bang,player.x,player.y,100,100);
    c.font = "70px Georgia";
    c.strokeStyle = '#090';
    c.lineWidth = 3;
    c.strokeText('Game Over', 290,290);
}

//Draw the score
function drawUpdateScore(c){
    //Draw Score
    c.font = '40px Georgia';
    c.strokeStyle = "gold";
}

//Melody note length
function realLengthMelody(melody){
    var len = 0;
    for(i=0;i<melody.length;i++){
        if(melody[i]!= '-') l++;
    }
    return len;
}

//Draw end of the game
function endGame(c){
    c.font = "70px Georgia";
    c.strokeStyle = 'white';
    c.lineWidth = 3;
    c.strokeText('FINAL SCORE: '+score.innerText+'/'+countNotes(theMelody.stringNote), 300,290);
    ctx.drawImage(by,510, 160, 80, 80);
    setTimeout(() => {
        player.y = 290;
    }, 1000);
}

// Function for change the background
function changeBackground(v){backgroundImage = v;}

//Function for setting on/off two buttons 
function setTwoButtonColors(on,off){
    document.getElementById(on).style.backgroundColor='green';
	document.getElementById(on).style.color='white';
	document.getElementById(off).style.backgroundColor='gold';
	document.getElementById(off).style.color='black';
}

//Function for setting on/off three buttons
function setThreeButtonColors(on,off1,off2){
    document.getElementById(on).style.backgroundColor='green';
	document.getElementById(on).style.color='white';
	document.getElementById(off1).style.backgroundColor='gold';
	document.getElementById(off1).style.color='black';
    document.getElementById(off2).style.backgroundColor='gold';
	document.getElementById(off2).style.color='black';

}

// Function for setting play and stop button
function buttonsGame(){
    if(PlayAndStop) setTwoButtonColors('playButton','stopButton');
	else setTwoButtonColors('stopButton','playButton');
}

// Functions for print the position of the player
function printLinesNotes(c){
            let lineValue = fromCharToNote(document.getElementById("note").innerText);
            c.strokeStyle = "grey";

            c.moveTo(0, canvas.height - (notesHeight*lineValue) );
            c.lineTo(canvas.width, canvas.height - (notesHeight*lineValue) );
        
            c.moveTo(0, canvas.height - (notesHeight*lineValue) - notesHeight  );
	        c.lineTo(canvas.width, canvas.height - (notesHeight*lineValue) - notesHeight);

            c.stroke();
}

// Function for back to the menu of the game 
function backButton(){
    location.href = "../../src/index.html";
}

