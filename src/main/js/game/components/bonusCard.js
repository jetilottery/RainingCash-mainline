define(require => {
  const displayList = require('skbJet/componentManchester/standardIW/displayList');
  const msgBus = require('skbJet/component/gameMsgBus/GameMsgBus');
  const resLib = require('skbJet/component/resourceLoader/resourceLib');
  const PIXI = require('com/pixijs/pixi');
  const Tween = window.TweenMax;

  require('com/gsap/TweenMax');

  let symbolsFound = [];

  let wheelBonusSpine;
  let prizeBonusSpine;
  let instantWinSpine;

  function init() {
    // set up the graphics

    wheelBonusSpine = new PIXI.spine.Spine(resLib.spine['BonusTriggers'].spineData);
    wheelBonusSpine.state.setAnimation(0,'INFO_WheelIconSTATIC', false);
    displayList.icon_wheelBonusGraphic.addChild(wheelBonusSpine);

    prizeBonusSpine = new PIXI.spine.Spine(resLib.spine['BonusTriggers'].spineData);
    prizeBonusSpine.state.setAnimation(0,'INFO_PrizeIconSTATIC', false);
    displayList.icon_prizeBonusGraphic.addChild(prizeBonusSpine);

    instantWinSpine = new PIXI.spine.Spine(resLib.spine['BonusTriggers'].spineData);
    instantWinSpine.state.setAnimation(0,'INFO_InstantWinSTATIC', false);
    displayList.icon_instantWinGraphic.addChild(instantWinSpine);

    displayList.icon_instantWinText.text = resLib.i18n.game.Game.bonusCard.InstantWin;
    displayList.icon_wheelBonusText.text = resLib.i18n.game.Game.bonusCard.WheelBonus;
    displayList.icon_prizeBonusText.text = resLib.i18n.game.Game.bonusCard.CollectBonus;

    wheelBonusSpine.stateData.setMix('INFO_WheelIconSTATIC', 'WheelIconIDLE', true, 0.5);
    prizeBonusSpine.stateData.setMix('INFO_PrizeIconSTATIC', 'PrizeIconIDLE', true, 0.5);
    instantWinSpine.stateData.setMix('INFO_InstantWinSTATIC', 'InstantWinIDLE', true, 0.5);
  }

  function reset() {
    symbolsFound = [];
    prizeBonusSpine.state.setAnimation(0,'INFO_PrizeIconSTATIC', false);
    wheelBonusSpine.state.setAnimation(0,'INFO_WheelIconSTATIC', false);
    instantWinSpine.state.setAnimation(0,'INFO_InstantWinSTATIC', false);
  }

  function bonusCollectManager(data){
    symbolsFound = [];
    symbolsFound.push(data.symbol);
    triggerRevealAllBonusIcons();
  }

  function triggerRevealAllBonusIcons(){
    if(symbolsFound.includes('WheelBonus')){
      // wheelBonusSpine.state.setAnimation(0, 'INFO_WheelIconREVEAL', false);
      Tween.delayedCall(0.2,()=>{
        wheelBonusSpine.state.addAnimation(0, 'WheelIconIDLE', true, 0);
      });

    }
    if(symbolsFound.includes('CollectBonus')){
      // prizeBonusSpine.state.setAnimation(0, 'INFO_PrizeIconREVEAL', false);
      Tween.delayedCall(0.2,()=>{
        prizeBonusSpine.state.addAnimation(0, 'PrizeIconIDLE', true, 0);
      });

    }
  }

  function instantWinFound() {
    if(instantWinSpine.state.tracks[0].animation.name !== 'InstantWinIDLE') {
      Tween.delayedCall(0.2,()=>{
        instantWinSpine.state.addAnimation(0, 'InstantWinIDLE', true, 0);
      });
    }
  }


  msgBus.subscribe('Game.BonusSymFound', bonusCollectManager);
  msgBus.subscribe('Game.TriggerRevealAllBonusIcons', triggerRevealAllBonusIcons);
  msgBus.subscribe('Game.InstantWinFound',instantWinFound);
  //msgBus.subscribe('Game.StopBonusCardIcon', stopBonusIconAnimation);

  return {
    init,
    reset
  };
});