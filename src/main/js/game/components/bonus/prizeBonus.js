define(require => {
    const PrizeBonusPicker = require('game/components/bonus/prizeBonusPicker');
    const prizeBonusButton = require('game/components/bonus/prizeBonusButton');
    const msgBus = require('skbJet/component/gameMsgBus/GameMsgBus');
    const autoPlay = require('skbJet/componentManchester/standardIW/autoPlay');
    const gameConfig = require('skbJet/componentManchester/standardIW/gameConfig');
    const displayList = require('skbJet/componentManchester/standardIW/displayList');
    const resLib = require('skbJet/component/resourceLoader/resourceLib');
    const PIXI = require('com/pixijs/pixi');
    const SKBeInstant = require('skbJet/component/SKBeInstant/SKBeInstant');
    const colourScheme = require('game/state/colourScheme');
    const audio = require('skbJet/componentManchester/standardIW/audio');
    const utils = require('game/components/utils/utils');
    const animState = require('game/state/anim');
    const textStyles = require('skbJet/componentManchester/standardIW/textStyles');
    const resources = require('skbJet/component/pixiResourceLoader/pixiResourceLoader');
    const bonusHelpButton = require('game/components/bonusHelpButton');

    require('com/gsap/TweenMax');
    require('com/gsap/TimelineLite');
    require('com/gsap/easing/EasePack');

    const TimelineLite = window.TimelineLite;
    const Tween = window.TweenMax;

    let pickerArray = [];
    let resolveGame = null;
    let scenario = null;
    let introDelay;
    let infoDelay;
    let holdResultDelay;
    let holdeDelayBeforeDisable;
    let logoGlow;
    let logoGlowContainer;
    let totalWinGlow;
    let totalWinGlowContainer;
    let totalWinValue = 0;
    let colourPostFix;
    let brickdropPromise;

    function init() {

        introDelay = gameConfig.collectBonusPickerDelayBeforeIntro || 0.6;
        infoDelay = gameConfig.collectBonusPickerInfoDelay || 0.25;
        holdResultDelay = gameConfig.collectBonusPickerHoldResultDelay || 4;
        holdeDelayBeforeDisable = gameConfig.collectBonusHoldeDelayBeforeDisable || 1;

        pickerArray = [
            new PrizeBonusPicker({ prefix: 'LEFT', container: displayList.picker_1, index: 9 }),
            new PrizeBonusPicker({ prefix: 'MIDDLE', container: displayList.picker_2, index: 8 }),
            new PrizeBonusPicker({ prefix: 'RIGHT', container: displayList.picker_3, index: 7 }),
            new PrizeBonusPicker({ prefix: 'LEFT', container: displayList.picker_4, index: 6 }),
            new PrizeBonusPicker({ prefix: 'MIDDLE', container: displayList.picker_5, index: 5 }),
            new PrizeBonusPicker({ prefix: 'RIGHT', container: displayList.picker_6, index: 4 }),
            new PrizeBonusPicker({ prefix: 'LEFT', container: displayList.picker_7, index: 3 }),
            new PrizeBonusPicker({ prefix: 'MIDDLE', container: displayList.picker_8, index: 2 }),
            new PrizeBonusPicker({ prefix: 'RIGHT', container: displayList.picker_9, index: 1 }),
        ];

        displayList.CollectBonusContainer.alpha = 0;

        logoGlowContainer = displayList.collectInfoLogoGlow;

        logoGlow = new PIXI.spine.Spine(resLib.spine['Bonuses'].spineData);
        logoGlow.state.setAnimation(0, 'PrizeBonus/PrizeBonusIconGlow_TURQUOISE', true);
        logoGlowContainer.addChild(logoGlow);
        logoGlowContainer.position.set(10, -10);

        totalWinGlowContainer = displayList.collectInfoTotalWinSpineAnimContainer;

        totalWinGlow = new PIXI.spine.Spine(resLib.spine['Bonuses'].spineData);
        totalWinGlow.state.setAnimation(0, 'TotalWinGlow', true);
        totalWinGlowContainer.addChild(totalWinGlow);

        totalWinGlowContainer.alpha = 0;

        let collectInfoAnim = new PIXI.spine.Spine(resLib.spine['Bonuses'].spineData);
        collectInfoAnim.name = 'collectInfoAnim';
        collectInfoAnim.state.setAnimation(0, 'PrizeBonus/CoinStackLoopCollect', true);
        let collectInfoText = new PIXI.Text(resources.i18n.Game.collect, textStyles.parse('collectBonus'));
        collectInfoText.name = 'collectInfoText';
        collectInfoText.anchor.set(0.5);
        collectInfoText.x = 10;
        displayList.collectInfoSprite.addChild(collectInfoAnim, collectInfoText);

        prizeBonusButton.init();
    }

    function enable(data) {
        if (data === "CollectBonus") {
            // msgBus.unsubscribe('game.background.update',background.updateBonusBackround);
            // msgBus.subscribe('game.background.update',background.updateBonusBackround);

            colourPostFix = colourScheme.colour;

            displayList.CollectBonusContainer.renderable = true;

            logoGlowContainer.alpha = 0;
            displayList.collectInfoLogo.alpha = 0;
            displayList.collectInfoSprite.alpha = 0;
            displayList.collectInfoText.alpha = 0;
            displayList.collectInfoTotalWinHeader.alpha = 0;
            displayList.collectInfoContainer.alpha = 0;

            Tween.delayedCall(introDelay, async () => {

                Tween.to(displayList.collectInfoContainer, 0.25, {
                    delay: infoDelay,
                    alpha: 1,
                    onComplete: () => {
                        if (brickdropPromise !== undefined) {
                            brickdropPromise();
                            brickdropPromise = undefined;
                        }
                    }
                });

                autoPlay._enabled = false;

                await new Promise(resolve => {

                    let fadeTime = 0.5;
                    let timeDiff = "-=0.3";
                    let shiftAmount = 100;
                    let glowFadeTime = 2;

                    let logoStartPosition = displayList.collectInfoLogo.position;
                    //let infoStartPosition = displayList.collectInfoText.position;
                    let infoSpriteStartPosition = displayList.collectInfoSprite.position;
                    let totalStartPosition = displayList.collectInfoTotalWinHeader.position;

                    // Timeline to sequence all the intro assets
                    let tl = new TimelineLite();

                    tl.fromTo(displayList.collectInfoLogo, fadeTime, {
                        alpha: 0,
                        y: logoStartPosition.y - shiftAmount
                    }, {
                        alpha: 1,
                        y: logoStartPosition.y,
                        ease: window.Power2.easeOut,
                        onComplete: function() {
                            //   logoGlow.state.setAnimation(0, 'PrizeBonus/PrizeBonusIconGlow_' + colourPostFix, true);
                            Tween.to(logoGlowContainer, glowFadeTime, { alpha: 1, ease: window.Power1.easeIn });
                        }
                    }, 0);


                    // Coin Stack
                    tl.fromTo(displayList.collectInfoSprite, fadeTime, {
                        alpha: 0,
                        y: infoSpriteStartPosition.y - shiftAmount
                    }, {
                        alpha: 1,
                        y: infoSpriteStartPosition.y,
                        ease: window.Power2.easeOut
                    }, fadeTime - 0.3);


                    // Coin stack text
                    tl.fromTo(displayList.collectInfoText, fadeTime, {
                        alpha: 0
                        //y: infoStartPosition.y - shiftAmount
                    }, {
                        alpha: 1,
                        //y: infoStartPosition.y,
                        ease: window.Power2.easeOut
                    }, fadeTime - 0.3);

                    // Total win text
                    tl.fromTo(displayList.collectInfoTotalWinHeader, fadeTime, {
                        alpha: 0,
                        y: totalStartPosition.y - shiftAmount
                    }, {
                        alpha: 1,
                        y: totalStartPosition.y,
                        ease: window.Power2.easeOut
                    }, timeDiff);

                    tl.add(function startBrickDrop() {
                        if (displayList.collectInfoContainer.alpha === 1) {
                            resolve();
                        } else {
                            brickdropPromise = resolve;
                        }
                    }, "-=0.6");


                });

                await Promise.all(
                    pickerArray.map(async e => {
                        await e.intro();
                        await e.enable();
                        if (scenario.length > 0) {
                            audio.playSequential('GoldBar');
                            let value = scenario.shift();
                            await e.showValue(value, colourPostFix);
                            e.addToTotal();
                        } else {
                            disable();
                        }
                    })
                );
            });
        }
    }

    function getWinAndReset() {
        let total = SKBeInstant.formatCurrency(totalWinValue).formattedAmount;
        reset();
        return total;
    }

    function reset() {
        pickerArray.forEach(e => {
            e.reset();
        });
        colourPostFix = null;
        displayList.CollectBonusContainer.alpha = 0;
        displayList.collectInfoTotalWinValue.text = "";
        displayList.collectInfoTotalWinValue1.text = "";
        totalWinValue = 0;
        totalWinGlowContainer.alpha = 0;
        prizeBonusButton.reset();
        brickdropPromise = undefined;
        // msgBus.unsubscribe('game.background.update',background.updateBonusBackround);
    }

    function revealAll() {
        let revealAllArray = [];
        let randomArray = pickerArray.slice();
        randomArray = utils.shuffle(randomArray);

        randomArray.filter(e => {
            return e.enabled === true;
        }).forEach((e, i) => {
            if (i < scenario.length) {
                revealAllArray.push(e.reveal);
            }
        });

        pickerArray.forEach(e => {
            e.interactive = false;
        });

        return revealAllArray;
    }

    function end() {
        audio.play('prizeBonusWin');

        Tween.to(totalWinGlowContainer, 0.5, {
            delay: 1,
            alpha: 1
        });

        Tween.delayedCall(holdResultDelay, () => {

            // transition to next bonus or back to the basegame
            let nextStage = animState.WheelBonus.launch && !animState.WheelBonus.complete ? 'WheelBonus' : 'BaseGame';

            if (nextStage === 'BaseGame') {
                msgBus.publish('Game.TransitionToBaseGame', { stage: "CollectBonus", callback: onGameCompleteCallback });
            } else {
                // once tranaitioned to the next bonus call complete on wheel bonus
                msgBus.publish('Game.TransitionToBonus', {
                    fromStage: 'CollectBonus',
                    toStage: 'WheelBonus',
                    callback: onGameCompleteCallback
                });
            }

        });

        pickerArray.forEach(e => {
            e.setToStaticAnimation();
            e.interactive = false;
        });

    }

    function onGameCompleteCallback() {
        animState.CollectBonus.complete = true;
        animState.CollectBonus.launch = false;
        resolveGame();
    }

    async function complete() {
        await new Promise(c => {
            resolveGame = c;
        });
    }

    function populate(data) {
        scenario = data;
    }

    function updateAndAnimateWinValue(totalWinValueText) {
        Tween.fromTo(totalWinValueText.scale, 0.25, {
            x: 1.3,
            y: 1.3,
            yoyo: true
        }, {
            x: 1,
            y: 1
        });
        totalWinValueText.text = SKBeInstant.formatCurrency(totalWinValue).formattedAmount;
    }

    function addToTotalWinValue(data) {
        totalWinValue += data;
        updateAndAnimateWinValue(displayList.collectInfoTotalWinValue);
        updateAndAnimateWinValue(displayList.collectInfoTotalWinValue1);
    }

    function disable() {
        bonusHelpButton.toggle(true, false);
        pickerArray.forEach(e => {
            e.disable(holdeDelayBeforeDisable);
        });
    }

    msgBus.subscribe('game.collect.end', end);
    msgBus.subscribe('game.collect.disable', disable);
    msgBus.subscribe('Game.StateChanged', enable);
    msgBus.subscribe('game.collect.addToTotal', addToTotalWinValue);
    msgBus.subscribe('game.collect.setInteractive', () => {
        pickerArray.forEach(e => {
            e.enabled = true;
            e.interactive = true;
        });
    });

    return {
        init,
        getWinAndReset,
        reset,
        enable,
        revealAll,
        complete,
        populate
    };

});