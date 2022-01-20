const COLOR_PRIMARY = 0x89CFF0;
const COLOR_LIGHT = 0x00FFFF;
const COLOR_DARK = 0x0000FF;

import { CST } from "./CST.js";
import { CustomFunctions } from "../CustomFunctions.js";
import { DB } from "../Firebase.js";

var scene;
var score = 0;
var finalScoreText;
//Variables for background
const backgroundWidth = window.innerWidth - 20;
var canvasWidth = backgroundWidth;
var canvasHeight = window.innerHeight - 20;
var setBackgroundScale = canvasWidth / backgroundWidth;
var x1 = 0;
var x2 = canvasWidth;
var x3 = canvasHeight
var backgroundSpeed = 1;
var backgroundV1, backgroundV2;
//player positions
var arrayStep = [];
var nextStep;
var nNote = 25;
var step = ((canvasWidth / nNote));
//player
var player;
var line;
var startY = canvasHeight - 200;
var particles;
var emitter;
var scoreText;
//coins and melody
var slider;
var db = new DB();
var selectedSong = '';
var tempo;
var custom = null;
var prevCoin = null;
var coins;
var vel;
var gamePaused = false;
var setCoins = false;
//coin-player interaction
var overlapping = false;
var noteOn = false;
var coinList = new Array();
var coinCounter = 0;
//sound
var synth = null;
var sampler;
//KEYBOARD input to debug
var keys = "awsedftgyhujkolpòà";
//MIDI input
var midi = await navigator.requestMIDIAccess();
var midi_notes = [48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72];
var noteNames = ['C4', 'C#4', 'D4', 'D#4', 'E4', 'F4', 'F#4', 'G4', 'G#4', 'A4', 'A#4', 'B4',
  'C5', 'C#5', 'D5', 'D#5', 'E5', 'F5', 'F#5', 'G5', 'G#5', 'A5', 'A#5', 'B5', 'C6'];

export class PlayScene extends Phaser.Scene {
  constructor() {
    super({
      key: CST.SCENES.PLAY
    })
  }

  init(data) {
    selectedSong = data;
  }

  preload() {
    this.load.image('piano', 'assets/piano keyboard actam.png');
    this.load.image('space1', 'assets/Space1.jpg');
    this.load.image('space2', 'assets/Space2.jpg');
    this.load.image('spaceV1', 'assets/Space1V.jpg');
    this.load.image('spaceV2', 'assets/Space1V.jpg');
    this.load.image('coin 4', 'assets/money_square 4.png');
    this.load.spritesheet('character_right', 'assets/M_steps_R.png', { frameWidth: 200, frameHeight: 300 });
    this.load.spritesheet('character_left', 'assets/M_steps_L.png', { frameWidth: 200, frameHeight: 300 });
    this.load.image('line', 'assets/lineaACTAM.png');
    this.load.atlas('flares', 'assets/particles/flares.png', 'assets/particles/flares.json');
    this.load.image('backbutton', 'assets/back.png');
    this.load.image('pausebutton', 'assets/pause.png');
    this.load.image('restartbutton', 'assets/restart.png');
    this.load.scenePlugin('rexuiplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js', 'rexUI', 'rexUI');
  }

