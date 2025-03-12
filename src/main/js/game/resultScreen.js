define(function(require) {
    const gameFlow = require('skbJet/componentManchester/standardIW/gameFlow');
    const meterData = require('skbJet/componentManchester/standardIW/meterData');
    const audio = require('skbJet/componentManchester/standardIW/audio');
    const gameConfig = require('skbJet/componentManchester/standardIW/gameConfig');
    const SKBeInstant = require('skbJet/component/SKBeInstant/SKBeInstant');
    const displayList = require('skbJet/componentManchester/standardIW/displayList');
    const msgBus = require('skbJet/component/gameMsgBus/GameMsgBus');
    const PIXI = require('com/pixijs/pixi');
    const resLib = require('skbJet/component/resourceLoader/resourceLib');
    const playerNumbers = require('game/components/playerNumbers');
    const orientation = require('skbJet/componentManchester/standardIW/orientation');

    require('com/gsap/TweenMax');
    const Tween = window.TweenMax;
    let glowAnimation;

    function init() {
        glowAnimation = new PIXI.spine.Spine(resLib.spine['WinAnnounce'].spineData);
        glowAnimation.renderable = false;
        glowAnimation.alpha = 0;
        displayList.winPlaqueGlow.addChild(glowAnimation);
        displayList.winPlaqueCloseButton.on('press', hideResult);
        displayList.losePlaqueCloseButton.on('press', hideResult);

        displayList.winPlaqueValue1.parent.removeChild(displayList.winPlaqueValue1);
        displayList.winPlaqueValue.parent.addChild(displayList.winPlaqueValue1);
    }

    function hideResult() {
        Tween.to(glowAnimation, 0.2, {
            alpha: 0,
            onComplete: function() {
                glowAnimation.renderable = false;
                glowAnimation.state.setEmptyAnimation(0);

                displayList.winPlaqueMessageContainer.alpha = 0;

                displayList.losePlaqueMessageWithGradient.alpha = 0;
                displayList.losePlaqueMessage.alpha = 0;
            }
        });
    }

    function resultScreen() {
        // ResultPlaques template component handles populating and showing the result screen
        // All that needs doing here is playing the result screen audio
        playerNumbers.onResultPlaque();

        let ori = orientation.get() === orientation.LANDSCAPE ? "landscape" : "portrait";
        if (gameConfig.showResultScreen) {
            if (meterData.totalWin > 0) {
                glowAnimation.renderable = true;
                glowAnimation.alpha = 1;
                glowAnimation.state.setAnimation(0, ori + '_winPlaque_INTRO', false, 0);
                glowAnimation.state.addAnimation(0, ori + '_winPlaque_LOOP', true, 0);

                // Show winning text and amount.
                displayList.winPlaqueMessageContainer.alpha = 1;

            } else if (!gameConfig.suppressNonWinResultPlaque) {

                glowAnimation.renderable = true;
                glowAnimation.alpha = 1;
                glowAnimation.state.setAnimation(0, ori + '_losePlaque_INTRO', false, 0);
                glowAnimation.state.addAnimation(0, ori + '_losePlaque_LOOP', true, 0);

                displayList.losePlaqueMessageWithGradient.alpha = 1;
                displayList.losePlaqueMessage.alpha = 1;

            }
        }

        const terminator = meterData.totalWin > 0 ? 'winTerminator' : 'loseTerminator';
        if (gameConfig.backgroundMusicEnabled) {
            if (audio.isPlaying('music')) {
                audio.fadeOut('music', gameConfig.resultMusicFadeOutDuration);
            }
            if (audio.isPlaying('bonusMusic')) {
                audio.fadeOut('bonusMusic', gameConfig.resultMusicFadeOutDuration);
            }
        }
        msgBus.publish('game.winningNumber.resetBagDropFlag');
        Tween.delayedCall(gameConfig.resultTerminatorFadeInDelay, () =>
            audio.fadeIn(terminator, gameConfig.resultTerminatorFadeInDuration, false)
        );

        displayList.winPlaqueValue.text = SKBeInstant.formatCurrency(meterData.totalWin).formattedAmount;
        displayList.winPlaqueValue1.text = SKBeInstant.formatCurrency(meterData.totalWin).formattedAmount;
    }

    msgBus.subscribe('UI.hideResult', hideResult);
    gameFlow.handle(resultScreen, 'RESULT_SCREEN');

    return {
        init
    };
});