define(require => {
    const PIXI = require('com/pixijs/pixi');
    const msgBus = require('skbJet/component/gameMsgBus/GameMsgBus');
    const resLib = require('skbJet/component/resourceLoader/resourceLib');
    const SKBeInstant = require('skbJet/component/SKBeInstant/SKBeInstant');
    const displayList = require('skbJet/componentManchester/standardIW/displayList');
    const orientation = require('skbJet/componentManchester/standardIW/orientation');
    const textStyles = require('skbJet/componentManchester/standardIW/textStyles');
    const meterData = require('skbJet/componentManchester/standardIW/meterData');
    const rollupUtils = require('game/components/utils/rollupUtils');
    const utils = require('game/components/utils/utils');
    // const colourScheme = require('game/state/colourScheme');
    const wheel = require('game/components/bonus/wheel');
    const audio = require('skbJet/componentManchester/standardIW/audio');
    const animState = require('game/state/anim');
    const bonusHelpButton = require('game/components/bonusHelpButton');

    require('com/gsap/TweenMax');
    require('com/gsap/TimelineLite');
    require('com/gsap/easing/EasePack');

    const TimelineLite = window.TimelineLite;
    const Tween = window.TweenMax;
    const WHEEL_SHINE_DELAY = 3;

    let scenario;
    let wheelBonusTotalWin = '';
    let wheelBonusCashPrize = '';
    let wheelBonusMultiplierPrize = '';
    let wheelBonusComplete;
    let doWheelShine = false;
    let wheelGlow;
    let wheelShine;
    let logoGlow;
    let segmentHighlight;
    let totalWinGlow = undefined;

    function init() {

        displayList.wheelSpinButton.enabled = false;
        displayList.wheelSpinButtonGradient.enabled = false;



        // Highlight animation over the win window
        segmentHighlight = new PIXI.spine.Spine(resLib.spine['Bonuses'].spineData);
        displayList.wheelWinWindow.addChild(segmentHighlight);
        segmentHighlight.name = "WheelWinHighlight";
        segmentHighlight.x = -19;
        segmentHighlight.renderable = false;

        // Glow spine anim behind the wheel
        wheelGlow = new PIXI.spine.Spine(resLib.spine['Bonuses'].spineData);
        wheelGlow.scale.set(1.5);
        displayList.wheelGlow.addChild(wheelGlow);
        wheelGlow.alpha = 0;
        wheelGlow.renderable = false;

        // Shine animation that plays over the wheel center and win window
        wheelShine = new PIXI.spine.Spine(resLib.spine['Bonuses'].spineData);
        displayList.wheelShine.addChild(wheelShine);
        wheelShine.state.setAnimation(0, 'WheelBonus/WheelAmbient', false);
        wheelShine.renderable = false;

        let maxLogoWidth = 500;
        let logoText = new PIXI.Sprite(new PIXI.Texture.fromFrame('WheelBonusLogo'));
        logoText.anchor.set(0.5);
        displayList.wheelBonusLogoText.addChild(logoText);
        logoText.scale.set(Math.min(maxLogoWidth / logoText.width, 1));

        // Glow spine anim behind the logo
        logoGlow = new PIXI.spine.Spine(resLib.spine['Bonuses'].spineData);
        displayList.wheelBonusLogoGlow.addChild(logoGlow);
        logoGlow.alpha = 0;
        logoGlow.renderable = false;

        // Set the 'win up to' text
        constructWinMultiplierInfo();
        displayList.wheelWinUptoLine2.text = resLib.i18n.game.Game.wheelBonus.winUpToLine2;
        displayList.wheelWinUptoLine2Gradient.text = resLib.i18n.game.Game.wheelBonus.winUpToLine2;


        // Set the label text of the win announce
        displayList.wheelWinPrizeLabel.text = resLib.i18n.game.Game.wheelBonus.winPlaque.prize;
        displayList.wheelWinMultiplierLabel.text = resLib.i18n.game.Game.wheelBonus.winPlaque.multiplier;
        displayList.wheelTotalWinLabel.text = resLib.i18n.game.Game.wheelBonus.winPlaque.totalWin;

        wheel.init();

        displayList.wheelSpinButton.on('press', () => {
            triggerSpin();
            displayList.wheelSpinButton.enabled = false;
            displayList.wheelSpinButton.visible = false;
            displayList.wheelSpinButtonGradient.enabled = false;
            displayList.wheelSpinButtonGradient.visible = false;
            bonusHelpButton.toggle(true, false);
            audio.play('spinStart');
        });

        onOrientationChange();
        resetAssetStartState();

        msgBus.subscribe('GameSize.OrientationChange', onOrientationChange);
    }

    function resetAssetStartState() {
        displayList.bonusWheelContainer.renderable = false;
        displayList.bonusWheelContainer.alpha = 0;
        displayList.bonusWheelContainerPortrait.renderable = false;
        displayList.bonusWheelContainerPortrait.alpha = 0;
        displayList.wheelBonusLogo.renderable = false;
        displayList.wheelBonusLogo.alpha = 0;
        displayList.wheelWinUpto.renderable = false;
        displayList.wheelWinUpto.alpha = 0;
        displayList.wheelSpinButton.renderable = false;
        displayList.wheelSpinButton.alpha = 0;

        displayList.wheelSpinButtonGradient.renderable = false;
        displayList.wheelSpinButtonGradient.alpha = 0;
    }

    function constructWinMultiplierInfo() {

        let elementsContainer = new PIXI.Container();
        let spacer = 20;
        let numberAssetPaddingOffset = 10; //take care of the outer area of the asset to better center it
        let maxWidth = 480;

        let multiplier = new PIXI.Sprite(new PIXI.Texture.fromFrame('wheel-10x'));
        multiplier.anchor.set(0, 0.5);

        let line1Text = new PIXI.Text(resLib.i18n.game.Game.wheelBonus.winUpToLine1, textStyles.parse('wheelWinUpToLine1Text'));
        line1Text.anchor.set(0, 0.5);
        utils.fitText(line1Text, maxWidth - (multiplier.width + spacer), 48, true);

        line1Text.position.x = numberAssetPaddingOffset;
        multiplier.position.x = line1Text.position.x + line1Text.width + spacer;

        elementsContainer.addChild(line1Text, multiplier);
        elementsContainer.width = line1Text.width + spacer + multiplier.width;

        rollupUtils.createTextureFromContainer(elementsContainer, 'concatWinUpToText');
        let concatWinUpToText = rollupUtils.spriteFromTexture('concatWinUpToText');

        displayList.wheelWinUptoLine1.addChild(concatWinUpToText);
    }

    async function complete() {
        await new Promise(c => {
            wheelBonusComplete = c;
        });
    }

    function onGameCompleteCallback() {
        animState.WheelBonus.complete = true;
        animState.WheelBonus.launch = false;

        wheelBonusComplete();
    }

    function getWinAndReset() {
        let total = SKBeInstant.formatCurrency(wheelBonusTotalWin).formattedAmount;
        reset();
        return total;
    }

    function playWinHighlight() {
        segmentHighlight.state.setAnimation(0, 'WheelBonus/WheelWinHighlighter', true);
        segmentHighlight.alpha = 0;
        segmentHighlight.renderable = true;
        Tween.to(wheelGlow, 0.5, {
            alpha: 0,
            onComplete: function() {
                wheelGlow.renderable = false;
            }
        });
        Tween.to(segmentHighlight, 0.3, { alpha: 1, delay: 1, ease: window.Power2.easeOut });
    }

    function stopWinHighlight() {
        Tween.to(segmentHighlight, 0.8, {
            alpha: 0,
            delay: 0.5,
            ease: window.Power2.easeOut,
            onComplete: function() {
                segmentHighlight.renderable = false;
                segmentHighlight.state.setEmptyAnimation(0);
            }
        });

        // transition to next bonus or back to the basegame
        let nextStage = animState.CollectBonus.launch && !animState.CollectBonus.complete ? 'CollectBonus' : 'BaseGame';

        if (nextStage === 'BaseGame') {
            msgBus.publish('Game.TransitionToBaseGame', { stage: "WheelBonus", callback: onGameCompleteCallback });
        } else {
            // once tranaitioned to the next bonus call complete on wheel bonus
            msgBus.publish('Game.TransitionToBonus', {
                fromStage: 'WheelBonus',
                toStage: 'CollectBonus',
                callback: onGameCompleteCallback
            });
        }
    }

    function showWinArea() {

        displayList.wheelTotalWinValue.text = SKBeInstant.formatCurrency(wheelBonusTotalWin).formattedAmount;
        displayList.wheelTotalWinValueGradient.text = SKBeInstant.formatCurrency(wheelBonusTotalWin).formattedAmount;
        displayList.wheelBonusWinInfo.visible = true;
        displayList.wheelBonusWinInfoPortrait.visible = true;


        Tween.to(displayList.wheelBonusInfo, 0.5, {
            alpha: 0,
            delay: 1,
            onComplete: function() {
                displayList.wheelBonusInfo.renderable = false;
            }
        });

        Tween.to(displayList.wheelWinUpto, 0.5, {
            alpha: 0,
            delay: 1,
            onComplete: function() {
                displayList.wheelWinUpto.renderable = false;
            }
        });

        displayList.wheelBonusWinInfo.y = 250;
        displayList.wheelBonusWinInfoPortrait.y = 250;

        Tween.to(displayList.wheelBonusWinInfo, 0.5, { alpha: 0, delay: 2, y: 315 });
        Tween.to(displayList.wheelBonusWinInfoPortrait, 0.5, { alpha: 0, delay: 2, y: 300 });

        Tween.to(displayList.wheelBonusWinInfo, 1, { alpha: 1, delay: 2 });
        Tween.to(displayList.wheelBonusWinInfoPortrait, 1, { alpha: 1, delay: 2 });
    }

    function showWin() {

        // set the text for the win amount
        displayList.wheelWinPrizeValue.text = SKBeInstant.formatCurrency(wheelBonusCashPrize).formattedAmount;
        displayList.wheelWinPrizeValueGradient.text = SKBeInstant.formatCurrency(wheelBonusCashPrize).formattedAmount;
        displayList.wheelWinMultiplierValue.text = wheelBonusMultiplierPrize;

        if (totalWinGlow === undefined) {
            totalWinGlow = new PIXI.spine.Spine(resLib.spine['Bonuses'].spineData);
            displayList.wheelTotalWinGlow.addChild(totalWinGlow);
            totalWinGlow.state.setAnimation(0, 'TotalWinGlow', true);
        }

        // stop the wheel shine animation from playing again
        doWheelShine = false;

        // slight delay - then play sparkle animation over the top of the win window
        playWinHighlight();
        // fade out the logo and info area and fade in the win amounts
        showWinArea();

        // after delay fade out the win area and call the transition out
        Tween.delayedCall(5, stopWinHighlight);
        meterData.win += wheelBonusTotalWin;
    }

    async function triggerSpin() {
        wheelBonusTotalWin = scenario.wheelTotalPrize;
        wheelBonusCashPrize = scenario.wheelCashPrize;
        wheelBonusMultiplierPrize = scenario.wheelMultiplier;
        return wheel.spinWheel({ endpoints: [scenario['wheelCode'], scenario['wheelMultiplier']] }, showWin);
    }

    function populate(data) {
        scenario = data;
    }

    function reset() {
        scenario = undefined;
        wheelBonusCashPrize = '';
        wheelBonusTotalWin = '';
        wheelBonusMultiplierPrize = '';
        displayList.wheelSpinButton.enabled = false;
        displayList.wheelSpinButtonGradient.enabled = false;

        displayList.wheelBonusInfo.renderable = true;
        displayList.wheelBonusInfo.alpha = 1;
        displayList.wheelBonusWinInfo.alpha = 0;
        displayList.wheelBonusWinInfoPortrait.alpha = 0;
        displayList.wheelSpinButton.visible = true;
        displayList.wheelSpinButtonGradient.visible = true;

        displayList.wheelWinUpto.renderable = true;
        resetAssetStartState();
        wheel.reset();
        // msgBus.unsubscribe('game.background.update',background.updateBonusBackround);
    }

    function startWheelShine() {
        if (doWheelShine) {
            // play the shine once
            wheelShine.renderable = true;
            wheelShine.state.setAnimation(0, 'WheelBonus/WheelAmbient', false);
            // queue up the next shine to play (if we are still playing it)
            Tween.delayedCall(WHEEL_SHINE_DELAY, startWheelShine);
        } else {
            wheelShine.renderable = false;
        }
    }

    function playBonusIntro(data) {
        if (data === 'WheelBonus') {
            //
            // msgBus.unsubscribe('game.background.update',background.updateBonusBackround);
            // msgBus.subscribe('game.background.update',background.updateBonusBackround);

            let fadeTime = 0.5;
            let wheelFadeTime = 0.75;
            let timeDiff = "-=0.3";
            let shiftAmount = 100;
            let glowFadeTime = 2;
            let glowFadeEase = window.Power1.easeIn;
            let logoStartPosition = displayList.wheelBonusLogo.position.y;

            displayList.bonusWheelContainer.renderable = true;
            displayList.bonusWheelContainerPortrait.renderable = true;
            displayList.wheelBonusLogo.renderable = true;
            displayList.wheelWinUpto.renderable = true;
            displayList.wheelSpinButton.renderable = true;
            displayList.wheelSpinButton.alpha = 0;

            displayList.wheelSpinButtonGradient.renderable = true;
            displayList.wheelSpinButtonGradient.alpha = 0;

            logoGlow.alpha = 0;
            wheelGlow.alpha = 0;
            logoGlow.renderable = true;
            wheelShine.renderable = true;

            let tl = new TimelineLite({
                delay: 0.7,
                onComplete: function enableSpinButton() {
                    displayList.wheelSpinButton.enabled = true;
                    displayList.wheelSpinButtonGradient.enabled = true;
                    // Disable the wheelSpinButtonGradient interactive property
                    displayList.wheelSpinButtonGradient.interactive = false;
                    bonusHelpButton.toggle(true, true);
                }
            });

            /////////////////// WHEEL
            tl.fromTo(displayList.bonusWheelContainer, wheelFadeTime, {
                alpha: 0,
                x: -250,
                y: 380
            }, {
                alpha: 1,
                x: 0,
                y: 380,
                ease: window.Power2.easeOut,
                onComplete: function() {
                    wheelGlow.state.setAnimation(0, 'WheelBonus/WheelBGAmbient', true);
                    doWheelShine = true;
                    startWheelShine();
                    Tween.to(wheelGlow, glowFadeTime, { alpha: 1, ease: glowFadeEase });
                }
            }, 0);

            tl.fromTo(displayList.bonusWheelContainerPortrait, wheelFadeTime, {
                alpha: 0,
                x: 405,
                y: 1630
            }, {
                alpha: 1,
                x: 405,
                y: 1330,
                ease: window.Power2.easeOut,
            }, 0);

            /////////////////// LOGO
            tl.fromTo(displayList.wheelBonusLogo, fadeTime, {
                alpha: 0,
                y: logoStartPosition - shiftAmount
            }, {
                alpha: 1,
                y: logoStartPosition,
                ease: window.Power2.easeOut,
                onComplete: function() {
                    logoGlow.state.setAnimation(0, 'PrizeBonus/PrizeBonusIconGlow_TURQUOISE', true);
                    Tween.to(logoGlow, glowFadeTime, { alpha: 1, ease: glowFadeEase });
                }
            }, timeDiff);


            tl.fromTo(displayList.wheelWinUptoLandscapeContainer, fadeTime, {
                y: -100
            }, {
                y: 0,
                ease: window.Power2.easeOut
            }, timeDiff);

            tl.fromTo(displayList.wheelWinUptoPortraitContainer, fadeTime, {
                y: -1040
            }, {
                y: -940,
                ease: window.Power2.easeOut
            }, timeDiff);

            /////////////////////// WIN UP TO
            tl.fromTo(displayList.wheelWinUpto, fadeTime, {
                alpha: 0,
            }, {
                alpha: 1,
                ease: window.Power2.easeOut
            }, timeDiff);

            ///////////////////////// SPIN BUTTON
            tl.fromTo(displayList.wheelSpinButton, 0.2, {
                alpha: 0
            }, {
                alpha: 1,
                ease: window.Power2.easeOut
            });

            tl.fromTo(displayList.wheelSpinButtonGradient, 0.2, {
                alpha: 0
            }, {
                alpha: 1,
                ease: window.Power2.easeOut
            });

        }
    }

    function onOrientationChange() {

        if (orientation.get() === orientation.LANDSCAPE) {
            displayList.wheelBonusWinInfo.renderable = true;
            displayList.wheelBonusWinInfoPortrait.renderable = false;

            displayList.wheelWinUptoLandscapeContainer.addChild(displayList.wheelWinUpto);
            displayList.wheelBonusWinInfo.addChild(displayList.wheelWinTop, displayList.wheelWinDivider, displayList.wheelWinBottom);

            displayList.bonusWheelContainer.addChild(displayList.bonusWheel, displayList.wheelSpinButton, displayList.wheelSpinButtonGradient);

        } else {
            displayList.wheelBonusWinInfo.renderable = false;
            displayList.wheelBonusWinInfoPortrait.renderable = true;
            displayList.wheelWinUptoPortraitContainer.addChild(displayList.wheelWinUpto);
            displayList.wheelBonusWinInfoPortrait.addChild(displayList.wheelWinTop, displayList.wheelWinDivider, displayList.wheelWinBottom);

            displayList.bonusWheelContainerPortrait.addChild(displayList.bonusWheel, displayList.wheelSpinButton, displayList.wheelSpinButtonGradient);
        }

    }

    msgBus.subscribe('Game.StateChanged', playBonusIntro);

    return {
        init,
        complete,
        populate,
        reset,
        getWinAndReset
    };
});