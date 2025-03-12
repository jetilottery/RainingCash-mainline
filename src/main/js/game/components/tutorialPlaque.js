define(require => {
    const PIXI = require('com/pixijs/pixi');
    const displayList = require('skbJet/componentManchester/standardIW/displayList');
    const msgBus = require('skbJet/component/gameMsgBus/GameMsgBus');
    const resources = require('skbJet/component/pixiResourceLoader/pixiResourceLoader');
    const orientation = require('skbJet/componentManchester/standardIW/orientation');

    let imageMap = {
        instantWin: "Tutorial_IW",
        instantWin10X: "Tutorial_IW_10X",
        instantWin2X: "Tutorial_IW_2X",
        wheel: "Tutorial_WheelBonus",
        collect: "Tutorial_PrizeBonus",
    };
    let pages = {};

    let imagePadding = [
        [20, 20],
        [60, 20],
        [60, 20]
    ];

    function init() {
        let o = orientation.get() === orientation.LANDSCAPE ? "landscape" : "portrait";

        displayList.howToPlayPages.children.forEach((element, index) => {
            displayList["howToPlayPage" + (index + 1) + "textContainer"].children.forEach((e, i) => {
                if (pages[index + 1] === undefined) {
                    pages[index + 1] = [];
                }
                pages[index + 1] = e;

                e.text = resources.i18n.Game.howToPlay['page' + (index + 1)][o]['text' + (i + 1)];

                Object.keys(imageMap).forEach(el => {
                    if (resources.i18n.Game.howToPlay['page' + (index + 1)][o]['text' + (i + 1)].match('\{(' + el + ')\}')) {
                        e.text = resources.i18n.Game.howToPlay['page' + (index + 1)][o]['text' + (i + 1)].replace('{' + el + '}', " ");
                        e.updateText(false);
                        let sprite = new PIXI.Sprite();
                        sprite.texture = PIXI.Texture.from(imageMap[el]);
                        sprite.anchor.set(0.5);
                        e.sprite = sprite;
                        e.addChild(sprite);
                        e.style.wordWrap = true;
                    }
                });


            });
        });

        msgBus.subscribe('GameSize.OrientationChange', onOrientationChange);
        onOrientationChange();
    }

    function onOrientationChange() {
        let o = orientation.get() === orientation.LANDSCAPE ? "landscape" : "portrait";

        displayList.howToPlayPages.children.forEach((element, index) => {
            displayList["howToPlayPage" + (index + 1) + "textContainer"].children.forEach((e,i) => {

                if(orientation.get()===orientation.LANDSCAPE) {
                    e.style.wordWrapWidth = 1058;
                } else {
                    e.style.wordWrapWidth = 500;
                }

                e.text = resources.i18n.Game.howToPlay['page' + (index + 1)][o]['text' + (i + 1)];

                Object.keys(imageMap).forEach(el => {
                    if (resources.i18n.Game.howToPlay['page' + (index + 1)][o]['text' + (i + 1)].match('\{(' + el + ')\}')) {
                        e.text = resources.i18n.Game.howToPlay['page' + (index + 1)][o]['text' + (i + 1)].replace('{' + el + '}', " ");
                    }
                });
                e.updateText(false);
                if (e.sprite !== undefined) {
                    e.sprite.position.set(0);

                    if (orientation.get() === orientation.LANDSCAPE) {
                        
                        if ((index + 1) > 1) {
                            e.sprite.x = -imagePadding[index][0];
                        } else {
                            e.sprite.y = e.texture.height + imagePadding[index][1];
                        }
                        
                        if(index === 0) {
                            e.sprite.x = imagePadding[index][0];
                        }
                    } else {
                        e.sprite.y = e.texture.height + imagePadding[index][1];
                        
                        if(index === 0) {
                            e.sprite.x = imagePadding[index][0]/2;
                        }
                    }
                }
            });
        });
    }

    return {
        init
    };
});