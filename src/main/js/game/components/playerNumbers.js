define(require => {
    const msgBus = require('skbJet/component/gameMsgBus/GameMsgBus');
    const displayList = require('skbJet/componentManchester/standardIW/displayList');
    const meterData = require('skbJet/componentManchester/standardIW/meterData');
    const gameConfig = require('skbJet/componentManchester/standardIW/gameConfig');
    const PlayerNumber = require('game/components/PlayerNumber');
    const numberState = require('game/state/numbers');
    const audio = require('skbJet/componentManchester/standardIW/audio');
    const idleState = require('game/state/idle');
    const autoPlay = require('skbJet/componentManchester/standardIW/autoPlay');
    const wheelBonus = require('game/components/bonus/wheelBonus');
    const prizeBonus = require('game/components/bonus/prizeBonus');

    require('com/gsap/TweenMax');
    const Tween = window.TweenMax;

    const instantWinCode = 'V';
    const instantWinDoubleCode = 'W';
    const instantWinFiveTimes = 'X';
    const instantWinTenTimes = 'Y';
    const bonusCodes = ['V', 'W', 'X', 'Y', 'WheelBonus', 'CollectBonus'];

    let gameBonusCards = [];
    let endGameBonusArray = [];
    let cards;
    let numbers;
    let cardRows;

    let playerNumberRollOutCheck;

    function init() {
        cards = [
            PlayerNumber.fromContainer(displayList.playerNumber1),
            PlayerNumber.fromContainer(displayList.playerNumber2),
            PlayerNumber.fromContainer(displayList.playerNumber3),
            PlayerNumber.fromContainer(displayList.playerNumber4),
            PlayerNumber.fromContainer(displayList.playerNumber5),
            PlayerNumber.fromContainer(displayList.playerNumber6),
            PlayerNumber.fromContainer(displayList.playerNumber7),
            PlayerNumber.fromContainer(displayList.playerNumber8),
            PlayerNumber.fromContainer(displayList.playerNumber9),
            PlayerNumber.fromContainer(displayList.playerNumber10),
            PlayerNumber.fromContainer(displayList.playerNumber11),
            PlayerNumber.fromContainer(displayList.playerNumber12),
            PlayerNumber.fromContainer(displayList.playerNumber13),
            PlayerNumber.fromContainer(displayList.playerNumber14),
            PlayerNumber.fromContainer(displayList.playerNumber15),
            PlayerNumber.fromContainer(displayList.playerNumber16),
            PlayerNumber.fromContainer(displayList.playerNumber17),
            PlayerNumber.fromContainer(displayList.playerNumber18),
            PlayerNumber.fromContainer(displayList.playerNumber19),
            PlayerNumber.fromContainer(displayList.playerNumber20),
            PlayerNumber.fromContainer(displayList.playerNumber21),
            PlayerNumber.fromContainer(displayList.playerNumber22),
            PlayerNumber.fromContainer(displayList.playerNumber23),
            PlayerNumber.fromContainer(displayList.playerNumber24),
            PlayerNumber.fromContainer(displayList.playerNumber25)
        ];

        cardRows = [
            [cards[0], cards[1], cards[2], cards[3], cards[4]],
            [cards[5], cards[6], cards[7], cards[8], cards[9]],
            [cards[10], cards[11], cards[12], cards[13], cards[14]],
            [cards[15], cards[16], cards[17], cards[18], cards[19]],
            [cards[20], cards[21], cards[22], cards[23], cards[24]]
        ];
    }

    function populate(data) {
        numbers = data;
    }

    function enable() {

        msgBus.subscribe('Game.AudioOn', restartAudio);

        // Return an array of promises for each card's lifecycle
        return cards.map(async card => {
            // Start idle animations
            msgBus.publish('Game.IdleAll');
            // Enable the card and wait for it to be revealed (manually or automatically)
            await card.enable();
            card.stackReset = false;
            // Mark as selected
            msgBus.publish('Game.PlayerPickPoint', card);
            msgBus.publish('Game.HideRevealAllIfAllRevealed');
            // Play the Player Number reveal audio
            if (autoPlay.enabled) { 
                //if (!audio.isPlaying('revealAllYourNumbers') ) {
                    //audio.play('revealAllYourNumbers');
                    audio.playSequential('revealAllYourNumbers');
                } //}
            else {
                audio.playSequential('playerNumber');
            }
            // Get the next Winning Number
            const nextData = numbers.shift();

            // check if we have already revealed a matching winning number, if so we need to do a gold reveal if not we do a siver anim
            if (!card.matched) {
                if (numberState.winning.includes(nextData[0])) {
                    card.populate(nextData, 'Gold');
                } else {
                    card.populate(nextData, 'Silver');
                }
            } else {
                card.populate(nextData, 'Silver');
            }

            // Populate the card with the next Player Number, ready to be uncovered
            // We've started to animate
            msgBus.publish('Game.PlayerAnimating', card);
            // Wait for the uncover animation (if animated)
            await card.uncover();
            // Finished animating
            msgBus.publish('Game.PlayerAnimated', card);
            // Reset Idle
            if (!bonusCodes.includes(nextData[0])) {
                // Only reset the idle animation when we have just uncovered a number
                msgBus.publish('Game.ResetIdle');
                // Player number revealed
                msgBus.publish('Game.PlayerNumber', nextData[0]);
            }

            // If the revealed number matches a revealed Winning Number then mark the match

            if (!card.matched) {

                if (numberState.winning.includes(nextData[0])) {
                    //then it's a number match, woo
                    if (!autoPlay.enabled) {
                        card.match();
                        audio.playSequential('numberMatch');
                        meterData.win += card.value;
                        await card.presentWin();
                    }

                } else if (nextData[0] === instantWinCode) {
                    card.presentInstantWin();
                    meterData.win += card.value;
                    msgBus.publish('Game.InstantWinFound');
                } else if (nextData[0] === instantWinDoubleCode) {
                    card.presentInstantWin();
                    meterData.win += card.value * 2;
                    msgBus.publish('Game.InstantWinFound');
                } else if (nextData[0] === instantWinFiveTimes) {
                    card.presentInstantWin();
                    meterData.win += card.value * 5;
                    msgBus.publish('Game.InstantWinFound');
                } else if (nextData[0] === instantWinTenTimes) {
                    card.presentInstantWin();
                    meterData.win += card.value * 10;
                    msgBus.publish('Game.InstantWinFound');
                } else if (nextData[0] === "WheelBonus") {

                    gameBonusCards.push(card);

                    if (!autoPlay.enabled) {
                        msgBus.publish('Game.DisablePicksForBonus');
                        msgBus.publish('Game.TransitionToBonus', {fromStage: "BaseGame", toStage: card.bonusName});
                        await wheelBonus.complete();
                        msgBus.publish('UI.updateButtons', {
                            help: {enabled: true},
                        });
                        let wheelBonusPrize = wheelBonus.getWinAndReset();
                        card.presentBonusWin(wheelBonusPrize);
                    } else {
                        msgBus.publish('Game.BonusSymFound', {symbol: card.bonusName, auto: false});
                        endGameBonusArray.push("WheelBonus");
                    }
                } else if (nextData[0] === "CollectBonus") {

                    gameBonusCards.push(card);

                    if (!autoPlay.enabled) {
                        msgBus.publish('Game.DisablePicksForBonus');
                        msgBus.publish('Game.TransitionToBonus', {fromStage: "BaseGame", toStage: card.bonusName});
                        await prizeBonus.complete();
                        msgBus.publish('UI.updateButtons', {
                            help: {enabled: true},
                        });
                        let prizeBonusPrize = prizeBonus.getWinAndReset();
                        card.presentBonusWin(prizeBonusPrize);
                    } else {
                        msgBus.publish('Game.BonusSymFound', {symbol: card.bonusName, auto: false});
                        endGameBonusArray.push("CollectBonus");
                    }
                }
            }
        });
    }

    function enableUnrevealed() {
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

    function revealAll() {
        // Stop Idle
        msgBus.publish('Game.StopIdle');
        // Get all the cards yet to be revealed
        const unrevealed = {
            total: cards.filter(number => !number.revealed),
            row1: cardRows[0].filter(number => !number.revealed),
            row2: cardRows[1].filter(number => !number.revealed),
            row3: cardRows[2].filter(number => !number.revealed),
            row4: cardRows[3].filter(number => !number.revealed),
            row5: cardRows[4].filter(number => !number.revealed)
        };
        // Return an array of tweens that calls reveal on each card in turn
        return unrevealed.total.map(number => Tween.delayedCall(addDelay(unrevealed, number), number.reveal, null, number));
    }

    function addDelay(data, number) {
        let delay = 0;
        let thisRow = 0;

        // Find the row number is on
        if (data.row1.indexOf(number) > -1) {
            thisRow = 1;
        } else if (data.row2.indexOf(number) > -1) {
            thisRow = 2;
        } else if (data.row3.indexOf(number) > -1) {
            thisRow = 3;
        } else if (data.row4.indexOf(number) > -1) {
            thisRow = 4;
        } else if (data.row5.indexOf(number) > -1) {
            thisRow = 5;
        }

        // We only need to add a delay to row 2 items if row 1 has unrevealed items in it
        if (thisRow > 1) {
            delay += data.row1.length > 0 ? gameConfig.autoPlayPlayerRowInterval : 0;
        }

        // Likewise, only add a delay to row 3 if row 2 has unrevealed items in it
        if (thisRow > 2) {
            delay += data.row2.length > 0 ? gameConfig.autoPlayPlayerRowInterval : 0;
        }

        if (thisRow > 3) {
            delay += data.row3.length > 0 ? gameConfig.autoPlayPlayerRowInterval : 0;
        }

        if (thisRow > 4) {
            delay += data.row4.length > 0 ? gameConfig.autoPlayPlayerRowInterval : 0;
        }

        return delay;
    }

    function reset() {
        msgBus.unsubscribe('Game.AudioOn', restartAudio);
        cards.forEach(number => number.reset());
        clearInterval(playerNumberRollOutCheck);
        playerNumberRollOutCheck = undefined;
        gameBonusCards = [];
        prizeBonus.reset();
        wheelBonus.reset();
        endGameBonusArray = [];
    }

    function checkMatch(data) {
        const matchedCards = cards.filter(card => card.revealed && !card.matched && card.number === data.winningNumber);
        //now run through the array and mark each one off
        for (let i = 0; i < matchedCards.length; i++) {
            if (!autoPlay.enabled || data.isRevealAll) {
                matchedCards[i].match();
                matchedCards[i].presentWin();
                meterData.win += matchedCards[i].value;
                // audio.playSequential('match');
            }
        }
    }

    function idleManager(data) {
        switch (data.state) {
            case 'IdleAll':
                Tween.killTweensOf(promptIdle);
                clearInterval(playerNumberRollOutCheck);
                playerNumberRollOutCheck = undefined;
                //set the idle animations going on all unrevealed
                Tween.delayedCall(gameConfig.delayBeforeStartIdleInSeconds, promptIdle);
                break;
            case 'ResetIdle':
                Tween.killTweensOf(promptIdle);
                clearInterval(playerNumberRollOutCheck);
                playerNumberRollOutCheck = undefined;
                //set the idle animations going on all unrevealed after a short delay
                Tween.delayedCall(gameConfig.delayBeforeResumeIdleInSeconds, promptIdle);


                break;
            case 'StopIdle':
                //stop the idle animations on all
                stopIdle();

                if (playerNumberRollOutCheck === undefined) {
                    playerNumberRollOutCheck = setInterval(() => {
                        let testArray = cards.filter(e => {
                            return e.interactionState === "ROLLOUT";
                        });

                        if (testArray.length === 0) {
                            return;
                        } else {
                            testArray.forEach(e => {
                                e.setSpineCoverState({state: 'ROLLOUT', loop: true});
                                msgBus.publish('Game.ResetIdle');
                            });
                        }
                    }, gameConfig.delayBeforeResumeIdleInSeconds * 1000);
                }


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

        for (let i = 0; i < unrevealed.length; i++) {
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

        for (let i = 0; i < unrevealed.length; i++) {
            unrevealed[i].stopIdle();
        }
    }

    function disablePicksForBonus() {
        stopIdle();
        cards.forEach(number => number.hold());
    }

    async function checkForBonuses() {
        return new Promise(async resolve => {
            if (!autoPlay.enabled) {
                resolve();
            }
            else {

                if (endGameBonusArray.length && endGameBonusArray.length > 1) {
                    // we have both bonuses
                    if (endGameBonusArray[0] === 'WheelBonus') {

                        // Do the intial transition to first bonus
                        msgBus.publish('Game.TransitionToBonus', {fromStage: "BaseGame", toStage: "WheelBonus"});
                        // wait for the wheel bonus to complete
                        await wheelBonus.complete();
                        // set the wheel bonus icon up to show the bonus prize
                        let wheelBonusPrize = wheelBonus.getWinAndReset();
                        cards.filter(e => {
                            return e.bonusName === 'WheelBonus';
                        }).forEach(e => {
                            e.presentBonusWin(wheelBonusPrize);
                        });
                        // wait for the prize bonus to finish
                        await prizeBonus.complete();
                        // then set the prize bonus icon prize amount
                        let prizeBonusPrize = prizeBonus.getWinAndReset();
                        cards.filter(e => {
                            return e.bonusName === 'CollectBonus';
                        }).forEach(e => {
                            e.presentBonusWin(prizeBonusPrize);
                        });

                    }
                    else {

                        // Same as above but with the Prize Bonus first
                        msgBus.publish('Game.TransitionToBonus', {fromStage: "BaseGame", toStage: "CollectBonus"});
                        await prizeBonus.complete();
                        let prizeBonusPrize = prizeBonus.getWinAndReset();
                        cards.filter(e => {
                            return e.bonusName === 'CollectBonus';
                        }).forEach(e => {
                            e.presentBonusWin(prizeBonusPrize);
                        });
                        await wheelBonus.complete();
                        let wheelBonusPrize = wheelBonus.getWinAndReset();
                        cards.filter(e => {
                            return e.bonusName === 'WheelBonus';
                        }).forEach(e => {
                            e.presentBonusWin(wheelBonusPrize);
                        });
                    }
                }
                else if (endGameBonusArray.length) {

                    // we only have 1 bonus, launch it
                    msgBus.publish('Game.TransitionToBonus', {fromStage: "BaseGame", toStage: endGameBonusArray[0]});

                    if (endGameBonusArray[0] === 'WheelBonus') {
                        await wheelBonus.complete();
                        let wheelBonusPrize = wheelBonus.getWinAndReset();
                        cards.filter(e => {
                            return e.bonusName === 'WheelBonus';
                        }).forEach(e => {
                            e.presentBonusWin(wheelBonusPrize);
                        });
                    }
                    if (endGameBonusArray[0] === 'CollectBonus') {
                        await prizeBonus.complete();
                        let prizeBonusPrize = prizeBonus.getWinAndReset();
                        cards.filter(e => {
                            return e.bonusName === 'CollectBonus';
                        }).forEach(e => {
                            e.presentBonusWin(prizeBonusPrize);
                        });
                    }
                }

                resolve();
            }

        });
    }

    function restartAudio() {
        audio.play("music", 0.5, true);
    }


    function onStateChange(data) {
        console.debug(data);
        if (data === 'WheelBonus' || data === 'CollectBonus') {
            msgBus.unsubscribe('Game.AudioOn', restartAudio);
            if (gameBonusCards.length) {
                gameBonusCards.forEach(card => card.stopBonusTrigger(data));
            }
        }
    }

    function onResultPlaque() {
        msgBus.unsubscribe('Game.AudioOn', restartAudio);
    }

    msgBus.subscribe('Game.WinningNumber', num => checkMatch({winningNumber: num, isRevealAll: false}));
    msgBus.subscribe('Game.RevealAllWinningNumber', num => checkMatch({winningNumber: num, isRevealAll: true}));
    msgBus.subscribe('Game.IdleAll', () => idleManager({state: 'IdleAll'}));
    msgBus.subscribe('Game.StopIdle', () => idleManager({state: 'StopIdle'}));
    msgBus.subscribe('Game.ResetIdle', () => idleManager({state: 'ResetIdle'}));
    msgBus.subscribe('Game.DisablePicksForBonus', disablePicksForBonus);
    msgBus.subscribe('Game.EnablePicksFromBonus', enableUnrevealed);
    msgBus.subscribe('Game.StateChanged', onStateChange);

    return {
        init,
        populate,
        enable,
        revealAll,
        checkForBonuses,
        reset,
        onResultPlaque
    };
});
