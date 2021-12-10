import { CST } from "./CST.js";
import { CustomFunctions } from "../CustomFunctions.js";
import { CustomSound } from "../CustomSound.js";
import { DB } from "../Firebase.js";

const backgroundHeight = 2000;
const backgroundWidth = 3000;
var canvasWidth = 1000;
var canvasHeight = (canvasWidth*backgroundHeight)/backgroundWidth;      
//KEYBOARD input
var keys = "awsedftgyhujk";

//MIDI input (da gestire perchè inizialmente da errore)
var midi = await navigator.requestMIDIAccess();
var midi_notes = [48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60];
var noteOn = false;
//48 is C, and 60 is the upper C
var nNote = 13;
var step = ((canvasWidth / nNote));
var platforms;
var player;
var arrayStep = [];
var nextStep;
var coins;
var notes = [];
var score = 0;
var scoreText;
var background1, background2, backgroundV1, backgroundV2;
var line;
var pressedOnce = false;
var consumedBar = 0;
var prevCoin = null;

//Variables for background
var setBackgroundScale = canvasWidth / backgroundWidth;
var x1 = 0;
var x2 = canvasWidth;
var x3 = canvasHeight
var backgroundSpeed = 1;
var db = new DB();
const sound = new CustomSound();
var custom = null;



//promise.then( (db.getNotes()) => custom = new CustomFunction(db.getNotes(), db.getDuration()));
//var custom = new CustomFunctions(db.getNotes(), db.getDuration());


export class PlayScene extends Phaser.Scene {
  constructor() {
    super({
      key: CST.SCENES.PLAY
    })
  }

  preload() {
    this.load.image('sky', 'assets/sky.png');
    this.load.image('ground', 'assets/platform.png');
    this.load.image('star', 'assets/star.png');
    this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
    this.load.image('space1', 'assets/Space1.jpg');
    this.load.image('space2', 'assets/Space2.jpg');
    this.load.image('spaceV1', 'assets/Space1V.jpg');
    this.load.image('spaceV2', 'assets/Space1V.jpg');
    this.load.image('coin', 'assets/money_square.png');
    this.load.spritesheet('character_right', 'assets/M_steps_R.png', { frameWidth: 200, frameHeight: 300 });
    this.load.spritesheet('character_left', 'assets/M_steps_L.png', { frameWidth: 200, frameHeight: 300 });
    this.load.audio('metronome', ['assets/metronomo_bip.wav']);
    this.load.image('line', 'assets/lineaACTAM.png');
  }

  create() {
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
    backgroundV1 = this.physics.add.sprite(0, x1, 'spaceV1').setOrigin(0, 0);
    backgroundV2 = this.physics.add.sprite(0, -x3, 'spaceV2').setOrigin(0, 0);

    backgroundV1.setScale(setBackgroundScale);
    backgroundV2.setScale(setBackgroundScale);
    backgroundV1.setVelocityY(- backgroundSpeed);
    backgroundV2.setVelocityY(- backgroundSpeed);

    //stores the note steps in an array
    for (let i = 0; i < nNote; i++) {
      nextStep = ((step / 2) + i * step);
      arrayStep[i] = nextStep;
      //custom.createDivKey(arrayStep[i], i, step);
    }

    //PLAYER
    player = this.physics.add.sprite(100, 512, 'character_right').setScale(0.30);
    line = this.physics.add.sprite(100, 466, 'line').setScale(0.30);

    //ANIMATION
    this.anims.create({
      key: 'flying_right',
      frames: this.anims.generateFrameNumbers('character_right', { start: 0, end: 2 }),
      frameRate: 5,
      repeat: -1
    });
    this.anims.create({
      key: 'flying_left',
      frames: this.anims.generateFrameNumbers('character_left', { start: 0, end: 2 }),
      frameRate: 5,
      repeat: -1
    });

    //INITIALIZATION OF THE CHARACTER
    player.anims.play('flying_right');

    //COINS
    coins = this.physics.add.group();
    //custom.createMelody();
    db.getDataInCustom(function(duration, notes){
    custom = new CustomFunctions(duration, notes);
    custom.melodyToSpace();
    custom.notesToCoins(arrayStep, coins);
    coins.setVelocityY(100);
    })
    
    

    //set random positions of coins in the x axis
    /*for(let i=0; i<11; i++){
      notes[i] = arrayStep[Math.floor(Math.random()*nNote)];
      coins.getChildren()[i].x = notes[i];
    }*/

    //SCORE
    scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#FFF' });

    //SOUND
    sound.createGain();

    this.physics.add.overlap(line, coins, function(player, coin){

      if(noteOn && pressedOnce){
        //coin.disableBody(true, true);
        score += 10;
        consumedBar += 0.01;
        //console.log(coin.displayHeight)
        coin.setScale(1, (coin.displayHeight/50)-consumedBar);
      }
      if(coin != prevCoin){
        consumedBar = 0;
      }
      scoreText.setText('Score: ' + score);
      prevCoin = coin;

    }, null, this);
  }

  update() {
    // Movement of the character with keybord
    window.addEventListener("keydown", (e) => {
      var noteIndex = keys.indexOf(e.key);
      if(!e.repeat){
        if (noteIndex >= 0 && noteIndex < keys.length) {
          player.x = arrayStep[noteIndex];
          line.x = arrayStep[noteIndex];
          sound.play(noteIndex);
          noteOn = true;
          if (player.x <= arrayStep[noteIndex]) {
            player.anims.play('flying_right');
          } else {
            //Movement to the left
            player.anims.play('flying_left');
          }
      }
      pressedOnce = true;
      } else {
      pressedOnce = false;
    }
    });

    window.addEventListener("keyup", (e) => {
      var noteIndex = keys.indexOf(e.key);
      if (noteIndex >= 0 && noteIndex < keys.length) {
        noteOn = false;
      }
    });

    // Movement with the MIDI 
    /*
      for (var input of midi.inputs.values()){
        input.onmidimessage = function (message){
          var noteIndex = midi_notes.indexOf(message.data[1];
          player.x = arrayStep[noteIndex)];
          line.x = arrayStep[noteIndex)];
          //if note on
          if(message.data[0] == 144){
            sound.play(noteIndex))
            noteOn = true;
          } else if(message.data[0] == 128){
            noteOn = false;
          }
        }
      }*/

    //message.data[1]->value of the note pressed

    // Background movement controlled orizontally
    /*
      if (background1.x < -canvasWidth) background1.x = canvasWidth + background2.x - backgroundSpeed;
      else background1.x = background1.x - backgroundSpeed; 
    
      if (background2.x < -canvasWidth) background2.x = canvasWidth + background1.x - backgroundSpeed;
      else background2.x = background2.x - backgroundSpeed;
    */

    // Background movement controlled vertically

    if (backgroundV1.y > canvasHeight) backgroundV1.y = -canvasHeight + backgroundV2.y - backgroundSpeed;
    else backgroundV1.y = backgroundV1.y + backgroundSpeed;

    if (backgroundV2.y > canvasHeight) backgroundV2.y = -canvasHeight + backgroundV1.y - backgroundSpeed;
    else backgroundV2.y = backgroundV2.y + backgroundSpeed;

  }
/*
    collectCoin(player, coin) {
    if (noteOn) {
      coin.disableBody(true, true);
      score += 10;
    }
  
    scoreText.setText('Score: ' + score);
  } 
    */
}
