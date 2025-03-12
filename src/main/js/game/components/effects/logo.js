define(require => {
    const msgBus = require('skbJet/component/gameMsgBus/GameMsgBus');
    const displayList = require('skbJet/componentManchester/standardIW/displayList');
    const orientation = require('skbJet/componentManchester/standardIW/orientation');

    function init() {
        msgBus.subscribe('GameSize.OrientationChange', onOrientationChange);
        onOrientationChange();
    }

    function adjustWinUpto(combinedMaxWidth) {

        let text = displayList.winUpToInText;
        let value = displayList.winUpToInValue;

        let text2 = displayList.winUpToOutText;
        let value2 = displayList.winUpToOutValue;

        if (combinedMaxWidth && orientation.get() === orientation.PORTRAIT) {

            text.y = text2.y = 50;
            value.y = value2.y = 50;

            text.anchor.x = text2.anchor.x = 0;
            value.anchor.x = value2.anchor.x = 0;

            value.x = text.width + 10;
            value2.x = text2.width + 10;

            displayList.winUpToIn.pivot.x = (text.width + value.width) / 2;
            displayList.winUpToOut.pivot.x = (text.width + value.width) / 2;
        } else {
            text.y = text2.y = 0;
            value.y = value2.y = 50;

            text.anchor.x = text2.anchor.x = 0.5;
            value.anchor.x = value2.anchor.x = 0.5;

            value.x = 0;
            value2.x = 0;

            displayList.winUpToIn.pivot.x = 0;
            displayList.winUpToOut.pivot.x = 0;
        }

    }

    function onOrientationChange() {
        adjustWinUpto(true);
    }

    return {
        init
    };
});



