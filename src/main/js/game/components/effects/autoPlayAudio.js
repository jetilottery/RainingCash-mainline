define(require => {
    const msgBus = require('skbJet/component/gameMsgBus/GameMsgBus');
    const audio = require('skbJet/componentManchester/standardIW/audio');
    const utils = require('game/components/utils/utils');
    const scenarioData = require('skbJet/componentManchester/standardIW/scenarioData');
    const gameConfig = require('skbJet/componentManchester/standardIW/gameConfig');

    require('com/gsap/TweenMax');
    const Tween = window.TweenMax;

    let active = false;
    let currentGameState = 'BASE_GAME';

    function init(){
      console.log('init');
    }

    function autoPlayManager(inVal){
      utils.log('autoPlayManager: '+inVal);
      active = inVal;
      if (active && canPlayNext()){
        //start playing music
        // doNext();
      }     
    }

    function canPlayNext(){
      let outVal = true;
      let allRevealed = scenarioData.scenario.winningNumbers.length === 0 && scenarioData.scenario.playerNumbers.length === 0;
      if (!canPlayNext || allRevealed || currentGameState !== 'BASE_GAME'){
        outVal = false;
      }
      return outVal;
    }

    function queueNext(inDelay){
      let delay = inDelay || gameConfig.autoPlayAudioInterval;
      if (canPlayNext()){
        Tween.delayedCall(delay, doNext);
      }      
    }

    function doNext(){
      //if we have at least one winning number to reveal, play a winning number reveal sound
      let outDelay = 0;
      if (scenarioData.scenario.winningNumbers.length > 0){
        audio.playSequential('winningNumber');
        outDelay = gameConfig.autoPlayPlayerNumberDelay;
      }else{
        audio.playSequential('playerNumber');
      }      
      queueNext(outDelay);      
    }

    // Listen for autoplay activation
    msgBus.subscribe('Game.AutoPlayStart', () => autoPlayManager(true));

    // Listen for autoplay deactivation
    msgBus.subscribe('Game.AutoPlayStop', () => autoPlayManager(false));

    // Listen for change of game state
    msgBus.subscribe('Game.StateChanged', data => currentGameState = data);

    return {
      init
    };
});