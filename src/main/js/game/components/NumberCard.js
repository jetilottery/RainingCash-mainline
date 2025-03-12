define(require => {
    const msgBus = require('skbJet/component/gameMsgBus/GameMsgBus');
    const PIXI = require('com/pixijs/pixi');
    const Pressable = require('skbJet/componentManchester/standardIW/components/pressable');
    const autoPlay = require('skbJet/componentManchester/standardIW/autoPlay');
    const gameConfig = require('skbJet/componentManchester/standardIW/gameConfig');
    const resLib = require('skbJet/component/resourceLoader/resourceLib');
    const utils = require('game/components/utils/utils');
    require('com/gsap/TweenLite');
    require('com/gsap/easing/EasePack');

    const Tween = window.TweenLite;


    class NumberCard extends Pressable {
        constructor(width, height) {
            super();

            this.WIDTH = width;
            this.HEIGHT = height;

            // Create all the empty sprites
            this.coverAnim = null;
            this.coverContainer = new PIXI.Sprite();
            this.resultAnim = null;
            this.resultAnimBackground = null;
            this.resultContainer = new PIXI.Sprite();

            this.pickPointType = '';
            this.interactionState = '';
            this.winType = '';

            this.rolloverTween = null;

            // Center the spine anim containers
            this.coverContainer.anchor.set(0.5);

            this.addChild(this.resultContainer, this.coverContainer);

            // State
            this.revealed = false;
            this.interactionState = '';

            // Interactivity
            this.hitArea = new PIXI.Rectangle(
                this.WIDTH / -2,
                this.HEIGHT / -2,
                this.WIDTH,
                this.HEIGHT
            );
            this.on('press', () => {
                if (!autoPlay.enabled) {
                    this.reveal();
                }
            });
            //add the pointerover event
            this.off('pointerover');
            this.on('pointerover', () => {
                this.rollover();
            });
            this.off('pointerout');
            this.on('pointerout', () => {
                this.stopRollover();
            });

        }


        enable() {
            return new Promise(resolve => {
                this.reveal = resolve;
                this.enabled = true;
                if (this.revealed) {
                    resolve();
                }
            }).then(() => {
                this.enabled = false;
            });
        }

        populate(number, silverOrGold) {

            if(this.resultAnim !== null) {
                this.resultAnim = null;
                this.resultContainer.removeChildren();
            }
            this.number = number;
            if (!isNaN(number)) {
                //if the number is a number
                this.resultAnim = new PIXI.spine.Spine(resLib.spine[silverOrGold + 'Numbers'].spineData);
            } else {
                //it's a bonus letter,
                this.resultAnim = new PIXI.spine.Spine(resLib.spine['BonusTriggers'].spineData);
            }
            this.resultContainer.addChild(this.resultAnim);
        }

        prompt() {
            this.bringToFront();
            this.setSpineCoverState({state: 'IDLE', loop: true});
        }

        stopIdle() {
            this.setSpineCoverState({state: 'DEFAULT', loop: false});
        }

        disable() {
            this.enabled = false;
            this.reveal = undefined;
        }

        hold() {
            this.enabled = false;
        }

        rollover() {
            msgBus.publish('Game.StopIdle');
            const evt = (this.pickPointType === 'Your') ? 'Game.Player' : 'Game.Winning';
            msgBus.publish(evt + 'Over', this);
            this.setSpineCoverState({state: 'ROLLOVER', loop: false});

            if (this.enabled) {
                // this.rolloverTween = Tween.to(this.coverContainer.scale, 0.3, {
                //     x: 1.2,
                //     y: 1.2
                // });
            }
        }



        stopRollover() {
            const _this = this;
            const evt = (_this.pickPointType === 'Your') ? 'Game.Player' : 'Game.Winning';
            msgBus.publish(evt + 'Out', _this);


            this.rolloverTween = Tween.to(this.coverContainer.scale, 0.3, {
                x: 1,
                y: 1
            });

            if (_this.interactionState !== 'ROLLOVER') {
                return;
            } else {
                _this.setSpineCoverState({state: 'ROLLOUT', loop: true});
                msgBus.publish('Game.ResetIdle');
            }
        }

        reset() {
            this.resultContainer.removeChildren();
            this.coverAnim.renderable = true;
            this.enabled = false;
            this.revealed = false;
            this.matched = false;
            this.number = undefined;
            this.scale.x = this.scale.y = 1;
            this.winType = '';
            if (this.valueText) {
                this.valueText.visible = true;
            }
            if (this.interactionState !== 'DEFAULT') {
                utils.removeSpineListeners(this.coverAnim);
                utils.removeSpineListeners(this.resultAnim);
                utils.stopSpineAnim(this.coverAnim);
                this.setSpineCoverState({state: 'DEFAULT', loop: false});
            }
            this.rolloverTween = null;
            this.coverAnim.scale.set(1);
        }

        bringToFront() {
            // we need to move this pick point to the front
            // as otherwise the spineAnim will underlap neighbouring pickPoints
            this.parent.parent.setChildIndex(
                this.parent,
                this.parent.parent.children.length - 1
            );
        }

        async uncover() {
            const _this = this;
            const evt = (this.pickPointType === 'Your') ? 'Game.Player' : 'Game.Winning';

            msgBus.publish(evt + 'Out', this);

            await new Promise(resolve => {
                // we need to move this pick point to the front
                // as otherwise the spineAnim will underlap neighbouring pickPoints
                // _this.bringToFront();
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
            });
        }

        match(winType) {
            this.matched = true;
            this.winType = winType || 'WIN';
        }

        presentWin(delayPresentation) {
            let _this = this;
            let presentationDelay = delayPresentation ? 1 : 0;
            // _this.bringToFront();
            Tween.delayedCall(presentationDelay, function () {
                return new Promise(resolve => Tween.fromTo(
                    _this.resultContainer.scale,
                    0.75,
                    {
                        x: 0.666,
                        y: 0.666
                    },
                    {
                        x: 1,
                        y: 1,
                        ease: window.Elastic.easeOut.config(
                            gameConfig.matchAnimAmplitude,
                            gameConfig.matchAnimPeriod
                        ),
                        onComplete: function () {
                            _this.resultAnim.state.tracks[0].time = 0;
                            _this.resultAnim.state.tracks[0].timeScale = 1;
                            resolve();
                        },
                    }
                ));
            });
        }
    }

    return NumberCard;
});