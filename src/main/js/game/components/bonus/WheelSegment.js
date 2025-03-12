define(require => {
    const PIXI = require('com/pixijs/pixi');
    const prizeData = require('skbJet/componentManchester/standardIW/prizeData');
    const SKBeInstant = require('skbJet/component/SKBeInstant/SKBeInstant');
    const textStyles = require('skbJet/componentManchester/standardIW/textStyles');
    const audio = require('skbJet/componentManchester/standardIW/audio');

    require('com/gsap/TimelineLite');
    require('com/gsap/easing/EasePack');

    const TimelineLite = window.TimelineLite;

    class Segment extends PIXI.Container {
        constructor(data) {
            super();

            this.type = data.type;
            this.prize = 0;
            this.index = data.index;
            
            this.texts = [];

            if (this.type === 'outer'){
              this.texts[0] = new PIXI.Text("", textStyles.parse('wheelBonusMultiplierValues'));
              this.texts[1] = new PIXI.Text("", textStyles.parse('wheelBonusMultiplierValuesGradient'));
              this.texts[0].anchor.set(0.55,0.5);
              this.texts[1].anchor.set(0.55,0.5);
              this.texts[0].rotation = 1.5708;
              this.texts[1].rotation = 1.5708;
              this.addChild(this.texts[0], this.texts[1]);
            }
            else{
              this.texts[0] = new PIXI.Text("", textStyles.parse('wheelBonusValues'));
              this.texts[1] = new PIXI.Text("", textStyles.parse('wheelBonusValuesGradient'));
              this.texts[0].anchor.set(1,0.5);
              this.texts[1].anchor.set(1,0.5);
              this.addChild(this.texts[0], this.texts[1]);
            }

            this.rotation = data.rotation;
            this.pivot.x = data.pivot - data.offset;
            this.data = data.assignedData;

            this.winContainer = new PIXI.Sprite();
            this.winContainer.name = "winContainer";

            this.winTexts = [];
            this.winStyle = null;
        }
        
        setupWin(){
          const _this = this;

          if (this.type === 'outer'){
            //text 1
            this.winTexts[0] = new PIXI.Text(this.texts[0].text, textStyles.parse('wheelBonusMultiplierValues'));
            this.winTexts[1] = new PIXI.Text(this.texts[0].text, textStyles.parse('wheelBonusMultiplierValuesGradient'));
            
            //text 2
            this.winTexts[2] = new PIXI.Text(this.texts[0].text, textStyles.parse('wheelBonusMultiplierValues'));
            this.winTexts[3] = new PIXI.Text(this.texts[0].text, textStyles.parse('wheelBonusMultiplierValuesGradient'));
          }
          else{
            //text 1
            this.winTexts[0] = new PIXI.Text(this.texts[0].text, textStyles.parse('wheelBonusValues'));
            this.winTexts[1] = new PIXI.Text(this.texts[0].text, textStyles.parse('wheelBonusValuesGradient'));

            //text 2
            this.winTexts[2] = new PIXI.Text(this.texts[0].text, textStyles.parse('wheelBonusValues'));
            this.winTexts[3] = new PIXI.Text(this.texts[0].text, textStyles.parse('wheelBonusValuesGradient'));
          }

          this.winTexts.forEach(function(winText){
            winText.alpha = 0;
            if(_this.type === 'outer'){
              winText.anchor = {x : 0.55, y : 0.5};
              winText.rotation = 1.5708;
            }
            else {
              winText.anchor = {x : 1, y : 0.5};
            }
          });

          this.winContainer.addChild(this.winTexts[0], this.winTexts[1], this.winTexts[2], this.winTexts[3]);
          this.addChildAt(this.winContainer, 0);
        }

        update() {
            if (typeof this.data === 'string') {
              if(this.type==='inner'){
                // prize value inner wheel
                this.prize = prizeData.prizeTable[this.data];
                this.texts[0].text = SKBeInstant.formatCurrency(this.prize).formattedAmount;
                this.texts[1].text = SKBeInstant.formatCurrency(this.prize).formattedAmount;
              }
              else {
                // multiplier outer wheel
                this.texts[0].text = this.data;
                this.texts[1].text = this.data;
              }
            }
        }

        land() {
            let tl = new TimelineLite();
            let scaleTime = 0.3;
            let scaleAmount = 1.3;

            function text0Out(winText){
              tl.to(winText.scale, scaleTime, {x:scaleAmount, y:scaleAmount, ease : window.Power2.easeOut }, 0);
              tl.to(winText, scaleTime, { alpha : 0, ease : window.Power2.easeOut }, 0.02);
            }
            
            function text1In(winText){
              tl.to(winText.scale, scaleTime, {x:1, y:1, ease : window.Power2.easeOut }, 0.15);
              tl.to(winText, scaleTime, { alpha : 1, ease : window.Power2.easeOut }, 0.15);
            }

            function text1Out(winText){
              tl.to(winText.scale, scaleTime, {x:scaleAmount, y:scaleAmount, ease : window.Power2.easeOut }, 0.3);
              tl.to(winText, scaleTime, { alpha : 0, ease : window.Power2.easeOut }, 0.32);
            }

            function textIn(winText){
              tl.to(winText.scale, scaleTime, {x:1, y:1, ease : window.Power2.easeOut }, 0.45);
              tl.to(winText, scaleTime, { alpha : 1, ease : window.Power2.easeOut }, 0.45);
            }

            if(this.type==='inner'){
              audio.play('wheelBonusWin', false);
              
              this.winTexts.forEach(function(winText, index){
                if (index < 2){
                  winText.alpha = 1;
                }
                else{
                  winText.scale.set(0);
                }
              });

              this.texts.forEach(function(text){
                text.scale.set(0);
                text.alpha = 0;
              });

              // 1 out
              text0Out(this.winTexts[0]);
              text0Out(this.winTexts[1]);
              // 2 in 
              text1In(this.winTexts[2]);
              text1In(this.winTexts[3]);
              // 2 out
              text1Out(this.winTexts[2]);
              text1Out(this.winTexts[3]);
              // in
              textIn(this.texts[0]);
              textIn(this.texts[1]);
              
            }
            else {
              audio.play('MultiplierWin', false);

              this.winTexts.forEach(function(winText, index){
                if (index < 2){
                  winText.alpha = 1;
                }
                else{
                  winText.scale.set(0);
                }
              });

              this.texts.forEach(function(text){
                text.scale.set(0);
                text.alpha = 0;
              });

              // 1 out
              text0Out(this.winTexts[0]);
              text0Out(this.winTexts[1]);
              // 2 in 
              text1In(this.winTexts[2]);
              text1In(this.winTexts[3]);
              // 2 out
              text1Out(this.winTexts[2]);
              text1Out(this.winTexts[3]);
              // in
              textIn(this.texts[0]);
              textIn(this.texts[1]);
            }
        }

        reset(){
          let _this = this;
          _this.winTexts = [];
          if(_this.getChildByName("winContainer")){
            _this.winContainer.removeChildren();
            _this.removeChild(_this.winContainer);
          }
        }
    }
    return Segment;
});