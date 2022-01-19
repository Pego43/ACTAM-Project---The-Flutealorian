/* SETUP */

// Setup Canvas
const canvas = document.getElementById('canvasGame');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth - 10;
canvas.height = 600;

// Setup variables
var notesHeight = canvas.height / 12;
var lifeScore = document.getElementById('points');
var speedOfTheGame = document.getElementById('speedGame');
var score = document.getElementById('score');
var velocity = 4;
var distance = 150;
var backgroundSpeed = 5;
var stack = 40;
var charNoteObstacles = 0;
var endOfTheGame = false;

let spacePressed = false;
let frame = 0;
let indexObstacleMelody = 0;
let indexCurrentPlayerNote = 0;
let backgroundImage = 0;
let PlayAndStop = true;

const noteStrings = ["C", "C#-Db", "D", "D#-Eb", "E", "F", "F#-Gb", "G", "G#-Ab", "A", "A#-Bb", "B"];

//SetUp Melody

//Without Database
//var theMelody = new Melody(myNotesChar,myNotesDur);

//  With Database
var theMelody = new Melody([],[]);  
async function loadFromDatabase(){
    getValuesFromDB().then(()=>{
        console.log("in teoria ultima cosa da fare");
        // do something else here after getValuesFromDB completes
        var song = new Melody(myNotesChar,myNotesDur);
        theMelody = song;
        //first map: 100 = 0, 110 = 1 , 120 = 2...
        var z = (tempo/10)-10;
        //second map: velocity = f(bpm) = bpm + 34 + 3.55*z;
        var vel = tempo + 34 + 3.55*z;
        //velocity = vel/60;
    });   
}

// Setupt images
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

/* FUNCTIONS */

// True becomes False or viceversa
function trueOrFalse(e){
    if(e) e=false;
    else e=true;
    return e;
}

// For start and stop the game
function PlayMe(){
    if(!PlayAndStop){
        PlayAndStop = true;
        window.animate();
    }
}

// Movement of the player
function moveOne(n){
    if(n>=0 && n<12){
        return (canvas.height - player.height) - (notesHeight*n);
    }else{
        return player.y;
    }
}

// For setting the initial score
function scoreSetting(){
    if(frame==0 && tempo==0){
        setTimeout(() => {
            score.innerText = countNotes(theMelody.stringNote);
        }, 1000);
    }
}

// Detection of collision
function handleCollision(){
    for(let i=0; i <obstaclesArray.length; i++){
        if  ( !player.collision && player.x < obstaclesArray[i].x + obstaclesArray[i].width && player.x + player.width > obstaclesArray[i].x &&
            ((player.y < 0 + obstaclesArray[i].top && player.y+player.height > 0)
                ||
             (player.y+player.height > canvas.height-obstaclesArray[i].bottom && player.y+player.height <= canvas.height)
            )){
                score.innerText = score.innerText - 1;
                score.style.backgroundColor = 'red';
                lifeScore.style.backgroundColor = 'red';

                if(score.innerText == 0){
                    gameOver(ctx);
                    return true;
                }else{
                    obstaclesArray[i].collision = true;
                    player.collision = true;
                    setTimeout(() => {
                        score.style.backgroundColor = 'black';
                        lifeScore.style.backgroundColor = 'black';
                        player.collision = false;
                    }, 1000);
                }
            }
    }
}

/* CONTROLLER */

// Function for the animation of tha game
function animate(){
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    background.handleBackground(backgroundImage);

    speedOfTheGame.style.backgroundColor = 'lightskyblue';
    speedOfTheGame.style.color = 'black';
    speedOfTheGame.innerText = velocity;


    let theNote = fromCharToNote(theMelody.stringNote[indexObstacleMelody]);
    let theDuration = theMelody.stringDuration[indexObstacleMelody];

    handleObstacles(theNote, theDuration, theMelody.stringNote.length);   

    //Winner condition
    if(obstaclesArray.length == 0 && indexObstacleMelody == theMelody.stringNote.length && endOfTheGame){
        //The player wins
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
    if (PlayAndStop) requestAnimationFrame(animate);
    frame++;
}

/* VIEW */

loadFromDatabase();
scoreSetting();
animate(); 









