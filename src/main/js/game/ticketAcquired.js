define((require) => {
  const scenarioData = require('skbJet/componentManchester/standardIW/scenarioData');
  const gameFlow = require('skbJet/componentManchester/standardIW/gameFlow');
  const audio = require('skbJet/componentManchester/standardIW/audio');
  const gameConfig = require('skbJet/componentManchester/standardIW/gameConfig');
  const winningNumbers = require('game/components/winningNumbers');
  const playerNumbers = require('game/components/playerNumbers');
  const wheelBonus = require('game/components/bonus/wheelBonus');
  const pickerBonus = require('game/components/bonus/prizeBonus');

  function ticketAcquired() {
    winningNumbers.populate(scenarioData.scenario.winningNumbers);
    playerNumbers.populate(scenarioData.scenario.playerNumbers);
    wheelBonus.populate(scenarioData.scenario.bonusData);
    pickerBonus.populate(scenarioData.scenario.bonusData.prizeBonusAwards);
    
    if (gameConfig.backgroundMusicEnabled) {
      audio.play('music',true);
    }

    gameFlow.next('START_REVEAL');
  }

  gameFlow.handle(ticketAcquired, 'TICKET_ACQUIRED');
});