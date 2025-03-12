define(require => {
    const msgBus = require('skbJet/component/gameMsgBus/GameMsgBus');
    const displayList = require('skbJet/componentManchester/standardIW/displayList');
    const audio = require('skbJet/componentManchester/standardIW/audio');
    const autoPlay = require('skbJet/componentManchester/standardIW/autoPlay');
    const WinningNumber = require('game/components/WinningNumber');
    const numberState = require('game/state/numbers');
    const idleState = require('game/state/idle');
    const gameConfig = require('skbJet/componentManchester/standardIW/gameConfig');

    require('com/gsap/TweenMax');
    const Tween = window.TweenMax;

    let cards;
    let numbers;
    let autoWinsProcessed;

    function init() {
        cards = [
            WinningNumber.fromContainer(displayList.winningNumber1, 1),
            WinningNumber.fromContainer(displayList.winningNumber2, 2),
            WinningNumber.fromContainer(displayList.winningNumber3, 3),
            WinningNumber.fromContainer(displayList.winningNumber4, 4),
            WinningNumber.fromContainer(displayList.winningNumber5, 5)
        ];
    }

    function populate(data) {
        numbers = data;
    }

    function enable() {
        // Return an array of promises for each card's lifecycle

        if (gameConfig.forcedLuckyNumberReveal === true) {
            Tween.delayedCall(1, () => {
                msgBus.publish('Game.IdleAll');
                msgBus.publish('Game.ResetIdle');
            });
        }

        return cards.map(async card => {
            // Start idle animations
            if (gameConfig.forcedLuckyNumberReveal === false || gameConfig.forcedLuckyNumberReveal === undefined) {
                msgBus.publish('Game.IdleAll');
            }

            // Enable the card and wait for it to be revealed (manually or automatically)
            await card.enable();

            // Mark as selected
            msgBus.publish('Game.WinningPickPoint', card);
            msgBus.publish('Game.HideRevealAllIfAllRevealed');
            // Play the Winning Number reveal audio
            audio.playSequential('winningNumber');
            // Get the next Winning Number
            const nextNumber = numbers.shift();
            // Populate the card with the next Winning Number, ready to be uncovered
            card.populate(nextNumber);
            // We've started to animate
            msgBus.publish('Game.WinningAnimating', card);
            // Wait for the uncover animation (if animated)
            await card.uncover();
            // Finished animating
            msgBus.publish('Game.WinningAnimated', card);
            // Reset Idle
            if (gameConfig.forcedLuckyNumberReveal === false || gameConfig.forcedLuckyNumberReveal === undefined) {
                msgBus.publish('Game.ResetIdle');
            }

            msgBus.publish('Game.WinningNumber', nextNumber);
        });
    }

    function revealAll() {
        // Stop Idle
        msgBus.publish('Game.StopIdle');
        // Get all the cards yet to be revealed
        const unrevealed = cards.filter(number => !number.revealed);
        // Return an array of tweens that calls reveal on each card in turn
        return unrevealed.map((number) => Tween.delayedCall(0, number.reveal, null, number));
    }

    function reset() {
        cards.forEach(number => number.reset());
        autoWinsProcessed = undefined;
    }

    function checkMatch(playerNumber) {
        const matchedCard = cards.find(card => card.number === playerNumber);
        if (matchedCard) {
            if (!autoPlay.enabled) {
                matchedCard.match();
                matchedCard.presentWin(false);
            }
        }
    }

    function idleManager(data) {
        switch (data.state) {
            case 'IdleAll':
                Tween.killTweensOf(promptIdle);
                //set the idle animations going on all unrevealed
                Tween.delayedCall(gameConfig.delayBeforeStartIdleInSeconds, promptIdle);
                break;
            case 'ResetIdle':
                Tween.killTweensOf(promptIdle);
                //set the idle animations going on all unrevealed after a short delay
                Tween.delayedCall(gameConfig.delayBeforeResumeIdleInSeconds, promptIdle);
                break;
            case 'StopIdle':
                //stop the idle animations on all
                stopIdle();
                break;
        }
    }

    function promptIdle() {
        Tween.killTweensOf(promptIdle);
        // Check if there are any remaining unrevealed cards
        const unrevealed = cards.filter(number => !number.revealed);
        if (unrevealed.length === 0 || idleState.winning.length !== 0 || idleState.player.length !== 0 || idleState.winningOver.length !== 0 || idleState.playerOver.length !== 0) {
            return;
        }

        for (var i = 0; i < unrevealed.length; i++) {
            unrevealed[i].prompt();
        }
    }

    function stopIdle() {
        Tween.killTweensOf(promptIdle);
        // Check if there are any remaining unrevealed cards
        const unrevealed = cards.filter(number => !number.revealed);
        if (unrevealed.length === 0) {
            return;
        }

        for (var i = 0; i < unrevealed.length; i++) {
            unrevealed[i].stopIdle();
        }
    }

    /**
     * Fulfil promise
     */
    function processComplete() {
        if (autoWinsProcessed) {
            autoWinsProcessed();
        }
    }

    function processWins() {
        // Find the winning numbers that have matches in the player numbers
        const validNums = numberState.winning.filter((item) => {
            return numberState.player.includes(item);
        });

        // If none of the winning numbers have matches, we don't need to go any further
        if (validNums.length < 1) {
            processComplete();
            return;
        }

        // Right, let's run through the winning numbers and dispatch an event
        for (let i = 0; i < validNums.length; i++) {
            Tween.delayedCall((gameConfig.revealAllProcessInterval * i), function () {
                // Find the winning card associated with this number
                const matchedCard = cards.find(card => card.number === validNums[i] && numberState.player.includes(card.number));
                if (matchedCard) {
                    matchedCard.match();
                    matchedCard.presentWin(false);
                }
                // Run through matchedCards and see if we need to present win on this one
                msgBus.publish('Game.RevealAllWinningNumber', validNums[i]);
                // If this is the last one, we can fulfil the promise
                if (i === validNums.length - 1) {
                    Tween.delayedCall(gameConfig.revealAllProcessInterval, processComplete);
                }
            });
        }
    }

    function disablePicksForBonus() {
        stopIdle();
        cards.forEach(number => number.hold());
    }

    function enableUnrevealed() {

        autoPlay._enabled = false;

        cards.filter(e => {
            return e.revealed === false;
        }).forEach(e => {
            e.enabled = true;
        });

        if (cards.filter(e => {
            return e.revealed === false;
        }).length !== 0) {
            autoPlay._enabled = false;

            msgBus.publish('UI.updateButtons', {
                autoPlay: true,
            });
            displayList.autoPlayStartButton.enabled = true;
        }

    }

    async function processPending() {
        // Set up a promise
        await new Promise(c => {
            autoWinsProcessed = c;
            processWins();
        });
    }

    msgBus.subscribe('Game.PlayerNumber', checkMatch);

    msgBus.subscribe('Game.IdleAll', () => idleManager({state: 'IdleAll'}));
    msgBus.subscribe('Game.StopIdle', () => idleManager({state: 'StopIdle'}));
    msgBus.subscribe('Game.ResetIdle', () => idleManager({state: 'ResetIdle'}));

    msgBus.subscribe('Game.DisablePicksForBonus', disablePicksForBonus);
    msgBus.subscribe('Game.EnablePicksFromBonus', enableUnrevealed);

    return {
        init,
        populate,
        enable,
        revealAll,
        processPending,
        reset,
    };
});
