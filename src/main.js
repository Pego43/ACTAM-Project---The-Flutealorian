/** @type {import("../typings/phaser")} */
//import UIPlugin from '../node_modules/phaser3-rex-plugins/templates/ui/ui-plugin.js';
const backgroundHeight = 2000;
const backgroundWidth = 3000;
var canvasWidth = window.innerWidth - 30;
var canvasHeight = window.innerHeight - 30;

import { LoadScene } from "./scenes/LoadScene.js";
import { MenuScene } from "./scenes/MenuScene.js";
import { PlayScene } from "./scenes/PlayScene.js";

let game = new Phaser.Game({
  type: Phaser.AUTO,
  width: canvasWidth,
  height: canvasHeight,
  scene: [
    LoadScene, MenuScene, PlayScene
  ],
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  },
});

/*  Orizontal background movement
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



var config = {
   
 };

var game = new Phaser.Game(config);
*/


