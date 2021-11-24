var canvasWidth = 800;
var canvasHeight = 600;
// To scale the background
const backgroundHeight = 2000;
const backgroundWidth = 3000;
var canvasWidth = 1000;
var canvasHeight = (canvasWidth*backgroundHeight)/backgroundWidth;

//KEYBOARD
var keys = "awsedftgyhujk";
var blackKeys = [0,1,0,1,0,0,1,0,1,0,1,0,0];

var config = {
  type: Phaser.AUTO,
  width: canvasWidth,
  height: canvasHeight, 
  physics:{
    default: 'arcade',
    arcade:{
      gravity: { y: 0},
      debug: false
    }
  },
  scene: {
      preload: preload,
      create: create,
      update: update
  }
};

var game = new Phaser.Game(config);
var keys;
var nNote = 13;
var step = ((canvasWidth/nNote));
var platforms;
var player;
var arrayStep=[];
var nextStep;
var coins;
var notes = [];
var score = 0;
var scoreText;
var background1,background2,backgroundV1,backgroundV2;

/*function Note(name, duration, pause) {
  this.noteName = name;
  this.duration = duration;
  this.pause = pause;
}*/

//Variables for background
var setBackgroundScale = canvasWidth/backgroundWidth;
var x1 = 0;
var x2 = canvasWidth;
var x3 = canvasHeight
var backgroundSpeed = 1;

//Audio variables
var c = new AudioContext()
var g
var attack = 0.04;
var decay = 0.1;

function preload ()
{
  this.load.image('sky', 'assets/sky.png');
  this.load.image('ground', 'assets/platform.png');
  this.load.image('star', 'assets/star.png');
  this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
  this.load.image('space1', 'assets/Space1.jpg');
  this.load.image('space2', 'assets/Space2.jpg');
  this.load.image('spaceV1', 'assets/Space1V.jpg');
  this.load.image('spaceV2', 'assets/Space1V.jpg');
  this.load.image('coin', 'assets/money_flute.png');
  this.load.spritesheet('character', 'assets/M_step.png', { frameWidth: 200, frameHeight: 300 });
}

function create ()
{
  /* Orizontal background movement */
  /*
    background1 = this.physics.add.sprite(x1, 0, 'space1').setOrigin(0,0);
    background2 = this.physics.add.sprite(x2, 0, 'space2').setOrigin(0,0);
    background1.setScale(setBackgroundScale);
    background2.setScale(setBackgroundScale);
    background1.setVelocityX(- backgroundSpeed);
    background2.setVelocityX(- backgroundSpeed);
  */
  
  /* Vertical background movement */  
  backgroundV1 = this.physics.add.sprite(0, x1, 'spaceV1').setOrigin(0,0);
  backgroundV2 = this.physics.add.sprite(0, -x3, 'spaceV2').setOrigin(0,0);

  backgroundV1.setScale(setBackgroundScale);
  backgroundV2.setScale(setBackgroundScale);
  backgroundV1.setVelocityY(- backgroundSpeed);
  backgroundV2.setVelocityY(- backgroundSpeed);

  //background.setVelocityX(+1);

  //platforms = this.physics.add.staticGroup();
  //platforms.create(400, 568, 'ground').setScale(2).refreshBody();

  //stores the note steps in an array
  for(let i=0; i<nNote; i++){
    nextStep = ((step / 2) + i*step);
    arrayStep[i] = nextStep;
    createDivKey(arrayStep[i], i);
  }

  //PLAYER
  player = this.physics.add.sprite(100, 512, 'character').setScale(0.30);
  //this.physics.add.collider(player, platforms);

  //ANIMATION
  this.anims.create({
    key: 'flying',
    frames: this.anims.generateFrameNumbers('character', { start: 0, end: 2 }),
    frameRate: 5,
    repeat: -1
  });
  player.anims.play('flying');

  //COINS
  coins = this.physics.add.group({
    key: 'coin',
    repeat: 10,
    setXY: { x: -10, y: 0, stepY: -100},
    setScale: { x: 0.7, y: 0.7}
  });
  
  //set random positions of coins in the x axis
  for(let i=0; i<11; i++){
    notes[i] = arrayStep[Math.floor(Math.random()*nNote)];
    coins.getChildren()[i].x = notes[i];
  }

  coins.setVelocityY(100);

  this.physics.add.overlap(player, coins, collectCoin, null, this);

  //SCORE
  scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#FFF' });

  //SOUND
  CreateGain();

  //this.time.events.loop(Phaser.Timer.SECOND, play(440*Math.pow(2,0/12)), this)
  this.time.addEvent({
    delay: 100, // ms
    callback: console.log("played sound"),
    callbackScope: this,
    loop: true
  });
}

function update ()
{
  /* Movement of the character */
  window.addEventListener("keypress", (e) => {
    if(keys.indexOf(e.key)>=0 && keys.indexOf(e.key)<keys.length){
      player.x = arrayStep[keys.indexOf(e.key)];
    }
  });
  
  /*Background movement controlled orizontally */
  /*
  if (background1.x < -canvasWidth) background1.x = canvasWidth + background2.x - backgroundSpeed;
  else background1.x = background1.x - backgroundSpeed; 
  
  if (background2.x < -canvasWidth) background2.x = canvasWidth + background1.x - backgroundSpeed;
  else background2.x = background2.x - backgroundSpeed;
  */

  /*Background movement controlled vertically */
  
  if (backgroundV1.y > canvasHeight) backgroundV1.y = -canvasHeight + backgroundV2.y - backgroundSpeed;
  else backgroundV1.y = backgroundV1.y + backgroundSpeed;
  
  if (backgroundV2.y > canvasHeight) backgroundV2.y = -canvasHeight + backgroundV1.y - backgroundSpeed;
  else backgroundV2.y = backgroundV2.y + backgroundSpeed; 
      
}

function collectCoin (player, coin)
{
  coin.disableBody(true, true);

  score += 10;
  scoreText.setText('Score: ' + score);
}

function CreateGain() {
  g = c.createGain()
  g.connect(c.destination)
}

function play(f){
  var o = c.createOscillator()
  o.connect(g)
  o.frequency.value = f
  o.type = "sine"
  o.start() 
  g.gain.setValueAtTime(0,c.currentTime)
  g.gain.linearRampToValueAtTime(1, c.currentTime+attack)
  g.gain.linearRampToValueAtTime(0, c.currentTime+attack+decay)
  o.stop(c.currentTime+attack+decay)
}

function createDivKey(pos, index){
  const key = document.createElement("div")
  key.classList.add("key")
  var position = pos-step/2;
  key.style.left = position + "px";
  key.style.width = step + "px";
  if(blackKeys[index]){
    key.style.backgroundColor = "black";
  }
  keyBar.appendChild(key)
}