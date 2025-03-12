/**
 * By W.Lee - 2018
 */
define(function module(require) {
    
    //var setupData               =   require('../data/rollupSetupData');
    const PIXI                    =   require('com/pixijs/pixi');
    const TweenMax            =   require('com/gsap/TweenMax');//don't forget 'shim' in requireBuildConfig.js or TweenMax etc. will be undefined
    const app = require('skbJet/componentManchester/standardIW/app');
    require('com/pixijs/pixi-particles');



    /**
     * Just change degrees to radians
     * @param {*} degrees 
     */
    function degToRad(degrees){
        return degrees * 0.0174532925;
    }


    /**
     * radians to degrees
     * @param {*} rads 
     */
    function radToDeg(rads){
        return rads / 0.0174532925;
    }


    /**
     * 
     * @param {string} textureName
     * @param {object} anchor - {x: 0.5, y: 0.5} (optional - defaults to centre)
     */
    function spriteFromTexture(textureName, anchor){
        if(anchor === undefined){anchor = {x: 0.5, y: 0.5};}
        if(anchor.x === undefined){anchor.x = 0.5;}
        if(anchor.y === undefined){anchor.y = 0.5;}
        
        if(PIXI.Texture.fromFrame(textureName)){
            var texture = PIXI.Texture.fromFrame(textureName);
            var sprite = new PIXI.Sprite(texture);
            sprite.anchor.set(anchor.x, anchor.y);
            return sprite;
        }
        else{
            console.log("miscUtils.spriteFromTexture(" + textureName + ") - Does not exist!", "WARNING");
        }
        return {};
    }


    /**
     * 
     * @param {hex} colour1 either # or 0x format
     * @param {hex} colour2 either # or 0x format
     * @param {float} blendValue (value between 0-1)
     * @param {boolean} useHashFormat - return e.g. true: '#00ff00' or false: 0x0ff00 
     */
    function blendHexColours(colour1, colour2, blendValue, useHashFormat){
        if(useHashFormat === undefined){useHashFormat = false;}
        var toRGB = function(col){
            return {r: parseInt(col.substring(0,2),16), g: parseInt(col.substring(2,4),16), b: parseInt(col.substring(4),16)};
        };
        var channelToHex = function(channel){
            //we round the value before turning to hex, otherwise we can end up with decimal hexes!!
            var hex = (channel >> 0).toString(16);
            return hex.length === 1 ? "0" + hex : hex;
        };
        var convertToString = function(colour){
            if(colour.toString().indexOf('#') === -1){
                //convert numbers in number format(e.g. 0x00ff00) to string format we can break apart
                colour = colour.toString(16);
                while(colour.length < 6){colour = '0' + colour;}
                return colour;
            }
            else{
                //removes the '#' if in e.g. '#00ff00' format
                return colour.substring(1);
            }
        };
        var c1 = toRGB(convertToString(colour1));
        var c2 = toRGB(convertToString(colour2));
        var r = channelToHex((c1.r * blendValue) + (c2.r * (1-blendValue)));
        var g = channelToHex((c1.g * blendValue) + (c2.g * (1-blendValue)));
        var b = channelToHex((c1.b * blendValue) + (c2.b * (1-blendValue)));
        var hashFormat = r + g + b + '';
        // parseInt("ab", 16)
        var returnHex = useHashFormat ? '#' + hashFormat : parseInt('0x' + hashFormat);
        return returnHex;
    }

    /**
     * @param {movieclip} parent
     * @param {*} wh 
     * @param {*} colour 
     * @param {*} cornerRadius 
     */
    function makeRect(parent, wh, colour, cornerRadius){
        var g = new PIXI.Graphics();
        g.beginFill(colour); // black color
        // x, y, width, height, radius
        g.drawRoundedRect(0, 0, wh[0], wh[1], cornerRadius);
        g.endFill();
        var sprite = new PIXI.Sprite(g.generateCanvasTexture());
        parent.addChild(sprite);
        return sprite;
    }

    /**
     * 
     */
    function addPixiScale(){
        var addScale = function(item){
                Object.defineProperties(PIXI[item].prototype, {
                scaleX:{
                    get: function () { return this.scale.x; },
                    set: function (v) { this.scale.x = v; }
                },
                scaleY:{
                    get: function () { return this.scale.y; },
                    set: function (v) { this.scale.y = v; }
                }
            });
        };      
        addScale('Sprite');
        addScale('Container');
    }

    /**
     * 
     * @param {textField} textfield 
     * @param {text} value 
     */
    function setAndCentre(textField, value, slowCentreOnCharChange, reset, doSlowCentring, resetX){
        textField.numberOfCharactersChanged = false;
        if(reset){
            textField.y = textField.originalY;
            textField.scaleX = textField.scaleY = 1;
            textField.alpha = 1;
            textField.rotation = 0;
            textField.numberOfCharactersChanged = true;
        }
        //if normal text
        if(textField.updateText !== 'function' && textField.text){
            textField.text = value;
            if(resetX){
                textField.x = -(textField.width >> 1);
            }
            //only re-centre if number of characters change, so we avoid wobble
            if(!textField.previousLen || textField.previousLen !== textField.text.length){
                textField.previousLen = textField.text.length;
                if(slowCentreOnCharChange.enabled){
                    textField.tweenOnCharChange = TweenMax.to(textField, slowCentreOnCharChange.tweenTime, 
                        {x: -(textField.width >> 1), 
                            onComplete: function(){
                                textField.tweenOnCharChange = undefined;
                            }
                        }
                    );
                }
                else{
                    textField.x = -(textField.width >> 1);//We always centre
                }
                textField.numberOfCharactersChanged = true;
            }   
            else if (doSlowCentring && textField.tweenOnCharChange === undefined){
                //Doing this stops sudden jumps in position, but always keeps us getting closer to centre
                var bufferToNotBother = 0;
                if(textField.x > -(textField.width >> 1) + bufferToNotBother){
                    textField.x += -0.5;
                }
                else if(textField.x < -(textField.width >> 1) - bufferToNotBother){
                    textField.x += 0.5;
                }       
            }  
        }   
        else if(textField.updateText === 'function'){
            //else if fancy styled text for strokes with gradients...
            //should NOT be used for regularly changing text like rollups
            //'updateText' is not yet enabled in the rollupTextUtils so only here in readiness
            textField.updateText(value);
            textField.x = 0;
        }  
    }

    /**
     * Mainly for containers holding text, so we're resizing them, instead of the text itself
     * This makes it easier than reducing the font size incrementally for e.g. orientation changes
     * @param {*} container 
     * @param {*} maxWidth 
     */
    function containerFitWidth(container, maxWidth){
        if(container.originalscale === undefined){
            container.originalscale = container.scaleX;
        }
        container.width = maxWidth;
        if(container.scaleX > container.originalscale){
            container.scaleX = container.originalscale;
        }
        container.scaleY = container.scaleX;
    }

    /**
     * //Examples:
     * var _particleContainer;
     * var _particles;
     * _particleContainer = new PIXI.Container();
     * 
     * //For non-animated particles (Make sure you only create it once):
     * _particles = particleUtils.createEmitter(_particleContainer, particleConfig, 'ImageName');
     * 
     * //Example for animated particles (Make sure you only create it once):
     * //if image frames were named e.g. 'ImageName01' through to 'ImageName20'
     * _particles = particleUtils.createEmitter(_particleContainer, particleConfig, 'ImageName', true, {startFrame: 1, endFrame: 20, framerate: 24, isSingleNumFormat: false});
     *
     * //Emit can be set to true or false whenever you want, and starts the particle engine running
     * _particles.emit = true;
     * 
     * @param {pixi container} emitterContainer 
     * @param {object} emitterConfig 
     * @param {string} particleImgName
     * @param {array} particleImgNames Array 
     * @param {boolean} isAnim 
     * @param {object} animSettings {startFrame, endFrame, isSingleNumFormat(optional), frameRate(optional) }
     */
    function createEmitter(emitterContainer, emitterConfig, particleImgName, particleImgNames, isAnim, animSettings){
        var emitter;
        var particlesImgArray = [];
        if(isAnim && animSettings){
            //create animated particle
            if(animSettings.isSingleNumFormat === undefined){animSettings.isSingleNumFormat = false;}
            if(animSettings.frameRate === undefined){animSettings.frameRate = 10;}
            for(var i = animSettings.startFrame; i < animSettings.endFrame; i++){
                var frame = i;
                if(!animSettings.isSingleNumFormat && frame < 10){frame = "0" + frame;}
                particlesImgArray.push(PIXI.Texture.fromFrame(particleImgName + frame));
            }
            emitter = new PIXI.particles.Emitter(emitterContainer, 
                {
                    framerate: animSettings.frameRate,
                    loop: true,
                    textures: particlesImgArray
                }, 
                emitterConfig
            );  
            emitter.particleConstructor = PIXI.particles.AnimatedParticle;
        }
        else{
            for(var j = 0; j < particleImgNames.length; j++){
                particlesImgArray.push(PIXI.Texture.fromFrame(particleImgNames[j])); 
            }            
            emitter = new PIXI.particles.Emitter(emitterContainer, particlesImgArray, emitterConfig); 
        } 
        
        var ticker = app.ticker;
        var enabled = true;
        var tickHandler = function(){if(enabled){emitter.update(ticker.elapsedMS * 0.001);}};
        ticker.add(tickHandler);
        
        emitter.killEmitter = function(){
            enabled = false;
            emitter.destroy();
        };
        return emitter;
    }

    function createTextureFromContainer(inContainer, textureCacheId){
        var texture = app.renderer.generateTexture(inContainer);
        PIXI.Texture.addToCache(texture, textureCacheId);
        return texture;
    }

    return{
        degToRad: degToRad,
        radToDeg: radToDeg,
        spriteFromTexture: spriteFromTexture,
        blendHexColours: blendHexColours,
        makeRect: makeRect,
        addPixiScale: addPixiScale,
        setAndCentre: setAndCentre,
        createEmitter: createEmitter,
        containerFitWidth: containerFitWidth,
        createTextureFromContainer: createTextureFromContainer
    };
});