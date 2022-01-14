// TODO

// Sistemare lo score...per ora non si incrementa

// https://tomhess.net/Tools/DelayCalculator.aspx

/* SETUP */
// Canvas setup
const canvas = document.getElementById('canvasGame');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth - 10;
canvas.height = 600;

//SetUp Melodies

/* Elements for the game */

var theMelody = new Melody(myNotesChar,myNotesDur);
var notesHeight = canvas.height / 12;
var score = document.getElementById('score');
var life = document.getElementById('life');
var velocity = 4;
var distance = 120;
var backgroundSpeed = 5;
var stack = 40;
var charNoteObstacles = 0;


let spacePressed = false;
let frame = 0;
let indexObstacleMelody = 0;
let indexCurrentPlayerNote = 0;
let backgroundImage = 0;

const noteStrings = ["C", "C#-Db", "D", "D#-Eb", "E", "F", "F#-Gb", "G", "G#-Ab", "A", "A#-Bb", "B"];

const background = new Background(2400,canvas.height,backgroundSpeed,player,backgroundSpeed);
const bang = new Image();
const mando = new Image();
const laser = new Image();
const tower = new Image();
const grafite = new Image();
const by = new Image();
bang.src = 'bang.png';
mando.src = 'M_fly.png';
laser.src = 'Ostacolo_1.png';
grafite.src = 'Grafite.png';
by.src = 'BY.png';
tower.src = 'Ostacolo_2.png';

score.innerText = countNotes(theMelody.stringNote);

/* FUNCTIONS */

//True becomes False or viceversa
function trueOrFalse(e){
    if(e) e=false;
    else e=true;
    return e;
}

//Movement of the player
function moveOne(n){
    if(n>=0 && n<12){
        return (canvas.height - player.height) - (notesHeight*n);
    }else{
        return player.y;
    }
}

//Detection of collision
function handleCollision(){
    for(let i=0; i <obstaclesArray.length; i++){
        if  ( !player.collision && player.x < obstaclesArray[i].x + obstaclesArray[i].width && player.x + player.width > obstaclesArray[i].x &&
            ((player.y < 0 + obstaclesArray[i].top && player.y+player.height > 0)
                ||
             (player.y+player.height > canvas.height-obstaclesArray[i].bottom && player.y+player.height <= canvas.height)
            )){
                score.innerText = score.innerText - 1;
                score.style.backgroundColor = 'red';
                life.style.backgroundColor = 'red';

                if(score.innerText == 0){
                    gameEnd(ctx);
                    return true;
                }else{
                    obstaclesArray[i].collision = true;
                    player.collision = true;
                    setTimeout(() => {
                        score.style.backgroundColor = 'black';
                        life.style.backgroundColor = 'black';
                        player.collision = false;
                    }, 1000);
                }
            }
    }
}

/* CONTROLLER */

function animate(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    background.handleBackground(backgroundImage);

    let theNote = fromCharToNote(theMelody.stringNote[indexObstacleMelody]);
    let theDuration = theMelody.stringDuration[indexObstacleMelody];
    
    handleObstacles(theNote, theDuration, theMelody.stringNote.length,);   

    //Winner condition
    if(obstaclesArray.length == 0 && indexObstacleMelody == theMelody.stringNote.length){
        //The player wins
        setTimeout(() => {
            player.y = 290;
        }, 1000);
        endGame(ctx);    
    }else{
        //Update player position
        player.y = moveOne(document.getElementById("number").innerText);
        //printLinesNotes(ctx);    
    }

    player.update();
    player.draw();
    if(!player.collision && handleCollision()) return;
    drawUpdateScore(ctx);
    handleParticles();
    requestAnimationFrame(animate);
    frame++;
    console.log('counterMelody: '+indexObstacleMelody);
    console.log('indexMelody: '+indexCurrentPlayerNote);
}

/* VIEW */
animate();





