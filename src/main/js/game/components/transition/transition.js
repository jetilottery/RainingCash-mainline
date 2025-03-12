define(require => {
    const app = require('skbJet/componentManchester/standardIW/app');
    const msgBus = require('skbJet/component/gameMsgBus/GameMsgBus');
    const displayList = require('skbJet/componentManchester/standardIW/displayList');
    const gameConfig = require('skbJet/componentManchester/standardIW/gameConfig');
    const resLib = require('skbJet/component/resourceLoader/resourceLib');
    const dimensions = require('game/template/dimensions');
    const backgrounds = require('game/components/effects/background');
    const orientation = require('skbJet/componentManchester/standardIW/orientation');
    const audio = require('skbJet/componentManchester/standardIW/audio');
    const animState = require('game/state/anim');
    const SKBeInstant = require('skbJet/component/SKBeInstant/SKBeInstant');
    const bonusHelpButton = require('game/components/bonusHelpButton');
    require('com/pixijs/pixi-particles');

    const PIXI = require('com/pixijs/pixi');
    require('com/gsap/TweenMax');
    require('com/gsap/plugins/PixiPlugin');
    const Tween = window.TweenMax;

    let _transitionContainer;
    let _transitionShower;
    let _spineAnim_Bonus;
    let _spineAnim_BonusPort;
    let _transitionLogoContainer;
    let _transitionLogo;
    //let _transitionLogoSwirl;
    //let _transitionLogoSwirlAnimation;

    let _bonusGame;
    let _transitionLand;
    let _transitionPort;
    let _toBonus = false;
    let _fromStage;
    let _bonusName;
    let baseGameElements;
    let postBonusSwitchCallback = null;

    let ignoreShowerEvent = false;

    // const showerTimeScale = 1.5;
    const bonusFadeOutTime = 1;
    const transitionBackgroundDelay = 1.6;
    //const numberOfWinningNumbers = 5;
    const numberOfPlayerNumbers = 25;

    let error = false;

    const particleConfig = {
        "alpha": {
            "start": 1,
            "end": 0
        },
        "scale": {
            "start": 0.75,
            "end": 0.75,
            "minimumScaleMultiplier": 1.5
        },
        "color": {
            "start": "#ffffff",
            "end": "#ffffff"
        },
        "speed": {
            "start": 0,
            "end": 0,
            "minimumSpeedMultiplier": 1
        },
        "acceleration": {
            "x": 0,
            "y": 3000
        },
        "maxSpeed": 0,
        "startRotation": {
            "min": 0,
            "max": 360
        },
        "noRotation": true,
        "rotationSpeed": {
            "min": 0,
            "max": 0
        },
        "lifetime": {
            "min": 3.2,
            "max": 3.2
        },
        "blendMode": "normal",
        "frequency": 0.001,
        "emitterLifetime": 3,
        "maxParticles": 200,
        "pos": {
            "x": 0,
            "y": 0
        },
        "addAtBack": true,
        "spawnType": "rect",
        "spawnRect": {
            "x": 0,
            "y": -100,
            "w": 2000,
            "h": 2000
        }
    };

    const bonusSpriteTable = {
        'WheelBonus': {
            symbol: 'Transition_WheelBonusSymbol',
            // text : 'wheel-bonus-text'
        },

        'CollectBonus': {
            symbol: 'Transition_PrizeBonusSymbol',
            // text : 'collect-bonus-text'
        }
    };

    function init() {
        // Instantiate transition container
        _transitionContainer = new PIXI.Container();
        _transitionContainer.name = 'transitionContainer';
        //_transitionContainer.alpha = 0;

        // //////// Background animation
        _spineAnim_Bonus = new PIXI.spine.Spine(resLib.spine['BG'].spineData);
        _spineAnim_BonusPort = new PIXI.spine.Spine(resLib.spine['BG'].spineData);
        _spineAnim_Bonus.state.setAnimation(0, 'LANDSCAPE_BONUS_INTRO', true);
        _spineAnim_BonusPort.state.setAnimation(0, 'PORTRAIT_BONUS_INTRO', true);
        _spineAnim_Bonus.x = 720;
        _spineAnim_Bonus.y = 405;
        _spineAnim_BonusPort.x = 405;
        _spineAnim_BonusPort.y = 720;
        _spineAnim_Bonus.alpha = 0;
        _spineAnim_BonusPort.alpha = 0;
        _spineAnim_Bonus.renderable = orientation.get() === 'landscape';
        _spineAnim_BonusPort.renderable = orientation.get() === 'portrait';

        //
        // //////// Shower animation
        _transitionShower = new PIXI.Sprite();
        _transitionShower.name = 'transitionShower';
        _transitionShower.anchor.set(0);
        _transitionShower.scale.set(1);
        _transitionLand = new PIXI.spine.Spine(resLib.spine['Transition'].spineData);
        _transitionPort = new PIXI.spine.Spine(resLib.spine['Transition'].spineData);
        _transitionLand.name = 'transitionShower_Land'; 
        _transitionLand.x = 500;
        _transitionLand.y = 360;
        _transitionPort.name = 'transitionShower_Port'; 
        _transitionPort.y = 700;
        _transitionShower.addChild(_transitionLand, _transitionPort);
        //_transitionShower.renderable = false;


        //////// Logo and Swirl animation
        // _transitionLogoSwirl = new PIXI.Sprite();
        // _transitionLogoSwirl.name = 'transitionLogoSwirl';
        // _transitionLogoSwirl.anchor.set(0.5);
        // _transitionLogoSwirl.y = -70;
        // _transitionLogoSwirlAnimation = new PIXI.spine.Spine(resLib.spine['Bonuses'].spineData);
        // _transitionLogoSwirl.addChild(_transitionLogoSwirlAnimation);

        // wrapper for the bonus logo and logo swirl
        _transitionLogoContainer = new PIXI.Sprite();
        _transitionLogoContainer.name = 'transitionLogoContainer';
        _transitionLogoContainer.anchor.set(0.5);
        //_transitionLogoContainer.addChild(_transitionLogoSwirl);

        ///// Assemble all the transition layers into the master container
        _transitionContainer.addChild(_spineAnim_Bonus,_spineAnim_BonusPort,_transitionLogoContainer, _transitionShower);


        // Add the transition container at the point directly below the footer
        for (let i = 0; i < app.stage.children.length; i++) {
            if (app.stage.children[i].name === 'footerContainer') {
                app.stage.addChildAt(_transitionContainer, i - 1);
                break;
            }
        }

        // list of elements to fade out when switching between stages
        baseGameElements = [
            displayList.buttonBar,
            displayList.baseGameContainer
        ];

        onOrientationChange();

        // Position
        // _transitionLand.x = dimensions.landscape.width >> 1;
        // _transitionLand.y = dimensions.landscape.height >> 1;
        // _transitionPort.x = dimensions.portrait.width >> 1;
        // _transitionPort.y = dimensions.portrait.height >> 1;

        // _transitionLand.state.addListener({
        //   event: function() {
        
        //     if(ignoreShowerEvent){
        //         return;
        //     }
        
        //     if(orientation.get() === 'landscape'){
        //       swapScreen();
        //       if(!_toBonus){
        //         backgrounds.transitionBackground({
        //             'delay': 0,
        //             'toBonus': false,
        //             'promised': false
        //         });
        //       }
        //     }
        //   },
        //   complete : doBonusCompleteCallback
        // });
        
        // _transitionPort.state.addListener({
        //   event: function() {
        
        //     if(ignoreShowerEvent){
        //       return;
        //     }
        
        //     if(orientation.get() === 'portrait'){
        //       swapScreen();
        //       if(!_toBonus){
        //         backgrounds.transitionBackground({
        //             'delay': 0,
        //             'toBonus': false,
        //             'promised': false
        //         });
        //       }
        //     }
        //   },
        //   complete : doBonusCompleteCallback
        // });

        // Listen for orientation change
        msgBus.subscribe('GameSize.OrientationChange', onOrientationChange);

    }

    function doBonusCompleteCallback() {
        if (postBonusSwitchCallback) {
            postBonusSwitchCallback.call();
        }
        postBonusSwitchCallback = null;
    }

    /*
     * Transition to bonus after a delay
     */
    function transitionToBonus(data) {
        if (error) {
            return;
        }

        _fromStage = 'BaseGame';
        if (data.fromStage !== 'BaseGame') {
            _fromStage = displayList[data.fromStage + 'Container'];
        }
        // Next stage
        _bonusName = data.toStage;
        _bonusGame = displayList[_bonusName + 'Container'];
        _bonusGame.alpha = 0;
        _bonusGame.renderable = true;

        _transitionLogo = new PIXI.Sprite();
        let bonusSymbol = new PIXI.Sprite(new PIXI.Texture.fromFrame(bonusSpriteTable[_bonusName].symbol));
        if (_bonusName === 'CollectBonus') {
            bonusSymbol.y = -112;
        } else {
            bonusSymbol.y = -95;
        }
        bonusSymbol.anchor.set(0.5);
        // let bonusText = new PIXI.Sprite(new PIXI.Texture.fromFrame(bonusSpriteTable[_bonusName].text));
        // bonusText.anchor.set(0.5);
        _transitionLogo.addChild(bonusSymbol);
        _transitionLogoContainer.addChild(_transitionLogo);
        _transitionLogo.anchor.set(0.5);
        _transitionLogo.alpha = 0;
        _transitionLogoContainer.alpha = 1;
        _transitionLogoContainer.visible = true;
        //_transitionLogoSwirlAnimation.renderable = true;
        //_transitionLogoSwirlAnimation.alpha = 0;

        let callback = data.callback ? data.callback : null;
        if (_fromStage !== 'BaseGame') {
            Tween.delayedCall(gameConfig.delayBeforeTransitionToBonus, doBonusToBonusTransition, [callback]);
        } else {
            Tween.delayedCall(gameConfig.delayBeforeTransitionToBonus, doTransition, [true, data.fromStage, data.toStage, callback]);
        }
    }


    function transitionToBaseGame(data) {
        // displayList.ticketSelectBarSmall.visible = true;
        Tween.delayedCall(gameConfig.delayBeforeTransitionToBaseGame, doTransition, [false, 'BaseGame', data.stage, data.callback]);
    }


    function playShowerAnimation() {
        _transitionLand.state.setAnimation(0,'Transition', false);
        _transitionPort.state.setAnimation(0,'Transition_portrait', false);

        Tween.delayedCall(particleConfig.emitterLifetime/2, () => {
            if (ignoreShowerEvent) {
                return;
            }

            swapScreen();
            if (!_toBonus) {
                backgrounds.transitionBackground({
                    'delay': 0,
                    'toBonus': false,
                    'promised': false
                });
            }
        });
        Tween.delayedCall(particleConfig.emitterLifetime,()=>{
            doBonusCompleteCallback();
        });
    }

    async function doBonusToBonusTransition(bonusCompleteCallback) {

        // set the callback for the shower event
        postBonusSwitchCallback = bonusCompleteCallback;

        // play the shower to exit current bonus
        ignoreShowerEvent = true;
        playShowerAnimation();
        Tween.delayedCall( transitionBackgroundDelay, () => { Tween.to( [_spineAnim_Bonus,_spineAnim_BonusPort], 0.2, {alpha: 1,} ); });
        playTransitionAudio(_bonusName);

        // fade out the current bonus
        Tween.to(_fromStage, bonusFadeOutTime, {
            delay: 0.5,
            alpha: 0, onComplete: function () {
                _fromStage.renderable = false;
            }
        });


        // then fade in the next bonus logo
        await new Promise(resolve => {
            Tween.to([_transitionLogo], 0.6, {
                alpha: 1,
                delay: 1.9,
                // onStart: function () {
                //     _transitionLogoSwirlAnimation.state.setAnimation(0, 'BonusIcons/BonusIconLoop', true);
                // },
                onComplete: resolve
            });
        });

        // then... wait - TODO - config this delay??
        await new Promise(resolve => Tween.delayedCall(1, resolve));

        // do the shower to hide the logo 
        ignoreShowerEvent = false;
        playShowerAnimation();     
        Tween.delayedCall( transitionBackgroundDelay, () => { Tween.to( [_spineAnim_Bonus,_spineAnim_BonusPort], 0.2, {alpha: 0,} ); });
        msgBus.publish('Bonus.Prepare', {'bonusName': _bonusName});

        postBonusSwitchCallback = null;
    }


    async function doTransition(toBonus, fromStage, toStage, bonusCompleteCallback) {
        if (error) {
            return;
        }
        
        Tween.to([_spineAnim_Bonus,_spineAnim_BonusPort], 0.8, {
             alpha: 1, 
        });

        _toBonus = toBonus;

        if (_toBonus) {

            let backgroundFadeTime = 0.4;
            let gameFadeTime = 0.8;

            //_transitionLogoSwirlAnimation.renderable = true;
            playTransitionAudio(_bonusName, true);


            if (fromStage === 'BaseGame') {
                Tween.to(displayList.ticketSelectBarSmall, gameFadeTime, {
                    alpha: 0, onComplete: () => {
                        displayList.ticketSelectBarSmall.interactive = false;
                        displayList.ticketSelectBarSmall.visible = false;                        
                    }
                });

                // fade out the basegame and switch the backgrounds
                Tween.to(baseGameElements, gameFadeTime, {
                    alpha: 0, onComplete: function () {

                        // after fading out the basegame - tell the bonus card icon to stop playing it's triggering animation
                        msgBus.publish('Game.StopBonusCardIcon', {'stage': _bonusName});

                    }
                });

                // fade to the bonus background
                await backgrounds.transitionBackground({
                    'delay': backgroundFadeTime,
                    'toBonus': true,
                    'bonusName': _bonusName
                });
                // displayList.ticketSelectBarSmall.visible = false;


            } else {

                // play the shower transition and fade out the current bonus
                Tween.to(_fromStage, bonusFadeOutTime, {
                    delay: 0.5,
                    alpha: 0, onComplete: function () {
                        _bonusGame.renderable = false;
                        bonusHelpButton.toggle(false, false);
                    }
                });

                postBonusSwitchCallback = bonusCompleteCallback;
                playShowerAnimation();
                //playTransitionAudio();

            }

            // then fade in the bonus logo
            await new Promise(resolve => {
                Tween.to([/* _transitionLogoSwirlAnimation, */ _transitionLogo], 0.5, {
                    alpha: 1,
                    // onStart: function () {
                    //     _transitionLogoSwirlAnimation.state.setAnimation(0, 'BonusIcons/BonusIconLoop', true);
                    // },
                    onComplete: resolve
                });
            });

            // then... wait 
            await new Promise(resolve => Tween.delayedCall(1, resolve));
            playShowerAnimation();         
            msgBus.publish('Bonus.Prepare', {'bonusName': _bonusName});
            postBonusSwitchCallback = null;        

        } else {


            // GOING BACK TO BASEGAME


            Tween.to(_bonusGame, bonusFadeOutTime, {
                delay: 0.5,
                alpha: 0, onComplete: function () {
                    _bonusGame.renderable = false;
                    bonusHelpButton.toggle(false, false);
                }
            });

            postBonusSwitchCallback = bonusCompleteCallback;
            playShowerAnimation();
            playTransitionAudio();
        }    
        Tween.delayedCall( transitionBackgroundDelay, () => { Tween.to( [_spineAnim_Bonus,_spineAnim_BonusPort], 0.2, {alpha: 0,} ); });
    }

    function playTransitionAudio(bonus, transition) {
        let audioName = '';
        if (bonus !== undefined) {
            if (bonus === 'WheelBonus') {
                if (transition === undefined) {
                    audioName = 'wheelBonusTransition';
                } else {
                    audioName = 'wheelBonusTriggered';
                }
            } else {
                if (transition === undefined) {
                    audioName = 'prizeBonusTransition';
                } else {
                    audioName = 'prizeBonusTriggered';
                }
            }
        } else {
            audioName = 'transition';
        }
        audio.play(audioName);
    }


    function swapScreen() {
        if (_toBonus) {
            _bonusGame.alpha = 0;

            // get bonus name here
            Tween.to(_bonusGame, 0.3, {alpha: 1});
            Tween.to(_transitionLogoContainer, 0.3, {
                alpha: 0, onComplete: function () {
                    _transitionLogoContainer.visible = false;
                    _transitionLogo.renderable = false;
                    //_transitionLogoSwirlAnimation.renderable = false;

                    _transitionLogoContainer.removeChild(_transitionLogo);
                }
            });
            baseGameElements.forEach((el) => {
                el.visible = !_toBonus;
            });
        } else {

            baseGameElements.forEach((el) => {
                el.visible = true;
            });

            Tween.to(baseGameElements, 0.3, {
                alpha: 1, delay: 0.1, onComplete: function () {
                    msgBus.publish('Game.EnablePicksFromBonus');
                }
            });

            if (SKBeInstant.config.gameConfigurationDetails.availablePrices.length > 1) {
                Tween.to(displayList.ticketSelectBarSmall, 0.3, {
                    alpha: 1, onComplete: () => {
                        displayList.ticketSelectBarSmall.interactive = true;
                        displayList.ticketSelectBarSmall.visible = true;
                    }
                });
            }
        }
        let nextState = (_toBonus) ? _bonusName : 'BASE_GAME';
        if (gameConfig.bonusMusic !== undefined || gameConfig.bonusMusic === true) {
            if (nextState !== 'BASE_GAME') {
                if (!audio.isPlaying('bonusMusic')) {
                    audio.fadeOut('music', 1);
                    audio.fadeIn('bonusMusic', 0.1, true);
                    // Tween.delayedCall(0.5, function playBonusMusic() {
                    //     audio.fadeIn('bonusMusic', 0, true);
                    // });
                }
            } else {
                // If there are still picks to be made play the basegame music, otherwise the game is fnished so await the win plaque
                //audio.fadeOut('bonusMusic', 0.5);
                if(animState.player.length !== numberOfPlayerNumbers){
                    audio.fadeOut('bonusMusic', 0.5);
                    audio.fadeIn('music', 0.1, true);
                }
            }
        }
        msgBus.publish('Game.StateChanged', nextState);
    }


    function onOrientationChange() {
        _transitionLand.renderable = orientation.get() === 'landscape';
        _transitionPort.renderable = orientation.get() === 'portrait';
        
        _spineAnim_Bonus.renderable = orientation.get() === 'landscape';
        _spineAnim_BonusPort.renderable = orientation.get() === 'portrait';

        if (orientation.get() === 'landscape') {
            _transitionLogoContainer.x = dimensions.landscape.width >> 1;
            _transitionLogoContainer.y = dimensions.landscape.height >> 1;
        } else {
            _transitionLogoContainer.x = dimensions.portrait.width >> 1;
            _transitionLogoContainer.y = dimensions.portrait.height >> 1;
        }

    }

    function abortTransition() {
        error = true;
    }

    msgBus.subscribe('Game.TransitionToBonus', transitionToBonus);
    msgBus.subscribe('Game.TransitionToBaseGame', transitionToBaseGame);
    msgBus.subscribe('UI.showError', abortTransition);


    return {
        init,
        transitionToBonus,
        transitionToBaseGame
    };
});