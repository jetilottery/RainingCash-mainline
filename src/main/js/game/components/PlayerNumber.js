define(require => {
    const PIXI = require('com/pixijs/pixi');
    const SKBeInstant = require('skbJet/component/SKBeInstant/SKBeInstant');
    const FittedText = require('skbJet/componentManchester/standardIW/components/fittedText');
    const textStyles = require('skbJet/componentManchester/standardIW/textStyles');
    const msgBus = require('skbJet/component/gameMsgBus/GameMsgBus');
    const resLib = require('skbJet/component/resourceLoader/resourceLib');
    const utils = require('game/components/utils/utils');
    const NumberCard = require('./NumberCard');
    const gameConfig = require('skbJet/componentManchester/standardIW/gameConfig');
    const autoPlay = require('skbJet/componentManchester/standardIW/autoPlay');
    const audio = require('skbJet/componentManchester/standardIW/audio');

    const WIDTH = 100;
    const HEIGHT = 95;
    const MAX_VALUE_WIDTH = 120;
    const TEXT_Y_POS = 23;
    const TEXT_Y_POS_MOBILE = 23;
    const RESULT_NUMBER_OFFSET = -12;
    const RESULT_NUMBER_OFFSET_GOLD = -15;
    const RESULT_NUMBER_OFFSET_GOLD_SWITCH = -15;
    const DELAY_BEFORE_NUMBER_SHOWN = 0.35;
    const BONUS_SYMBOLS = ['WheelBonus', 'CollectBonus'];
    const SPINE_NAME_LOOKUP = {
        'Gold': {
            'skinPrefix': 'GOLD/GF',
            'animationPrefix': 'Gold',
        },
        'Silver': {
            'skinPrefix': 'GOLD/GF',     //TODO: fix naming in .skel file
            'animationPrefix': 'Silver',
        }
    };

    require('com/gsap/TweenMax');
    require('com/gsap/TimelineLite');
    const Tween = window.TweenMax;
    const TimelineLite = window.TimelineLite;

    class PlayerNumber extends NumberCard {
        constructor() {
            super(WIDTH, HEIGHT);
            this.isBonus = false;
            this.bonusName = null;
            this.resultChangeAnim = null;
            this.defaultState = 'YourSTATIC';
            this.revealState = 'silver';
            this.pickPointType = 'Your';
            this.initSpine();
            this.assetNumber = null;
            this.number = null;
            this.value = null;
            this.winText = new PIXI.Sprite();
            this.firstPlay = 0;

            this.valueTexts = [
                new FittedText(''),
                new FittedText('')    
            ];

            this.valueTexts.forEach(function(valueText){
                valueText.anchor.set(0.5);
                valueText.y = SKBeInstant.config.assetPack === 'mobile' ? TEXT_Y_POS_MOBILE : TEXT_Y_POS;
                valueText.maxWidth = MAX_VALUE_WIDTH;
            });

            this.winText.addChild(this.valueTexts[0], this.valueTexts[1]);
            this.addChild(this.winText);
            
            this.winAnim = new PIXI.spine.Spine(resLib.spine['GoldNumbers'].spineData);
            this.winAnim.state.addAnimation(0, 'GoldMATCHED_IDLE', true, 0);
            this.winAnim.y = RESULT_NUMBER_OFFSET_GOLD;
            this.addChildAt(this.winAnim, 0);

            this.reset();
        }

        initSpine() {
            const _this = this;
            this.coverAnim = new PIXI.spine.Spine(resLib.spine['CoverAnims'].spineData);
            this.setSpineCoverState({state: 'DEFAULT', loop: false});
            this.coverContainer.addChild(_this.coverAnim);
            this.coverAnim.stateData.setMix('YourIDLE', 'YourSTATIC', 0.2);
            this.coverAnim.stateData.setMix('YourSTATIC', 'YourIDLE', 0.2);
            this.coverAnim.stateData.setMix('YourIDLE', 'YourMOUSEOVER', 0.2);
            this.coverAnim.stateData.setMix('YourMOUSEOVER', 'YourIDLE', 0.2);
            this.coverAnim.stateData.setMix('YourMOUSEOVER', 'YourMOUSEOUT', 0.3);
            this.coverAnim.stateData.setMix('YourMOUSEOUT', 'YourMOUSEOVER', 0.3);
        }

        setSpineCoverState(data) {
            let nextState;
            let doLoop = data.loop || false;
            let syncTime = data.sync || 0;

            switch (data.state) {
                case 'DEFAULT':
                    nextState = 'YourSTATIC';
                    break;
                case 'IDLE':
                    nextState = 'YourIDLE';
                    break;
                case 'REVEAL':
                    nextState = 'YourREVEAL';
                    break;
                case 'ROLLOVER':
                    nextState = 'YourSTATIC';
                    break;
                case 'ROLLOUT':
                    nextState = 'YourSTATIC';
                    break;
                case 'OFF':
                    nextState = this.defaultState;
                    break;
                default:
                    nextState = this.defaultState;
                    break;
            }

            // If we're already in a rollout state, we don't want to be forcing the state back to default
            // as this would interrupt the rollout animation, so if we're going back to default, don't do anything
            if (this.interactionState === 'ROLLOUT' && nextState === this.defaultState) {
                return;
            }

            // Store the interaction state
            this.interactionState = data.state;
            utils.log('Changing Player Number spine state to: ' + nextState);
            this.coverAnim.renderable = data.state !== 'OFF';
            this.coverAnim.state.setAnimation(syncTime, nextState, doLoop);

            let globalScope = this;
            if (data.state === 'REVEAL') {
                Tween.delayedCall(DELAY_BEFORE_NUMBER_SHOWN, function startResultAnimation() {
                    globalScope.setSpineResultState();
                });
            }

        }

        presentWin() {

            if (this.revealState === 'Gold') {
                // gold number is revealed from behind the cover
                this.resultAnim.y = RESULT_NUMBER_OFFSET_GOLD;
                Tween.delayedCall(0.25, () => {
                    this.resultAnim.state.setAnimation(0, 'GoldMATCHED', false);
                    //this.resultAnim.state.addAnimation(0, 'GoldMATCHED_IDLE', true, 0);
                    Tween.delayedCall(0.5, () => { 
                        this.resultAnim.renderable = false;
                        this.winAnim.renderable = true; 
                    } );
                });

            } else {
                let _globalScope = this;
                // silver number is already visible and a lucky number has matched
                // animate away the silver and animate in the new gold, change text style from lose to win
                this.resultChangeAnim = new PIXI.spine.Spine(resLib.spine['GoldNumbers'].spineData);
                this.resultChangeAnim.y = RESULT_NUMBER_OFFSET_GOLD_SWITCH;
                this.resultChangeAnim.renderable = false;
                this.resultContainer.addChild(this.resultChangeAnim);
                this.resultAnim.state.setAnimation(0, 'SilverMATCHED', false); 
                // animate the gold number in
                Tween.delayedCall(0.35, function showRevealedGoldNumberFromSilver() {
                    _globalScope.resultChangeAnim.renderable = true;
                    _globalScope.valueTexts.forEach(function(valueText,index) {
                        var textStyle = !index ? 'prizeValueWin' : 'prizeValueWinGradient';
                        valueText.style = textStyles.parse(textStyle);
                    });
                    //_globalScope.resultChangeAnim.skeleton.setSkin(null);
                    //_globalScope.resultChangeAnim.skeleton.setSkinByName('GOLD/GF' + _globalScope.assetNumber);
                    this.winAnim.skeleton.setSkin(null);
                    this.winAnim.skeleton.setSkinByName('GOLD/GF' + _globalScope.assetNumber);
                    _globalScope.resultChangeAnim.state.setAnimation(0, 'GoldREVEAL', false);
                    _globalScope.resultChangeAnim.state.addAnimation(0, 'GoldMATCHED', false, 0);
                    Tween.delayedCall(0.5, () => { 
                        this.resultAnim.renderable = false;
                        this.winAnim.renderable = true; 
                    } );
                    //_globalScope.resultChangeAnim.state.addAnimation(0, 'GoldMATCHED_IDLE', true, 0);
                    msgBus.publish('Game.PlayerNumber');
                });
            }
        }

        presentInstantWin() {
            const _this = this;
            this.valueTexts.forEach(function(valueText, index){
                var textStyle = !index ? 'prizeValueWin' : 'prizeValueWinGradient';
                valueText.style = textStyles.parse(textStyle);
                valueText.text = SKBeInstant.formatCurrency(_this.value).formattedAmount;
            });
            
        }

        presentBonusWin(value) {
            this.valueTexts.forEach(function(valueText, index){
                var textStyle = !index ? 'prizeValueWin' : 'prizeValueWinGradient';
                valueText.style = textStyles.parse(textStyle);
                valueText.text = value;
            });            
        }

        setSpineResultState() {
            this.resultAnim.y = 0;
            this.resultAnim.state.timeScale = 1;
            this.resultAnim.renderable = false;
            this.resultAnim.alpha = 1;
            this.resultAnim.scale.set(0.9);

            if (BONUS_SYMBOLS.includes(this.revealState)) {
                if (this.revealState === 'WheelBonus') {

                    this.resultAnim.scale.set(1.1);
                    this.resultAnim.y = -6;
                    
                    Tween.delayedCall(0.25, () => {
                        audio.play('wheelBonusRevealed');
                    });

                    this.resultAnim.state.setAnimation(0, 'WheelIconREVEAL', false);
                    this.resultAnim.state.addAnimation(0, 'WheelIconIDLE', true, 0);
                } else if (this.revealState === 'CollectBonus') {
                    Tween.delayedCall(0.25, () => {
                        audio.play('prizeBonusRevealed');
                    });

                    this.resultAnim.state.setAnimation(0, 'PrizeIconREVEAL', false);
                    this.resultAnim.state.addAnimation(0, 'PrizeIconIDLE', true, 0);
                }
            } else {
                this.resultAnim.y = -15;
                if (this.revealState === 'V') {
                    audio.play('instantWin');
                    this.resultAnim.state.setAnimation(0, 'InstantWinREVEAL', false);
                    this.resultAnim.state.addAnimation(0, 'InstantWinIDLE', true, 0);
                } else if (this.revealState === "W") {
                    audio.play('instantWin2X');
                    this.resultAnim.state.setAnimation(0, 'InstantWin2xREVEAL', false);
                    this.resultAnim.state.addAnimation(0, 'InstantWin2xIDLE', true, 0);
                } else if (this.revealState === "X") {
                    audio.play('instantWin2X');
                    this.resultAnim.state.setAnimation(0, 'InstantWin5xREVEAL', false);
                    this.resultAnim.state.addAnimation(0, 'InstantWin5xIDLE', true, 0);
                } else if (this.revealState === "Y") {
                    audio.play('instantWin2X');
                    this.resultAnim.state.setAnimation(0, 'InstantWin10xREVEAL', false);
                    this.resultAnim.state.addAnimation(0, 'InstantWin10xIDLE', true, 0);
                } else {
                    this.resultAnim.skeleton.setSkin(null);
                    this.resultAnim.skeleton.setSkinByName(SPINE_NAME_LOOKUP[this.revealState].skinPrefix + this.assetNumber);
                    this.winAnim.skeleton.setSkin(null);
                    this.winAnim.skeleton.setSkinByName(SPINE_NAME_LOOKUP[this.revealState].skinPrefix + this.assetNumber);

                    this.resultAnim.state.setAnimation(0, SPINE_NAME_LOOKUP[this.revealState].animationPrefix + 'REVEAL', false);
                    this.resultAnim.state.addAnimation(0, SPINE_NAME_LOOKUP[this.revealState].animationPrefix + 'IDLE', true, 0);
                    Tween.to(this.valueTexts[0], 0.2, {alpha: 1});
                    Tween.to(this.valueTexts[1], 0.2, {alpha: 1});
                }
            }
            Tween.delayedCall(0.1, () => {
                this.resultAnim.renderable = true;
            });
        }

        triggerManualPlayBonus(bonusName) {
            // turns off the UI and notifies the bonus card area to play the matching bonus icon animation
            msgBus.publish('UI.updateButtons', {
                autoPlay: false,
                home: false,
                help: {enabled: false}
            });

            msgBus.publish('Game.BonusSymFound', {
                symbol: bonusName,
                auto: autoPlay.enabled
            });
        }

        populate([numberOrSymbol, value], goldOrSilver) {

            this.value = value;
            this.revealState = isNaN(numberOrSymbol) ? numberOrSymbol : goldOrSilver;
            super.populate(numberOrSymbol, goldOrSilver);
            this.resultAnim.alpha = 0;

            if (isNaN(numberOrSymbol)) {
                // // must be a string - check bonus name
                if (numberOrSymbol === 'WheelBonus') {
                    this.isBonus = true;
                    this.bonusName = 'WheelBonus';

                    //audio.play('wheelBonusRevealed');
                    if (!autoPlay.enabled) {
                        // stop further picks as soon as player has picked this card
                        msgBus.publish('Game.DisablePicksForBonus');
                    }
                } else if (numberOrSymbol === 'CollectBonus') {
                    // Collect Bonus
                    this.isBonus = true;
                    this.bonusName = 'CollectBonus';

                    //audio.play('prizeBonusRevealed');
                    if (!autoPlay.enabled) {
                        // stop further picks as soon as player has picked this card
                        msgBus.publish('Game.DisablePicksForBonus');
                    }
                }
            } else {
                this.assetNumber = numberOrSymbol < 10 ? '0' + numberOrSymbol : '' + numberOrSymbol;

                this.valueTexts.forEach(function(valueText, index){
                    valueText.alpha = 0;
                    var prizeValueWinTextStyle = !index ? 'prizeValueWin' : 'prizeValueWinGradient';
                    valueText.style = goldOrSilver === 'Silver' ? textStyles.parse('prizeValueNoWin') : textStyles.parse(prizeValueWinTextStyle);
                    valueText.text = SKBeInstant.formatCurrency(value).formattedAmount;
                });

                this.resultAnim.y = RESULT_NUMBER_OFFSET;
            }

        }


        async uncover() {
            const _this = this;
            const evt = 'Game.Player';

            msgBus.publish(evt + 'Out', this);

            await new Promise(resolve => {
                // we need to move this pick point to the front
                // as otherwise the spineAnim will underlap neighbouring pickPoints
                _this.bringToFront();
                // we also need to bring this overall number set to the front
                // so that all spine anims are at the very front of the screen
                _this.parent.parent.parent.setChildIndex(
                    _this.parent.parent,
                    _this.parent.parent.parent.children.length - 1
                );

                // need to define a global scope since the spine listeners don't maintain scope
                var globalScope = _this;

                // add a listener for when the result is revealed it then plays it's idle animation
                utils.removeSpineListeners(globalScope.resultAnim);
                globalScope.resultAnim.state.addListener({
                    complete: function (entry) {
                        if (entry.animation.name.indexOf('REVEAL') > -1) {
                            utils.removeSpineListeners(globalScope.resultAnim);
                            resolve();
                        }
                    }
                });

                // Disable interactivity to prevent re-reveal, then switch to the animation
                _this.enabled = false;
                _this.revealed = true;
                _this.setSpineCoverState({state: 'REVEAL', loop: false});
                if (!autoPlay.enabled && _this.bonusName) {
                    _this.triggerManualPlayBonus(_this.bonusName);
                }

            });
        }

        rollover() {
            super.rollover();

            this.coverAnim.state.setAnimation(0, 'YourMOUSEOVER', false);

        }

        stopRollover() {
            super.stopRollover();

            if (this.enabled && this.interactionState === 'ROLLOUT') {
                this.coverAnim.state.setAnimation(0, 'YourMOUSEOUT', false);
            }
        }


        showBonus() {
            var _this = this;
            //we need to show the number of bonus symbols found on this turn
            //fairly straightforward, if we have 1, show 1, if we have 2, show 1 and 2
            if (_this.numBonus > 0) {
                //to stop bonus symbols pulsing and going behind other pick points
                //we need to move this one to the front
                super.bringToFront();

                //check here if we've revealed this one during auto play
                // let _auto = autoPlay.enabled;

                //TMP012-8 - Bonus Symbol shown before scratch animation in YOUR NUMBERS
                //TMP012-25 - Review feedback - create anticipation on star appearing.
                //scale the bonus symbols up from zero
                //_this.scaleFromZero(_this.bonus1, (_this.numBonus === 1), _auto);

                if (_this.numBonus > 1) {
                    //slight delay before pulsing bonus2, so both are not pulsing at the same time
                    Tween.delayedCall(gameConfig.delayBetweenBonusSymbolsInSeconds, function () {
                        //_this.scaleFromZero(_this.bonus2, (_this.numBonus === 2), _auto);
                    });
                }
            }
        }

        scaleFromZero(sym, isFinal, auto) {
            var _this = this;
            const timeline = isFinal ? new TimelineLite({
                onStart: function () {
                    // If we're in auto play, notify that we have found a bonus symbol immediately
                    if (auto) {
                        _this.notifyBonus(_this, auto);
                    }
                }, onComplete: function () {
                    // If we're in manual play, notify that we have found a bonus symbol after it has been fully revealed
                    // This is so we can move it across the screen
                    if (!auto) {
                        _this.notifyBonus(_this, auto);
                    }
                }
            }) : new TimelineLite({});
            timeline.to(sym.scale, gameConfig.pulseBonusItemDuration, {x: 2, y: 2});
            timeline.to(sym.scale, gameConfig.pulseBonusItemDuration, {x: 1, y: 1});

            if (!gameConfig.gravitateBonusItem && gameConfig.pulseBonusItemOnCollect) {
                timeline.to(sym.scale, gameConfig.pulseBonusItemDuration, {x: 1.5, y: 1.5});
                timeline.to(sym.scale, gameConfig.pulseBonusItemDuration, {x: 1, y: 1});
                timeline.to(sym.scale, gameConfig.pulseBonusItemDuration, {x: 1.5, y: 1.5});
                timeline.to(sym.scale, gameConfig.pulseBonusItemDuration, {x: 1, y: 1});
            }
        }

        notifyBonus(inThis, auto) {
            var _this = inThis;
            // Publish an event with the info for this number
            msgBus.publish('Game.BonusSymFound', {
                symbol: _this,
                numBonus: _this.numBonus,
                auto: auto
            });
        }

        stopBonusTrigger() {
            if (this.revealState === 'WheelBonus') {
                // this.resultAnim.state.setAnimation(0,'INFO_WheelIconSTATIC', false);
            } else if (this.revealState === 'CollectBonus') {
                // this.resultAnim.state.setAnimation(0,'INFO_PrizeIconSTATIC', false);
            }
        }

        reset() {
            super.reset();
            this.valueTexts.forEach(function(valueText){
                valueText.text = '';
            });
            this.assetNumber = null;
            this.value = null;
            this.number = null;
            this.resultAnim = null;
            this.resultAnimBackground = null;
            this.resultChangeAnim = null;
            this.revealState = 'Silver';
            this.bonusName = null;
            this.isBonus = false;

            if (this.firstPlay > 1 && this.stackReset === false) {
                this.coverAnim.state.setAnimation(0, 'YourRESET', false);
                this.stackReset = true;

                this.coverAnim.scale.set(0.9);
                this.coverAnim.y = 0;
            }
            this.firstPlay += 1;

            if(this.resultAnim) this.resultAnim.renderable = true;
            if(this.winAnim) this.winAnim.renderable = false; 
        }

        static fromContainer(container) {
            const card = new PlayerNumber();
            container.addChild(card);
            return card;
        }
    }

    return PlayerNumber;
});
