// TODO

//Velocità fissata: durta degli ostacoli in base a grandezza dell'ostacolo e distanza tra un'ostacolo e la'ltro
//La distanza tra un'ostacolo e l'altro può essere: distance * durata_nota_corrente

/* SETUP */
// Canvas setup
const canvas = document.getElementById('canvasGame');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth - 10;
canvas.height = 600;

//SetUp Melodies


//Function for transform C3, C#3, Db#... into C,C#,Db....
function popLastChar(originalArrayString){
    var newArrayString = [];
    for(let i=0;i<s.length;i++){
        newArrayString[i] = originalArrayString[i].substring(0, originalArrayString[i].length - 1);
    }
    return newArrayString;
}

/* Elements for the game */

var theMelody = new Melody(myNotesChar,myNotesDur);
var notesHeight = canvas.height / 12;
var numLife = document.getElementById('numLife');
var life = document.getElementById('life');
var velocity = 4;
var distance = 30*velocity;
var backgroundSpeed = 1;
var stack = 40;


let spacePressed = false;
let frame = 0;
let score = 0;
let counterMelody = 0;
let indexMelody = 0;
let backgroundImage = 0;

const noteStrings = ["C", "C#-Db", "D", "D#-Eb", "E", "F", "F#-Gb", "G", "G#-Ab", "A", "A#-Bb", "B"];

const background = new Background(/*canvas.width*/2400,canvas.height,backgroundSpeed,player,score,backgroundSpeed);
const bang = new Image();
const mando = new Image();
const laser = new Image();
bang.src = 'bang.png';
mando.src = 'M_fly.png';
laser.src = 'Ostacolo_1.png';

//numLife.innerText =Math.ceil(theMelody.stringNote.length / 3);
numLife.innerText = 500;

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
                numLife.innerText = numLife.innerText - 1;
                numLife.style.backgroundColor = 'red';
                life.style.backgroundColor = 'red';

                if(numLife.innerText == 0){
                    gameEnd(ctx);
                    return true;
                }else{
                    obstaclesArray[i].collision = true;
                    player.collision = true;
                    setTimeout(() => {
                        numLife.style.backgroundColor = 'black';
                        life.style.backgroundColor = 'black';
                        player.collision = false;
                    }, 500);
                }
            }
    }
}

/* CONTROLLER */

function animate(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    background.handleBackground(backgroundImage);
    let theNote = fromCharToNote(theMelody.stringNote[counterMelody]);
    let theDuration = theMelody.stringDuration[counterMelody];
    
    handleObstacles(theNote, theDuration, theMelody.stringNote.length);   

    //Winner condition
    if(obstaclesArray.length == 0 && counterMelody == theMelody.stringNote.length){
        //The player wins
        setTimeout(() => {
            player.y = 290;
        }, 1000);
        endGame(ctx);    
    }else{
        //Update player position
        player.y = moveOne(document.getElementById("number").innerText);

        //Print lines of notes
        /*
            let lineValue = fromCharToNote(document.getElementById("note").innerText);
            ctx.strokeStyle = "grey";

            ctx.moveTo(0, canvas.height - (notesHeight*lineValue) );
            ctx.lineTo(canvas.width, canvas.height - (notesHeight*lineValue) );
        
            ctx.moveTo(0, canvas.height - (notesHeight*lineValue) - notesHeight  );
	        ctx.lineTo(canvas.width, canvas.height - (notesHeight*lineValue) - notesHeight);

            ctx.stroke();
        */
        
    }

    player.update();
    player.draw();
    if(!player.collision && handleCollision()) return;
    drawUpdateScore(ctx);
    handleParticles();
    requestAnimationFrame(animate);
    frame++;
}

/* VIEW */
animate();





