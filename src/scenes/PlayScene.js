import { CST } from "./CST.js";
import { CustomFunctions } from "../CustomFunctions.js";
import { CustomSound } from "../CustomSound.js";
import { DB } from "../Firebase.js";

const backgroundHeight = window.innerHeight-20;;
const backgroundWidth = window.innerWidth-20;
var canvasWidth = window.innerWidth-20;
var canvasHeight = window.innerHeight-20;

//KEYBOARD input
var keys = "awsedftgyhujkolpòà";

//MIDI input (da gestire perchè inizialmente da errore)
var midi = await navigator.requestMIDIAccess();
var midi_notes = [48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72];
var noteNames = ['C4', 'C#4', 'D4', 'D#4', 'E4', 'F4', 'F#4', 'G4', 'G#4', 'A4', 'A#4', 'B4', 'C5', 'C#5', 'D5', 'D#5', 'E5', 'F5', 'F#5', 'G5', 'G#5', 'A5', 'A#5', 'B5', 'C6'];
var noteOn = false;
//48 is C, and 60 is the upper C
var nNote = 25;
var step = ((canvasWidth / nNote));
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
var overlapping = false;
var particles;
var emitter;
var startY = 400;
var synth = null;

//Variables for background
var setBackgroundScale = canvasWidth / backgroundWidth;
var x1 = 0;
var x2 = canvasWidth;
var x3 = canvasHeight
var backgroundSpeed = 1;
var db = new DB();
const sound = new CustomSound();
var custom = null;
var sampler;
var selectedSong = '';

const COLOR_PRIMARY = 0x89CFF0;
const COLOR_LIGHT = 0x00FFFF;
const COLOR_DARK = 0x0000FF;

//promise.then( (db.getNotes()) => custom = new CustomFunction(db.getNotes(), db.getDuration()));
//var custom = new CustomFunctions(db.getNotes(), db.getDuration());


export class PlayScene extends Phaser.Scene {
  constructor() {
    super({
      key: CST.SCENES.PLAY
    })
  }

  init(data){
    selectedSong = data;
  }

  preload() {
    this.load.image('ground', 'assets/platform.png');
    this.load.image('piano', 'assets/piano keyboard actam.png');
    this.load.image('space1', 'assets/Space1.jpg');
    this.load.image('space2', 'assets/Space2.jpg');
    this.load.image('spaceV1', 'assets/Space1V.jpg');
    this.load.image('spaceV2', 'assets/Space1V.jpg');
    this.load.image('coin 1', 'assets/money_square 1.png');
    this.load.image('coin 2', 'assets/money_square 2.png');
    this.load.image('coin 3', 'assets/money_square 3.png');
    this.load.image('coin 4', 'assets/money_square 4.png');
    this.load.spritesheet('character_right', 'assets/M_steps_R.png', { frameWidth: 200, frameHeight: 300 });
    this.load.spritesheet('character_left', 'assets/M_steps_L.png', { frameWidth: 200, frameHeight: 300 });
    this.load.audio('metronome', ['assets/metronomo_bip.wav']);
    this.load.image('line', 'assets/lineaACTAM.png');
    this.load.atlas('flares', 'assets/particles/flares.png', 'assets/particles/flares.json');
    //this.load.scenePlugin('rexuiplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js', 'rexUI', 'rexUI');
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
    }

    //PLAYER
    player = this.physics.add.sprite(20, startY+48, 'character_right').setScale(0.30);
    line = this.physics.add.sprite(20, startY, 'line').setScale(0.30);

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

    //CHARACTER INITIALIZATION
    player.anims.play('flying_right');

    //COINS
    const layer1 = this.add.layer();
    
    //const pianoSprite = this.add.sprite(0, startY, 'piano').setOrigin(0,0).setScale(6,10);
    const pianoSprite = this.add.sprite(0, startY, 'piano').setOrigin(0,0).setDisplaySize(canvasWidth,200);

    layer1.add([pianoSprite]);

    coins = this.physics.add.group();

    db.setSceneMelody(selectedSong);

    /* TO LOAD MIDI FILES ON DB
    const loadFromDatabase = async () => {
      await db.asyncMidiFunction();
      // do something else here after asyncMidiFunction completes
      db.initializeLocalVariables();
      db.getDataInCustom(function(duration, notes, time){
        custom = new CustomFunctions(duration, notes, time);
        custom.melodyToSpace();
        custom.notesToCoins(arrayStep, coins);
        coins.setVelocityY(150);
        for (let i = 0; i < coins.getChildren().length; i++) {
          layer1.add([coins.getChildren()[i]]);
        }
      })
    } 
    
    loadFromDatabase();*/

