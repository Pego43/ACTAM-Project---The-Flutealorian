import { CST } from "./CST.js";
export class MenuScene extends Phaser.Scene {
    constructor() {
        super({
            key: CST.SCENES.MENU
        })
    }
init(data){
    

}
create(){
    this.scene.start(CST.SCENES.PLAY);
    

}
}