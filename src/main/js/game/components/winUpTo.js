define(require => {
    const msgBus = require('skbJet/component/gameMsgBus/GameMsgBus');
    const SKBeInstant = require('skbJet/component/SKBeInstant/SKBeInstant');
    const resources = require('skbJet/component/pixiResourceLoader/pixiResourceLoader');
    const displayList = require('skbJet/componentManchester/standardIW/displayList');
    const prizeData = require('skbJet/componentManchester/standardIW/prizeData');
    require('com/gsap/plugins/PixiPlugin');

    require('com/gsap/TimelineMax');
    require('com/gsap/easing/EasePack');
    const Timeline = window.TimelineMax;

    const FADE_DURATION = 0.5;
    const MIN_SCALE = 0.5;
    const MAX_SCALE = 1.5;

    let outValue = 0;

    function setWinUpTo() {
        const inValue = prizeData.prizeStructure[0];
        const inFormatted = SKBeInstant.formatCurrency(inValue).formattedAmount;
        const inString = resources.i18n.Game.winUpToText.replace('{0}', inFormatted);

        const outFormatted = SKBeInstant.formatCurrency(outValue).formattedAmount;
        const outString = resources.i18n.Game.winUpToText.replace('{0}', outFormatted);

        displayList.winUpToInTextLower.text = inString;
        displayList.winUpToInTextUpper.text = inString;
        displayList.winUpToOutTextLower.text = outString;
        displayList.winUpToOutTextUpper.text = outString;

        // If outValue is 0 winUpTo is not yet set, so display the in value and skip the timeline
        if (outValue === 0 || outValue === inValue) {
            outValue = inValue;
            displayList.winUpToOutTextLower.alpha = 0;
            displayList.winUpToOutTextUpper.alpha = 0;
            return;
        }

        const updateTimeline = new Timeline();
        const outScale = inValue > outValue ? MAX_SCALE : MIN_SCALE;
        const inScale = inValue > outValue ? MIN_SCALE : MAX_SCALE;

        // update outValue for next time
        outValue = inValue;

        updateTimeline.fromTo(
            displayList.winUpToIn,
            FADE_DURATION, {
                pixi: { scaleX: inScale, scaleY: inScale },
                alpha: 0,
            }, {
                pixi: { scaleX: 1, scaleY: 1 },
                alpha: 1,
            },
            0
        );

        updateTimeline.fromTo(
            displayList.winUpToOut,
            FADE_DURATION, {
                pixi: { scaleX: 1, scaleY: 1 },
                alpha: 1,
            }, {
                pixi: { scaleX: outScale, scaleY: outScale },
                alpha: 0,
            },
            0
        );
    }

    function switchToPicks() {
        updatePicks(8);
    }

    function updatePicks(inValue) {
        if (inValue === 0) {
            displayList.winUpToInTextLower.text = "";
            displayList.winUpToInTextUpper.text = "";
            displayList.winUpToOutTextLower.text = "";
            displayList.winUpToOutTextUpper.text = "";
            return;
        }
        const inString = resources.i18n.Game.picksLeft.replace('{0}', inValue);

        const outString = resources.i18n.Game.picksLeft.replace('{0}', outValue);

        displayList.winUpToInTextLower.text = inString;
        displayList.winUpToInTextUpper.text = inString;
        displayList.winUpToOutTextLower.text = outString;
        displayList.winUpToOutTextUpper.text = outString;

        const updateTimeline = new Timeline();
        const outScale = inValue > outValue ? MAX_SCALE : MIN_SCALE;
        const inScale = inValue > outValue ? MIN_SCALE : MAX_SCALE;

        // update outValue for next time
        outValue = inValue;

        updateTimeline.fromTo(
            displayList.winUpToIn,
            FADE_DURATION, {
                pixi: { scaleX: inScale, scaleY: inScale },
                alpha: 0,
            }, {
                pixi: { scaleX: 1, scaleY: 1 },
                alpha: 1,
            },
            0
        );

        updateTimeline.fromTo(
            displayList.winUpToOut,
            FADE_DURATION, {
                pixi: { scaleX: 1, scaleY: 1 },
                alpha: 1,
            }, {
                pixi: { scaleX: outScale, scaleY: outScale },
                alpha: 0,
            },
            0
        );
    }


    msgBus.subscribe('PrizeData.PrizeStructure', setWinUpTo);

    return {
        reset: setWinUpTo,
        switchToPicks,
        updatePicks,
    };
});