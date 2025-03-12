define(function (require) {
    const gameFlow = require('skbJet/componentManchester/standardIW/gameFlow');
    const revealAll = require('game/revealAll');
    const audio = require('skbJet/componentManchester/standardIW/audio');

    function error() {
        audio.disable();
        revealAll.stop();
    }

    gameFlow.handle(error, 'ERROR');
});
