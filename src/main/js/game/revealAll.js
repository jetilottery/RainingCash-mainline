define(require => {
  const Timeline = require('com/gsap/TimelineLite');
  const gameConfig = require('skbJet/componentManchester/standardIW/gameConfig');
  const displayList = require('skbJet/componentManchester/standardIW/displayList');
  const collectBonus = require('game/components/bonus/prizeBonus');
  const winningNumbers = require('game/components/winningNumbers');
  const playerNumbers = require('game/components/playerNumbers');
  const msgBus = require('skbJet/component/gameMsgBus/GameMsgBus');
  const animState = require('game/state/anim');

  let revealAllTimeline;
  let currentGameState = 'BASE_GAME';
  let numberOfWinningNumbers = 5;
  let numberOfPlayerNumbers = 25;

  function start() {
    // TMP012-81 - TMP012: There isn’t toggleable “Start/Stop” autoplay button when setting the custom parameter “toggleAutoPlay” to true.
    // Hide the Reveal All button if toggleAutoPlay = false
    if (!gameConfig.toggleAutoPlay){
      msgBus.publish('UI.updateButtons', {autoPlay: false});
    }    
    
    if (currentGameState === 'BASE_GAME'){

      revealAllTimeline = new Timeline();

        // Start with the winning numbers
        if(!gameConfig.forcedLuckyNumberReveal){
          const revealWinning = winningNumbers.revealAll();
          revealAllTimeline.add(
             new Timeline({ tweens: revealWinning, stagger: gameConfig.autoPlayWinningNumberInterval })
          );
        }

        const revealPlayer = playerNumbers.revealAll();

        // disable all interaction at the parent container level
        displayList.playerNumbers.interactiveChildren = false;
        displayList.winningNumbers.interactiveChildren = false;

        // Then the player numbers, with a delay between the winning and player numbers
        revealAllTimeline.add(
            new Timeline({ tweens: revealPlayer, stagger: gameConfig.autoPlayPlayerNumberInterval }),
            revealPlayer.length > 0
                ? `+=${gameConfig.autoPlayPlayerNumberDelay}`
                : '+=0'
        );
        return revealAllTimeline;

    }

    if(currentGameState === "CollectBonus") {

        const collectBonusTweens = collectBonus.revealAll();

        revealAllTimeline = new Timeline();

        revealAllTimeline.add(
            new Timeline({ tweens: collectBonusTweens, stagger: gameConfig.autoPlayCollectBonusReveal })
        );
        return revealAllTimeline;
    }

  }

  function stop() {
    // re-enable all interaction at the parent container level
    displayList.playerNumbers.interactiveChildren = true;
    displayList.winningNumbers.interactiveChildren = true;
    // kill the revealAll timeline if active
    if (revealAllTimeline) {
      revealAllTimeline.kill();
      revealAllTimeline = undefined;
    }
  }


  function hideRevealAllOnAllRevealed(){
    // Check to see if we have revealed all winning and all player numbers
    if (animState.winning.length === numberOfWinningNumbers && animState.player.length === numberOfPlayerNumbers){
      // Hide the Reveal All button
      msgBus.publish('UI.updateButtons', {
        autoPlay: false,
        help: { enabled: false },
      });
    }
  }

  msgBus.subscribe('Game.StateChanged', data => currentGameState = data);
  msgBus.subscribe('Game.HideRevealAllIfAllRevealed', hideRevealAllOnAllRevealed);

  return {
    start,
    stop,
  };
});
