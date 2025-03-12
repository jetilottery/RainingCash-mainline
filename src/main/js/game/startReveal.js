define(function(require) {
  const msgBus = require('skbJet/component/gameMsgBus/GameMsgBus');
  const gameFlow = require('skbJet/componentManchester/standardIW/gameFlow');
  const winningNumbers = require('game/components/winningNumbers');
  const playerNumbers = require('game/components/playerNumbers');
  const revealAll = require('game/revealAll');

  async function startReveal() { 

    msgBus.publish('UI.updateButtons', {
        autoPlay: false,
        help: {enabled: false}
    });

    // Listen for autoplay activation which triggers the remaining cards to reveal automatically
    msgBus.subscribe('Game.AutoPlayStart', revealAll.start);

    // Listen for autoplay deactivation which cancels the revealAll timeline
    msgBus.subscribe('Game.AutoPlayStop', revealAll.stop);

    await Promise.all([...winningNumbers.enable()]);
    msgBus.publish('UI.updateButtons', {
        autoPlay: true,
        help: {enabled: true}
    });

    // Enable all of the winning and player numbers, wait until they are all revealed
    await Promise.all([
      ...playerNumbers.enable()
    ]);

    await playerNumbers.checkForBonuses();

    // Process any wins found during Reveal All
    await winningNumbers.processPending();

    gameFlow.next('REVEAL_COMPLETE');
  }

  gameFlow.handle(startReveal, 'START_REVEAL');
});
