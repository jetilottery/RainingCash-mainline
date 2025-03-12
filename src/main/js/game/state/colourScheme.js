define(require => {
  const msgBus = require('skbJet/component/gameMsgBus/GameMsgBus');

  const _state = {
    colour: null
  };

  function reset() {
    _state.colour = null;
  }

  msgBus.subscribe('Game.SetColourScheme', data => _state.colour = data.colour);

  return {
    get colour() {
      return _state.colour;
    },
    reset
  };
});