  create() {
    //INITIALIZING GAME VARS
    score = 0;
    scene = this.scene;
    coinList = [];
    coinCounter = 0;
    setCoins = false;

    /* Vertical background movement */
    backgroundV1 = this.physics.add.sprite(0, x1, 'spaceV1').setOrigin(0, 0);
    backgroundV2 = this.physics.add.sprite(0, -x3, 'spaceV2').setOrigin(0, 0);
    backgroundV1.setScale(setBackgroundScale);
    backgroundV2.setScale(setBackgroundScale);
    backgroundV1.setVelocityY(- backgroundSpeed);
    backgroundV2.setVelocityY(- backgroundSpeed);

    //storing all possible character positions (corresponding to the piano keys)
    for (let i = 0; i < nNote; i++) {
      nextStep = ((step / 2) + i * step);
      arrayStep[i] = nextStep;
    }

    //PLAYER
    player = this.physics.add.sprite(20, startY + 48, 'character_right').setScale(0.30);
    //collider to get coins
    line = this.physics.add.sprite(20, startY, 'line').setDisplaySize(30, 1);

    //Particles to indicate tha player is getting the right notes
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

    //ANIMATION
    this.anims.create({
      key: 'flying_right',
      frames: this.anims.generateFrameNumbers('character_right', { start: 0, end: 2 }),
      frameRate: 5,
      repeat: -1
    });

    //CHARACTER ANIMATION
    player.anims.play('flying_right');

    //PIANO KEYBOARD IMAGE 
    const pianoSprite = this.add.sprite(0, startY, 'piano').setOrigin(0, 0).setDisplaySize(canvasWidth, 200);

    //LAYER OBJECT -> to make coins disappear under the keyboard when getting them
    const layer1 = this.add.layer();
    layer1.add([pianoSprite]);
    layer1.add([player, line]);
    layer1.add([particles]);
    layer1.sendToBack(particles);

    //BPM slider and text
    const bpmBackground = this.rexUI.add.roundRectangle(canvasWidth - 120, canvasHeight - 70, 200, 10, 20, COLOR_LIGHT);
    var print0 = this.add.text(canvasWidth - 200, canvasHeight - 80, "BPM: " + '');
    print0.setColor(COLOR_DARK);
    print0.setFontSize(20);

    slider = this.rexUI.add.slider({
      x: canvasWidth - 120,
      y: canvasHeight - 40,
      width: 200,
      height: 20,
      orientation: 'x',

      background: this.rexUI.add.roundRectangle(0, 0, 0, 0, 14, COLOR_PRIMARY),
      track: this.rexUI.add.roundRectangle(0, 0, 0, 0, 6, COLOR_DARK),
      thumb: this.rexUI.add.roundRectangle(0, 0, 0, 0, 10, COLOR_LIGHT),

      valuechangeCallback: function (value) {
        var bpm = 0;
        bpm = normToTempo(value);
        print0.text = "BPM: " + bpm;
      },
      space: {
        top: 4,
        bottom: 4
      },
      input: 'drag', // 'drag'|'click'
    })
      .layout();

    //SCORE
    scoreText = this.add.text(180, 26, 'score: 0', { fontSize: '32px', fill: '#FFF' });
    finalScoreText = this.add.text(canvasWidth/2, canvasHeight/2, '', { fontSize: '55px', fill: '#FFF' }).setOrigin(0.5, 0.5);
    finalScoreText.text = '';

    //COINS
    coins = this.physics.add.group();

    db.setSceneMelody(selectedSong);
    db.initializeLocalVariables();
    db.getDataInCustom(function (duration, notes, time) {
      tempo = db.getSongTempo();
      custom = new CustomFunctions(duration, notes, time);
      custom.notesToCoins(arrayStep, coins, tempo);
      //BPM CALCULATION
      //Setting coins velocity
      //first map: 100 = 0, 110 = 1 , 120 = 2...
      var z = (tempo / 10) - 10;
      //second map: velocity = f(bpm) = bpm + 69 + 7 * bpmIndex;
      var coinVel = tempoToGameVelocity(tempo, z);
      coins.setVelocityY(coinVel);
      //adding each coin to the highest layer
      for (let i = 0; i < coins.getChildren().length; i++) {
        layer1.add([coins.getChildren()[i]]);
      }
      setCoins = true;
      //SLIDER CHANGE
      slider.setValue((tempo - 60) / 80);
      vel = tempo;
      slider.on('valuechange', function () {
        let currentTempo = normToTempo(slider.getValue());
        currentTempo = parseInt(currentTempo);
        var v = (currentTempo / 10) - 10;
        vel = tempoToGameVelocity(currentTempo, v);
        if (!gamePaused) {
          coins.setVelocityY(vel);
        }
      });
    })

    //SOUND
    synth = new Tone.PolySynth().toDestination();
    /* sampler = new Tone.Sampler({
      urls: {
        A1: "A1.mp3",
        A2: "A2.mp3",
      },
      baseUrl: "https://tonejs.github.io/audio/casio/",
    }).toDestination(); */

    //CHARACTER-COIN OVERLAP FUNCTION
    var once = true;
    var otherOnce = true;
    var startTime;
    var firstOverlap = true;
    this.physics.add.overlap(line, coins, function (player, coin) {
      overlapping = true;
      //time calculation for bpm and coin velocity
      /* if (once) {
        startTime = performance.now();
        once = false;
      }
      if (otherOnce && coin != prevCoin && prevCoin != null) {
        otherOnce = false;
        var endTime = performance.now();
        var timeDiff = endTime - startTime; //in ms
        // strip the ms
        timeDiff /= 1000;
        // get seconds 
        var seconds = timeDiff;
        console.log(seconds + " seconds");
      } */
      //COIN-PLAYER INTERACTION
      if(coin != prevCoin && prevCoin != null){
        console.log("next coin");
        firstOverlap = true;
      }
      //what to do when getting a note right
      if (noteOn) {
        if(firstOverlap){ //getting a coin
          coinList.push(coin);
          firstOverlap = false;
          coinCounter += 1;
          console.log(coinCounter);
        }
        if(coinList.length <= 1){ //only coin taken pressing a key
          score += 10;
          layer1.sendToBack(coin);
          emitter.setVisible(true);
        } 
        else { //kept pressed since last coin
          emitter.setVisible(false);
        }
        prevCoin = coin;
      }
      scoreText.setText('Score: ' + score);
    }, null, this);

    //BACK BUTTON
    let buttonback = this.add.image(canvasWidth - 170, 16, "backbutton").setOrigin(0).setDepth(1).setScale(1.2);
    buttonback.setInteractive();
    buttonback.on("pointerup", () => {
      this.scene.start(CST.SCENES.MENU);
    })

    //RESTART BUTTON
    let buttonrestart = this.add.image(canvasWidth - 350, 16, "restartbutton").setOrigin(0).setDepth(1).setScale(1.2);
    buttonrestart.setInteractive();
    buttonrestart.on("pointerup", () => {
      this.scene.restart();
    })

    //PAUSE BUTTON
    let buttonpause = this.add.image(16, 16, "pausebutton").setOrigin(0).setDepth(1).setScale(1.2);
    buttonpause.setInteractive();
    buttonpause.on("pointerup", () => {
      pauseGame();
    })
  }

