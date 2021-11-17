var config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
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
var canvasWidth = 800;
var nNote = 13;
var step = ((canvasWidth/nNote));
var platforms;
var player;
var arrayStep=[];
var nextStep;
var stars;
var notes = [];
var score = 0;
var scoreText;

function Note(name, duration, pause) {
  this.noteName = name;
  this.duration = duration;
  this.pause = pause;
}

function preload ()
{
  this.load.image('sky', 'assets/sky.png');
  this.load.image('ground', 'assets/platform.png');
  this.load.image('star', 'assets/star.png');
  this.load.image('bomb', 'assets/bomb.png');
  this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });

}

function create ()
{
  this.add.image(400, 300, 'sky');
  platforms = this.physics.add.staticGroup();
  platforms.create(400, 568, 'ground').setScale(2).refreshBody();
  //platforms.create(600, 400, 'ground');
  //platforms.create(50, 250, 'ground');
  //platforms.create(750, 220, 'ground');

 keys = this.input.keyboard.addKeys('A,W,S,E,D,F,T,G,Y,H,U,J,K');

  for(let i=0; i<nNote; i++){
    nextStep = ((step / 2) + i*step);
    arrayStep[i]=nextStep;
  }
  console.log(arrayStep);

  player = this.physics.add.sprite(100, 512, 'dude');

  player.setBounce(0.2);
  player.setCollideWorldBounds(true);

  this.anims.create({
  key: 'left',
  frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3}),
  frameRate: 10,
  repear: -1
  });

  this.anims.create({
    key: 'turn',
    frames: [ { key: 'dude', frame: 4 } ],
    frameRate: 20
});

this.anims.create({
    key: 'right',
    frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
    frameRate: 10,
    repeat: -1
});

this.physics.add.collider(player, platforms);

stars = this.physics.add.group({
  key: 'star',
  repeat: 10,
  setXY: { x: -10, y: 0, stepY: -100}
});

for(let i=0; i<11; i++){
  notes[i] = arrayStep[Math.floor(Math.random()*nNote)];
  stars.getChildren()[i].x = notes[i];
}


stars.children.iterate(function (child) {

  child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));

});

stars.setVelocityY(100);

this.physics.add.overlap(player, stars, collectStar, null, this);

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


  

  if (cursors.left.isDown)
{
    player.setVelocityX(-160);

    player.anims.play('left', true);
}
else if (cursors.right.isDown)
{
    player.setVelocityX(160);

    player.anims.play('right', true);
}
else
{
    player.setVelocityX(0);

    player.anims.play('turn');
}

if (cursors.up.isDown && player.body.touching.down)
{
    player.setVelocityY(-330);
}
}

function collectStar (player, star)
    {
        star.disableBody(true, true);

        score += 10;
        scoreText.setText('Score: ' + score);
    }