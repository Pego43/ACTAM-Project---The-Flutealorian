import { CST } from "./CST.js";
export class LoadScene extends Phaser.Scene {
    constructor() {
        super({
            key: CST.SCENES.LOAD
        })
    }
    init(){

    }
    preload(){
        //this.load.image("loading1","./assets/loading1.jpg");

    }
    create(){
        this.scene.start(CST.SCENES.MENU,"prova");
    }
}