  update() {
    if(setCoins && coins != null){
      if(coins.getChildren()[coins.getChildren().length-1].y > canvasHeight){
        finalScoreText.text = "You got " + coinCounter + " / " + coins.getChildren().length + " coins";
        setCoins = false;
      }
    }
    // Movement of the charzcter with keybord DEBUG ONLY
    /* window.addEventListener("keydown", (e) => {
      var noteIndex = keys.indexOf(e.key);
      if(!e.repeat){
        if (noteIndex >= 0 && noteIndex < keys.length) {
          player.x = arrayStep[noteIndex];
          line.x = arrayStep[noteIndex];
          emitter.setPosition(line.x, line.y);
          //synth.triggerAttack(noteNames[noteIndex], Tone.now());
          noteOn = true;
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
        //synth.triggerRelease(noteNames[noteIndex], Tone.now());
      }
    });
    */

    if (!overlapping) {
      emitter.setVisible(false);
    }
    overlapping = false;

    //message.data[0]->midi element status
    //message.data[1]->midi element id
    //message.data[2]->midi element value
    // Movement with MIDI 
    for (var input of midi.inputs.values()) {
      input.onmidimessage = function (message) {
        if (message.data[1] == 36 && message.data[0] == 144) {//pause pad
          pauseGame();
        } 
        else if (message.data[1] == 38 && message.data[0] == 144) { //restart pad
          scene.restart();
        } 
        else if (message.data[1] == 14) { //tempo slider
          let normKnobValue = message.data[2] / 127;
          slider.setValue(normKnobValue);
        }
        else { //keyboard
          var noteIndex = midi_notes.indexOf(message.data[1]);
          player.x = arrayStep[noteIndex];
          line.x = arrayStep[noteIndex];

          if (message.data[0] == 144) { //if note on
            noteOn = true;
            emitter.setPosition(line.x, line.y);

            //sampler.triggerAttack(noteNames[noteIndex], Tone.now());
            synth.triggerAttack(noteNames[noteIndex], Tone.now());
          } 
          else if (message.data[0] == 128) { //is note off
            noteOn = false;
            emitter.setVisible(false);
            coinList = [];

            //sampler.triggerRelease(noteNames[noteIndex], Tone.now());
            synth.triggerRelease(noteNames[noteIndex], Tone.now());
          }
        }
      }
    }

    // Background movement controlled vertically

    if (backgroundV1.y > canvasHeight) backgroundV1.y = -canvasHeight + backgroundV2.y - backgroundSpeed;
    else backgroundV1.y = backgroundV1.y + backgroundSpeed;

    if (backgroundV2.y > canvasHeight) backgroundV2.y = -canvasHeight + backgroundV1.y - backgroundSpeed;
    else backgroundV2.y = backgroundV2.y + backgroundSpeed;

  }
}

function pauseGame() {
  if (!gamePaused) {
    gamePaused = true;
    coins.setVelocityY(0);
  } else {
    gamePaused = false;
    console.log(vel);
    coins.setVelocityY(vel);
  }
}

function tempoToGameVelocity(tempo, bpmIndex) {
  return tempo + 69 + 7 * bpmIndex;
}

function normToTempo(normValue) {
  return (normValue * 80 + 60).toFixed(0);
}