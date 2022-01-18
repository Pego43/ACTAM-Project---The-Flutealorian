const COLOR_PRIMARY = 0xff00ff;
const COLOR_LIGHT = 0x7700b3;
const COLOR_DARK = 0x7700b3;

var windSongSelected = '';
var pianoSongSelected = '';
var db = new DB();

import { CST } from "./CST.js";
import { DB } from "../Firebase.js";
export class MenuScene extends Phaser.Scene {
    constructor() {
        super({
            key: CST.SCENES.MENU
        })
    }
    init(data) {




    }
    preload() {

        this.load.scenePlugin('rexuiplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js', 'rexUI', 'rexUI');
        this.load.script('webfont', 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js');
        this.load.image("loading1", "./assets/loading1.jpg");
        this.load.image("title", "./assets/title1.png");
        this.load.image("start_wind", "./assets/wind_mood.png");
        this.load.image("start_piano", "./assets/piano_mood.png");

    }
    create() {
        var x = this.game.renderer.width;
        var y = this.game.renderer.height;
        this.add.image(0, 0, "loading1").setOrigin(0).setDisplaySize(x, y);
        this.add.image(x / 2, y / 4, "title").setDepth(1);


        var add = this.add;
        var input = this.input;
        var items = [
            {
                name: '?',
                children: [
                    {
                        name: ' Welcome to Flutealorian!\n To start playing, just\n select a song and press the button\n for the appropriate mode.',

                    },

                ],

            },

        ];

        var scene = this, menu = undefined;
        menu = createMenu(scene, 15, 15, items, function (button) {
        }).setDepth(2);
        this.input.on('pointerdown', function (pointer) {
            if (menu === undefined) {
                menu = createMenu(scene, 15, 15, items, function (button) {
                });
                menu.setDepth(2);
            } else if (!menu.isInTouching(pointer)) {
                menu.collapse();
                menu = createMenu(scene, 15, 15, items, function (button) {
                });
                menu.setDepth(2);
            }
        }, this);




        var options1 = db.getDocNames(1);
        var options2 = db.getDocNames(2);


        //this.add.text(this.game.renderer.width /2, this.game.renderer.height /2 , 'Select one song and Play!', { fontFamily: 'tech', fontSize: 80, color: '#FF1493' }).setShadow(2, 2, "#333333", 2, false, true).setDepth(1);
        //right button
        let playButton1 = this.add.image(x / 2 + 150, y / 2, "start_piano").setDepth(1).setScale(.85);
        var dropDownList1 = CreateDropDownList(this, x / 2 + 150, y / 2 + 75, options1).layout()

        //left button
        let playButton2 = this.add.image(x / 2 - 150, y / 2, "start_wind").setDepth(1).setScale(.85);
        var dropDownList2 = CreateDropDownList(this, x / 2 - 150, y / 2 + 75, options2).layout()


        //this.scene.start(CST.SCENES.PLAY);






        playButton1.setInteractive();
        playButton1.on("pointerup", () => {
            if (pianoSongSelected != '')
                this.scene.start(CST.SCENES.PLAY, pianoSongSelected);
        })

        playButton2.setInteractive();
        playButton2.on("pointerup", () => {
            if(windSongSelected != '')
                location.href = "../../Flutealorian/src/index.html";
        })
    }
}

//DROP DOWN MENU FUNCTIONS
var CreateDropDownList = function (scene, x, y, options, mode) {
    var maxTextSize = GetMaxTextObjectSize(scene, options);

    var label = scene.rexUI.add.label({
        x: x, y: y,

        background: scene.rexUI.add.roundRectangle(0, 0, 2, 2, 0, COLOR_PRIMARY),

        icon: scene.rexUI.add.roundRectangle(0, 0, 20, 20, 10, COLOR_LIGHT),

        text: CreateTextObject(scene, 'Song selection')
            .setFixedSize(maxTextSize.width, maxTextSize.height),

        // action:

        space: {
            left: 10,
            right: 10,
            top: 10,
            bottom: 10,
            icon: 10
        }
    })
        .setData('value', '');

    label.data.events.on('changedata-value', function (parent, value, previousValue) {
        label.text = value;
    })
    if (options[0]) {
        label.setData('value', options[0])
    }

    var menu;
    scene.rexUI.add.click(label)
        .on('click', function () {
            if (!menu) {
                var menuX = label.getElement('text').getTopLeft().x,
                    menuY = label.bottom;
                menu = CreatePopupList(scene, menuX, menuY, options, function (button) {
                    label.setData('value', button.text);
                    if(mode){
                        //piano mode
                        pianoSongSelected = button.text;
                    } else {
                        //wind mode
                        windSongSelected = button.text;
                        db.setSceneMicrophoneGame(windSongSelected);
                    }
                    menu.collapse();
                    menu = undefined;
                });
            } else {
                menu.collapse();
                menu = undefined;
            }
        })
    return label;
}

var CreatePopupList = function (scene, x, y, options, onClick) {
    var items = options.map(function (option) { return { label: option } });
    var menu = scene.rexUI.add.menu({
        x: x,
        y: y,
        orientation: 'y',

        items: items,
        createButtonCallback: function (item, i, options) {
            return scene.rexUI.add.label({
                background: scene.rexUI.add.roundRectangle(0, 0, 2, 2, 0, COLOR_DARK),

                text: CreateTextObject(scene, item.label),

                space: {
                    left: 10,
                    right: 10,
                    top: 10,
                    bottom: 10,
                    icon: 10
                }
            })
        },

        // easeIn: 500,
        easeIn: {
            duration: 500,
            orientation: 'y'
        },

        // easeOut: 100,
        easeOut: {
            duration: 100,
            orientation: 'y'
        }

        // expandEvent: 'button.over'
    });

    menu
        .on('button.over', function (button) {
            button.getElement('background').setStrokeStyle(1, 0xffffff);
        })
        .on('button.out', function (button) {
            button.getElement('background').setStrokeStyle();
        })
        .on('button.click', function (button) {
            onClick(button);
        })

    return menu;
}

var GetMaxTextObjectSize = function (scene, contentArray) {
    var textObject = CreateTextObject(scene, '');
    var width = 0, height = 0;
    for (var i = 0, cnt = contentArray.length; i < cnt; i++) {
        textObject.text = contentArray[i];
        width = Math.max(textObject.width, width);
        height = Math.max(textObject.height, height);
    }
    textObject.destroy();

    return { width: 170, height: height };
}

var CreateTextObject = function (scene, text) {
    var textObject = scene.add.text(0, 0, text, {
        fontSize: '20px'
    })
    return textObject;
}

var createMenu = function (scene, x, y, items, onClick) {
    var exapndOrientation = 'y';
    var easeOrientation = 'y';

    var menu = scene.rexUI.add.menu({
        x: x,
        y: y,
        orientation: exapndOrientation,
        // subMenuSide: 'right',

        items: items,
        createButtonCallback: function (item, i, items) {
            return scene.rexUI.add.label({
                background: scene.rexUI.add.roundRectangle(0, 0, 2, 2, 0, COLOR_PRIMARY).setDepth(2),
                text: scene.add.text(0, 0, item.name, {
                    fontSize: '20px'
                }).setDepth(2),
                icon: scene.rexUI.add.roundRectangle(0, 0, 0, 0, 10, COLOR_DARK),
                space: {
                    left: 10,
                    right: 10,
                    top: 10,
                    bottom: 10,
                    icon: 10
                }
            })
        },

        // easeIn: 500,
        easeIn: {
            duration: 0,
            orientation: easeOrientation
        },

        // easeOut: 100,
        easeOut: {
            duration: 100,
            orientation: easeOrientation
        }

        // expandEvent: 'button.over'
    });

    menu
        .on('button.over', function (button) {
            button.getElement('background').setStrokeStyle(1, 0xffffff).setDepth(2);
        })
        .on('button.out', function (button) {
            button.getElement('background').setStrokeStyle().setDepth(2);
        })
        .on('button.click', function (button) {
            onClick(button);
        })
        .on('popup.complete', function (subMenu) {
            console.log('popup.complete')
        })
        .on('scaledown.complete', function () {
            console.log('scaledown.complete')
        })

    return menu;
}