    db.initializeLocalVariables();
      db.getDataInCustom(function(duration, notes, time){
        custom = new CustomFunctions(duration, notes, time);
        custom.melodyToSpace();
        custom.notesToCoins(arrayStep, coins);
        coins.setVelocityY(150);
        for (let i = 0; i < coins.getChildren().length; i++) {
          layer1.add([coins.getChildren()[i]]);
        }
      })
    
    layer1.add([player, line]);

    //SCORE
    scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#FFF' });

    //SOUND
    synth = new Tone.PolySynth().toDestination();
    /* sampler = new Tone.Sampler({
      urls: {
        A1: "A1.mp3",
        A2: "A2.mp3",
      },
      baseUrl: "https://tonejs.github.io/audio/casio/",
    }).toDestination(); */

    particles = this.add.particles('flares');

    emitter = particles.createEmitter({
        frame: 'blue',
        lifespan: 200,
        speed: { min: 300, max: 500 },
        angle: 270,
        gravityY: 30,
        scale: { start: 0.5, end: 0 },
        quantity: 2,
        blendMode: 'ADD',
        visible: false
    });
    layer1.add([particles]);
    layer1.sendToBack(particles);
    var once = true;
    var otherOnce = true;
    var startTime;

    this.physics.add.overlap(line, coins, function(player, coin){
      overlapping = true;
      if(once){
        startTime = performance.now();
        once = false;
      }
      if(otherOnce && coin != prevCoin && prevCoin!=null){
        otherOnce = false;
        var endTime = performance.now();
          var timeDiff = endTime - startTime; //in ms
          // strip the ms
          timeDiff /= 1000;
          // get seconds 
          var seconds = timeDiff;
          console.log(seconds + " seconds");
      }
      if(noteOn){
        if(pressedOnce){
          prevCoin = coin;
          score += 10;
          layer1.sendToBack(coin);
          emitter.setVisible(true);
        }
        if(coin != prevCoin && !pressedOnce){
          emitter.setVisible(false);
        } else if(coin == prevCoin && !pressedOnce){
          score += 10;
          layer1.sendToBack(coin);
        }
      }
      if((line.y-2) <= Math.round(coin.y-(coin.displayHeight/2))){
        overlapping = false;
        prevCoin = coin;
        /* if(otherOnce){
          otherOnce = false;
          var endTime = performance.now();
          var timeDiff = endTime - startTime; //in ms
          // strip the ms
          timeDiff /= 1000;
          // get seconds 
          var seconds = timeDiff;
          console.log(seconds + " seconds");
        } */
      }
      scoreText.setText('Score: ' + score);
    }, null, this);
  }

  update() {
    // Movement of the character with keybord
    
    /* window.addEventListener("keydown", (e) => {
      var noteIndex = keys.indexOf(e.key);
      if(!overlapping){
        emitter.setVisible(false);
      }
      if(!e.repeat){
        if (noteIndex >= 0 && noteIndex < keys.length) {
          player.x = arrayStep[noteIndex];
          line.x = arrayStep[noteIndex];

          emitter.setPosition(line.x, line.y);
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
        emitter.setVisible(false);
      }
    }); */
    if(!overlapping){
        emitter.setVisible(false);
    }
    // Movement with MIDI 
    
      for (var input of midi.inputs.values()){
        
        input.onmidimessage = function (message){
          var noteIndex = midi_notes.indexOf(message.data[1]);
          player.x = arrayStep[noteIndex];
          line.x = arrayStep[noteIndex];
          
          //if note on
          if(message.data[0] == 144){
            noteOn = true;
            if(message.repeat){
              pressedOnce = false;
            } else {
              pressedOnce = true;
            }
            
            emitter.setPosition(line.x, line.y);

            //sampler.triggerAttack(noteNames[noteIndex], Tone.now());
            synth.triggerAttack(noteNames[noteIndex], Tone.now());

            if (player.x <= arrayStep[noteIndex]) {
              player.anims.play('flying_right');
            } else {
              //Movement to the left
              player.anims.play('flying_left');
            }
          } else if(message.data[0] == 128){
            noteOn = false;
            emitter.setVisible(false);
            //sampler.triggerRelease(noteNames[noteIndex], Tone.now());
            synth.triggerRelease(noteNames[noteIndex], Tone.now());
          }
        }
      }
    
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
}