var canvasWidth = 800;
var canvasHeight = 600;
// For scale the background
const backgroundHeight = 2000;
const backgroundWidth = 3000;
var canvasWidth = 1000;
var canvasHeight = (canvasWidth*backgroundHeight)/backgroundWidth;
// For scale the background

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
var background1;
var background2;

/*function Note(name, duration, pause) {
  this.noteName = name;
  this.duration = duration;
  this.pause = pause;
}*/

//Variables for background
var setBackgroundScale = canvasWidth/backgroundWidth;
var x1 = 0;
var x2 = canvasWidth;
var backgroundSpeed = 2;
//

function preload ()
{
  this.load.image('sky', 'assets/sky.png');
  this.load.image('ground', 'assets/platform.png');
  this.load.image('star', 'assets/star.png');
  this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
  this.load.image('space1', 'assets/Space1.jpg');
  this.load.image('space2', 'assets/Space2.jpg');
  this.load.image('coin', 'assets/money_flute.png');
  this.load.spritesheet('character', 'assets/M_step.png', { frameWidth: 200, frameHeight: 300 });
}

function create ()
{
  background1 = this.physics.add.sprite(x1, 0, 'space1').setOrigin(0,0);
  background2 = this.physics.add.sprite(x2, 0, 'space2').setOrigin(0,0);
  background1.setScale(setBackgroundScale);
  background2.setScale(setBackgroundScale);
  background1.setVelocityX(- backgroundSpeed);
  background2.setVelocityX(- backgroundSpeed);

  //background.setVelocityX(+1);

  //platforms = this.physics.add.staticGroup();
  //platforms.create(400, 568, 'ground').setScale(2).refreshBody();

  keys = this.input.keyboard.addKeys('A,W,S,E,D,F,T,G,Y,H,U,J,K');

  //stores the note steps in an array
  for(let i=0; i<nNote; i++){
    nextStep = ((step / 2) + i*step);
    arrayStep[i] = nextStep;
  }

  player = this.physics.add.sprite(100, 512, 'character').setScale(0.35);
  
  //this.physics.add.collider(player, platforms);

  //ANIMATION
  this.anims.create({
    key: 'flying',
    frames: this.anims.generateFrameNumbers('character', { start: 0, end: 2 }),
    frameRate: 5,
    repeat: -1
  });
  player.anims.play('flying');

  coins = this.physics.add.group({
    key: 'coin',
    repeat: 10,
    setXY: { x: -10, y: 0, stepY: -100},
    setScale: 0.5
  });
  
  //set random positions of stars in the x axis
  for(let i=0; i<11; i++){
    notes[i] = arrayStep[Math.floor(Math.random()*nNote)];
    coins.getChildren()[i].x = notes[i];
  }

  coins.setVelocityY(100);

  this.physics.add.overlap(player, coins, collectCoin, null, this);

  scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });
}

function update ()
{

  if (keys.A.isDown){
    player.x = arrayStep[0];}
    else if(keys.W.isDown){
      player.x = arrayStep[1];
    }else if(keys.S.isDown){
      player.x = arrayStep[2];
    }else if(keys.E.isDown){
      player.x = arrayStep[3];
    }else if(keys.D.isDown){
      player.x = arrayStep[4];
    }else if(keys.F.isDown){
      player.x = arrayStep[5];
    }else if(keys.T.isDown){
      player.x = arrayStep[6];
    }else if(keys.G.isDown){
      player.x = arrayStep[7];
    }else if(keys.Y.isDown){
      player.x = arrayStep[8];
    }else if(keys.H.isDown){
      player.x = arrayStep[9];
    }else if(keys.U.isDown){
      player.x = arrayStep[10];
    }else if(keys.J.isDown){
      player.x = arrayStep[11];
    }else if(keys.K.isDown){
      player.x = arrayStep[12];
    }
  
  if (background1.x < -canvasWidth) background1.x = canvasWidth + background2.x - backgroundSpeed;
  else background1.x = background1.x - backgroundSpeed; 
  
  if (background2.x < -canvasWidth) background2.x = canvasWidth + background1.x - backgroundSpeed;
  else background2.x = background2.x - backgroundSpeed; 
      
}

function collectCoin (player, coin)
{
  coin.disableBody(true, true);

  score += 10;
  scoreText.setText('Score: ' + score);
}