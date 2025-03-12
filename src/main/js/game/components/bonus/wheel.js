define(require => {
    const displayList = require('skbJet/componentManchester/standardIW/displayList');
    const Segment = require('game/components/bonus/WheelSegment');
    const msgBus = require('skbJet/component/gameMsgBus/GameMsgBus');
    const resLib = require('skbJet/component/resourceLoader/resourceLib');
    const audio = require('skbJet/componentManchester/standardIW/audio');
    const PIXI = require('com/pixijs/pixi');

    require('com/gsap/TweenMax');
    require('com/gsap/TimelineMax');
    require('com/gsap/easing/EasePack');
    require('com/gsap/easing/CustomEase');
    const CustomEase = window.CustomEase;
    const TimelineMax = window.TimelineMax;
    const Tween = window.TweenMax;

    let wheelResolved;
    let innerTarget;
    let outerTarget;

    let wheelPrizeMap = [
    'W1','W7','W5','W8','W6',
    'W4','W7','W5','W8','W7',
    'W2','W6','W8','W7','W5',
    'W3','W7','W8','W5','W6'];

    let wheelMultiplierMap = [
      "1x","3x","4x","2x","5x",
      "1x","4x","2x","3x","4x",
      "1x","3x","4x","2x","10x",
      "1x","3x","2x","4x","5x"];

    let easeSpeed = CustomEase.create("custom", "M0,0,C0.272,0,0.371,0.508,0.43,0.692,0.546,1.058,0.866,1,1,1");
    let outerEaseSpeed = CustomEase.create("custom", "M0,0,C0.188,0,0.371,0.508,0.43,0.692,0.546,1.058,0.866,1,1,1");
    let innerSegmentMap = [];
    let outerSegmentMap = [];

    let innerWheel;
    let innerParticles;

    let outerWheel;
    let outerParticles;

    let startRotation = 1.5708;//1.5708 + 0.15707963267948966; - TODO - offset wheel rotation so it's not pointing at a win amount when it loads up??

    function init() {

        innerWheel = displayList.innerWheel;
        outerWheel = displayList.outerWheel;

        let radius = 0;
        let innerOffset = 410;
        let outerOffset = 542;

        // particles that fly off the inner wheel as it spins
        innerParticles = new PIXI.spine.Spine(resLib.spine['Bonuses'].spineData);
        displayList.innerWheelParticles.addChild(innerParticles);
        innerParticles.renderable = false;

        // particles that fly off the outer window as it spins
        outerParticles = new PIXI.spine.Spine(resLib.spine['Bonuses'].spineData);
        displayList.outerWheelParticles.addChild(outerParticles);
        outerParticles.renderable = false;

        innerWheel.rotation = startRotation;
        outerWheel.rotation = startRotation;
        
        wheelPrizeMap.forEach((e, i, a) => {

            let rotation = (((2 * Math.PI) / a.length) * i);
            let innerSegment = new Segment({
                type : 'inner',
                rotation: rotation,
                pivot: radius,
                assignedData: wheelPrizeMap[i],
                offset: innerOffset,
                index: i
            });
            innerSegmentMap.push(innerSegment);
            displayList.wheelPrizeValues.addChild(innerSegment);


            let outerSegment = new Segment({
                type : 'outer',
                rotation: rotation,
                pivot: radius,
                assignedData: wheelMultiplierMap[i],
                offset: outerOffset,
                index: i
            });
            outerSegmentMap.push(outerSegment);
            displayList.wheelMultiplierValues.addChild(outerSegment);
        });

        innerSegmentMap.forEach(e => e.update());
        outerSegmentMap.forEach(e => e.update());

    }

    async function spinWheel(data, callback) {
        // audio.play('spinLoop');
        innerTarget = findLandPosition(data.endpoints[0], 'inner');
        outerTarget = findLandPosition(data.endpoints[1], 'outer');

        let timeLine = new TimelineMax({});

        innerWheel.rotation = startRotation;// innerWheel.rotation % (Math.PI * 2);
        msgBus.publish('game.bonus.checkData');

        Tween.delayedCall(0.5, () => {
            //audio.play('spinSustain',true);
            sustainSpin(innerWheel, 4, false, innerTarget, timeLine);
            sustainSpin(outerWheel, 7, true, outerTarget, timeLine);
        });


        let resolvePromise = new Promise(c => {
            wheelResolved = c;
        });

        resolvePromise.then(() => {
            audio.play('wheelBonusWin');
            callback();
        });

    }

    function sustainSpin(wheel, duration, outerWheel, target, timeLine) {

        let rot = (2 * Math.PI) - target.rotation + (3 * (Math.PI*2)); // spin 3 times + the reverse of the target angle

        if(outerWheel){

            // start the outer wheel sparks
            Tween.delayedCall(0.8, ()=>{
                outerParticles.alpha = 0;
                outerParticles.renderable = true;
                outerParticles.state.setAnimation(0,'WheelBonus/WheelOuterSweep',true);
                Tween.to(outerParticles, 0.2, { alpha : 1 });
            });

            // stop the outer sparks
            Tween.delayedCall((duration-1.5),()=>{
                Tween.to(outerParticles, 0.2, { alpha : 0, onComplete : function(){
                    outerParticles.renderable = false;
                }});
            });

            // play the spin down audio 
            //Tween.delayedCall((duration-4),()=>{
                //audio.stop('spinSustain');
                //audio.play('spinStop');
            //});

        }
        else {

            // start the inner sparks
            Tween.delayedCall(0.8, ()=>{
                innerParticles.alpha = 0;
                innerParticles.renderable = true;
                innerParticles.state.setAnimation(0,'WheelBonus/WheelInnerSweep',true);
                Tween.to(innerParticles, 0.2, { alpha : 1 });
            });

            // stop the inner sparks
            Tween.delayedCall((duration-1.5),()=>{
                Tween.to(innerParticles, 0.2, { alpha : 0, onComplete : function(){
                    innerParticles.renderable = false;
                }});
            });

        }
        
        return timeLine.to(wheel, duration, {
            ease: outerWheel ? outerEaseSpeed : easeSpeed,
            rotation: rot,
            onComplete: () => {
                target.land();
                if(outerWheel){
                  wheelResolved();
                }
            }
        }, 0);
    }

    function findLandPosition(endpoint, type) {
      if(type === 'inner'){
        let innerMap = innerSegmentMap.filter(e => {
            return e.data === endpoint;
        });
        let index = Math.floor(Math.random() * innerMap.length);
        innerMap[index].setupWin();
        return innerMap[index];
      }
      else {
        let outerMap = outerSegmentMap.filter(e => {
            return e.data === endpoint;
        });
        let index = Math.floor(Math.random() * outerMap.length);
        outerMap[index].setupWin();
        return outerMap[index];
      }
    }

    function updatePrizeAmounts() {
        innerSegmentMap.forEach(e => e.update());
        outerSegmentMap.forEach(e => e.update());
    }


    function reset() {
        innerWheel.rotation = startRotation;
        outerWheel.rotation = startRotation;
        innerSegmentMap.forEach(e => e.reset());
        outerSegmentMap.forEach(e => e.reset());
    }

    msgBus.subscribe('MeterData.TicketCost', updatePrizeAmounts);

    return {
        init,
        spinWheel,
        reset,
    };
});