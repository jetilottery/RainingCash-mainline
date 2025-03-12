define(require => {
  const msgBus = require('skbJet/component/gameMsgBus/GameMsgBus');

  const _state = {
    winning: [],
    player: [],
    WheelBonus : {
      launch : false,
      complete : false
    },
    CollectBonus : {
      launch : false,
      complete : false
    }
  };

  function reset() {
    _state.winning = [];
    _state.player = [];
    _state.WheelBonus = {
      launch : false,
      complete : false
    };
    _state.CollectBonus = {
      launch : false,
      complete : false
    };
  }

  function catchBonus(data){
    _state[data.symbol].launch = true;
    _state[data.symbol].complete = false;
  }

  msgBus.subscribe('Game.WinningPickPoint', number => _state.winning.push(number));
  msgBus.subscribe('Game.PlayerPickPoint', number => _state.player.push(number));
  msgBus.subscribe('Game.BonusSymFound', catchBonus);

  return {
    get winning() {
      return _state.winning;
    },
    get player() {
      return _state.player;
    },
    get WheelBonus(){
      return _state.WheelBonus;
    },
    get CollectBonus(){
      return _state.CollectBonus;
    },
    reset
  };
});