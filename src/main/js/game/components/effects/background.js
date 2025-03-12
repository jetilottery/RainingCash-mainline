
define(require => {
    const msgBus = require('skbJet/component/gameMsgBus/GameMsgBus');
    const displayList = require('skbJet/componentManchester/standardIW/displayList');
    const resLib = require('skbJet/component/resourceLoader/resourceLib');
    const orientation = require('skbJet/componentManchester/standardIW/orientation');
    const PIXI = require('com/pixijs/pixi');
    require('com/gsap/TweenMax');
    require('com/pixijs/pixi-particles');

    const Tween = window.TweenMax;
    const bonusElementsAnim = ['BGambient_BONUS','PORTRAIT/PORT_BGambient_BONUS'];
    const baseGameElementsAnim = ['BGambient','PORTRAIT/PORT_BGambient'];

    let basegameBackgroundLayer;
    let bonusBackgroundLayer;

    let elementsLayer;
    let shapesLayer;

    let spineAnim_Base;
    let spineAnim_Elements;
    let spineAnim_Shapes;
    let spineAnim_Shapes_Bonus;
    let spineAnim_Bonus;
    let spineAnim_BonusPort;

    // let pricePointIndex;
    // let backgroundColours;
    // let shapes;
    // let spineColourAnim;
    // let spineShapeSkin;
    // let currentShape;
    // let backgroundConfigCount;
    // let shapeConfigCount;

    let _toBonus;

    function init() {
        basegameBackgroundLayer = displayList.basegameBackground;
        bonusBackgroundLayer = displayList.bonusBackground;
        elementsLayer = displayList.backgroundElements;
        shapesLayer = displayList.backgroundShapes;

        // Set up spine project
        spineAnim_Base = new PIXI.spine.Spine(resLib.spine['BG'].spineData);
        spineAnim_Elements = new PIXI.spine.Spine(resLib.spine['BG_elements'].spineData);
        spineAnim_Shapes = new PIXI.spine.Spine(resLib.spine['BGshapes'].spineData);
        spineAnim_Shapes_Bonus = new PIXI.spine.Spine(resLib.spine['BGshapes'].spineData);
        spineAnim_Bonus = new PIXI.spine.Spine(resLib.spine['BG'].spineData);
        spineAnim_BonusPort = new PIXI.spine.Spine(resLib.spine['BG'].spineData);

        spineAnim_Bonus.renderable = false;
        spineAnim_BonusPort.renderable = false;

        // Add to background containers
        basegameBackgroundLayer.addChild(spineAnim_Base);
        bonusBackgroundLayer.addChild(spineAnim_Bonus, spineAnim_BonusPort);
        elementsLayer.addChild(spineAnim_Elements);
        shapesLayer.addChild(spineAnim_Shapes, spineAnim_Shapes_Bonus);

        spineAnim_Base.state.setAnimation(0, 'LANDSCAPE', true);
        resetBGAnimation();
        spineAnim_Elements.state.setAnimation(0, baseGameElementsAnim[orientation.get() === orientation.LANDSCAPE ? 0 : 1], true);

        onOrientationchange();

        spineAnim_Bonus.alpha = 0;
        spineAnim_BonusPort.alpha = 0;

        spineAnim_Shapes.state.timeScale = 0.08;
        spineAnim_Shapes_Bonus.state.timeScale = 0.08;
        spineAnim_Shapes_Bonus.renderable = false;
        msgBus.subscribe('GameSize.OrientationChange', onOrientationchange);
        msgBus.subscribe('PrizeData.PrizeStructure', switchBackground);
    }

    function onOrientationchange() {
        spineAnim_Base.x = spineAnim_Bonus.x = spineAnim_Elements.x = spineAnim_Shapes.x = spineAnim_Shapes_Bonus.x = orientation.get() === 'landscape' ? 720 : 405;
        spineAnim_Base.y = spineAnim_Bonus.y = spineAnim_Elements.y = spineAnim_Shapes.y = spineAnim_Shapes_Bonus.y = orientation.get() === 'landscape' ? 405 : 720;

        spineAnim_BonusPort.x = spineAnim_Base.x;
        spineAnim_BonusPort.y = spineAnim_Base.y;

        if(orientation.get() === orientation.LANDSCAPE) {
            spineAnim_Base.state.setAnimation(0, 'LANDSCAPE', true);
        } else {
            spineAnim_Base.state.setAnimation(0, 'PORTRAIT', true);
        }

        // switchBackground();

        // spineAnim_Elements.state.setAnimation(0, baseGameElementsAnim[orientation.get() === orientation.LANDSCAPE?0:1], true);
        // spineAnim_Shapes.state.setAnimation(0, bgShapes[orientation.get() === orientation.LANDSCAPE?0:1], true);
        // spineAnim_Shapes_Bonus.state.setAnimation(0, bgShapesBonus[orientation.get() === orientation.LANDSCAPE?0:1], true);

        updateBonusBackround();
    }


    function switchBackground() {
        if (spineAnim_Base) {

        //     let prices = SKBeInstant.config.gameConfigurationDetails.availablePrices;
        //     pricePointIndex = prices.indexOf(meterData.ticketCost);

        //     // Change the background
        //     // Modulo - if there are less colours defined in the config than there are price points loop through the defined colours
        //     spineColourAnim = colourTable[backgroundColours[pricePointIndex % backgroundConfigCount]];
        //     msgBus.publish('Game.SetColourScheme', {'colour': spineColourAnim});

        //     // if (spineColourAnim !== currentBackground) {
        //         if (orientation.get() === orientation.LANDSCAPE) {
        //             spineAnim_Base.state.setAnimation(0, spineColourAnim, false);
        //             spineAnim_Bonus.state.setAnimation(0, spineColourAnim, false);
        //         } else {
        //             spineAnim_BonusPort.state.setAnimation(0, 'PORTRAIT/PORT_' + spineColourAnim, false);
        //         }
        //         // currentBackground = spineColourAnim;
        //     // }
        //     spineAnim_Elements.state.setAnimation(0, baseGameElementsAnim[orientation.get() === orientation.LANDSCAPE?0:1], true);
        //     // Change the shapes
        //     // Modulo - if there are less shapes defined in the config than there are price points loop through the defined shapes
        //     spineShapeSkin = shapesTable[shapes[pricePointIndex % shapeConfigCount]];
        //     if (spineShapeSkin !== currentShape) {
        //         spineAnim_Shapes.skeleton.setSkin(null);
        //         spineAnim_Shapes.skeleton.setSkinByName(spineShapeSkin);
        //         spineAnim_Shapes_Bonus.skeleton.setSkin(null);
        //         spineAnim_Shapes_Bonus.skeleton.setSkinByName(spineShapeSkin);
        //     }
        }
    }


    function transitionBackground(data) {

        return new Promise(resolve => {

            _toBonus = data.toBonus;

            if (_toBonus) {


                // set the bonus background to be visible
                if (orientation.get() === orientation.LANDSCAPE) {
                    spineAnim_Bonus.renderable = true;
                } else {
                    spineAnim_BonusPort.renderable = true;
                }


                spineAnim_BonusPort.alpha = 1;
                spineAnim_Bonus.alpha = 1;

                // fade out the current bg elements
                Tween.to([spineAnim_Base, spineAnim_Elements, spineAnim_Shapes], data.delay, {
                    alpha: 0, onComplete: function () {
                        // once faded out replace with the current bonus elements and get bonus shapes ready to appear
                        spineAnim_Shapes_Bonus.alpha = 0;
                        spineAnim_Shapes_Bonus.renderable = true;
                        spineAnim_Shapes.renderable = false;
                        spineAnim_Base.renderable = false;
                    }
                });

                updateBonusBackround();
                // once the elements has faded out and switched, fade it back in, showing the new one
                Tween.to([spineAnim_Elements, spineAnim_Shapes_Bonus] , data.delay, {
                    alpha: 1, delay: data.delay, onComplete: function () {
                        resolve();
                    }
                });

            } else {

                // swap the index of the basegame background to be behind the bonus background
                let targetIndex = displayList.background.getChildIndex(bonusBackgroundLayer);
                displayList.background.setChildIndex(basegameBackgroundLayer, targetIndex);

                // make basegame bg visible and alpha 1
                spineAnim_Base.renderable = true;
                spineAnim_Base.alpha = 1;
                basegameBackgroundLayer.visible = true;
                basegameBackgroundLayer.alpha = 1;

                // fade the bonus background and BG elements out
                Tween.to([spineAnim_Bonus, spineAnim_BonusPort, spineAnim_Elements, spineAnim_Shapes_Bonus], data.delay, {
                    alpha: 0, onComplete: function () {
                        // once faded out replace with the basegame elements
                        spineAnim_Shapes.alpha = 0;
                        spineAnim_Shapes.renderable = true;
                        spineAnim_Shapes_Bonus.renderable = false;
                        spineAnim_Elements.state.setAnimation(0, baseGameElementsAnim[orientation.get() === orientation.LANDSCAPE?0:1], true);
                    }
                });

                Tween.to([spineAnim_Elements,spineAnim_Shapes], data.delay, {
                    alpha: 1, delay: data.delay, onComplete: function () {
                        resolve();
                    }
                });

            }
        });
    }

    function updateBonusBackround() {
        if (orientation.get() === orientation.LANDSCAPE) {
            spineAnim_Bonus.renderable = true;
            spineAnim_BonusPort.renderable = false;
        } else {
            spineAnim_BonusPort.renderable = true;
            spineAnim_Bonus.renderable = false;
        }
        if(_toBonus) {
            spineAnim_Elements.state.setAnimation(0, bonusElementsAnim[orientation.get() === orientation.LANDSCAPE?0:1], true);
        }
    }

    function resetBGAnimation(){
        spineAnim_Bonus.state.setAnimation(0, 'LANDSCAPE_BONUS', true);
        spineAnim_BonusPort.state.setAnimation(0, 'PORTRAIT_BONUS', true);
    }

    return {
        init,
        transitionBackground,
        resetBGAnimation,
    };
});