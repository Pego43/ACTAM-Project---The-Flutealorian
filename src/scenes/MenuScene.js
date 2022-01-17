const COLOR_PRIMARY = 0xff0066;
const COLOR_LIGHT = 0x7b5e57;
const COLOR_DARK = 0x260e04;
var songSelected = '';
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

        var element = document.createElement('style');

        document.head.appendChild(element);

        var sheet = element.sheet;

        var styles = '@font-face { font-family: "tech"; src: url("assets/fonts/ttf/techno_hideo.ttf") format("opentype"); }\n';

        sheet.insertRule(styles, 0);


    }
    preload() {

        this.load.scenePlugin('rexuiplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js', 'rexUI', 'rexUI');
        this.load.script('webfont', 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js');
        this.load.image("loading1", "./assets/loading1.jpg");
        this.load.image("start_button", "./assets/start_button.jpg");

    }
    create() {
        var x = this.game.renderer.width;
        var y = this.game.renderer.height;
        this.add.image(0, 0, "loading1").setOrigin(0).setDisplaySize(x, y);

        var add = this.add;
        var input = this.input;


        var options = db.getDocNames();
        var items = [
            {
                name: '?',
                children: [
                    {
                        name: 'Istruzioni gioco 1',

                    },

                ],
                children: [
                    {
                        name: 'Istruzioni gioco 2',

                    },

                ]
            },

        ];
        
        var scene = this,menu = undefined;
        menu = createMenu(scene, 15, 15, items, function (button) {
        });
        this.input.on('pointerdown', function (pointer) {
            if (menu === undefined) {
                menu = createMenu(scene, 15, 15, items, function (button) {
                });
            } else if (!menu.isInTouching(pointer)) {
                menu.collapse();
                menu = createMenu(scene, 15, 15, items, function (button) {
                });;
            }
        }, this);

        

        var options1 = db.getDocNames(1);
        var options2 = db.getDocNames(2);


        //this.add.text(this.game.renderer.width /2, this.game.renderer.height /2 , 'Select one song and Play!', { fontFamily: 'tech', fontSize: 80, color: '#FF1493' }).setShadow(2, 2, "#333333", 2, false, true).setDepth(1);
        //right button
        let playButton1 = this.add.image(x / 2 + 150, y / 2, "start_button").setDepth(1).setScale(.3);
        var dropDownList1 = CreateDropDownList(this, x/2 +150, y/2 +50, options1).layout()

        //left button
        let playButton2 = this.add.image(x / 2 - 150, y / 2, "start_button").setDepth(1).setScale(.3);
        var dropDownList2 = CreateDropDownList(this, x/2 -150, y/2 +50, options2).layout()


        //this.scene.start(CST.SCENES.PLAY);


        WebFont.load({
            custom: {
                families: ['tech']
            },
            active: function () {
                add.text(x / 3, y / 4, 'Select one song and Play!', { fontFamily: 'tech', fontSize: 30, color: '#FF1493' }).setShadow(2, 2, "#333333", 2, false, true).setDepth(1);

            }
        });



        playButton1.setInteractive();
        playButton1.on("pointerup", () => {
            if (songSelected != '')
                this.scene.start(CST.SCENES.PLAY, songSelected);
        })

        playButton2.setInteractive();
        playButton2.on("pointerup", () => {
            if(songSelected != '')
                db.setSceneMicrophoneGame(songSelected);
                location.href = "../../Flutealorian/src/index.html";
        })
    }

    getSelectedSong(){
        return songSelected;
    }
}

//DROP DOWN MENU FUNCTIONS
var CreateDropDownList = function (scene, x, y, options) {
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
                    songSelected = button.text;
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
                background: scene.rexUI.add.roundRectangle(0, 0, 2, 2, 0, COLOR_PRIMARY),
                text: scene.add.text(0, 0, item.name, {
                    fontSize: '20px'
                }),
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
            duration: 500,
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
            button.getElement('background').setStrokeStyle(1, 0xffffff);
        })
        .on('button.out', function (button) {
            button.getElement('background').setStrokeStyle();
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
