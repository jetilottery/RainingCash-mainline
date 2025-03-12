/* eslint-disable */

define([
    'com/pixijs/pixi',
    'skbJet/component/resourceLoader/Util',
    'skbJet/component/resourceLoader/AbstractSubLoader',
    'skbJet/component/resourceLoader/resourceLib',

], function(PIXI, Util, AbstractSubLoader, resLib){

    resLib.bitmapFonts = resLib.bitmapFonts||{};

    function BitmapFontLoader(options){
        options = options||{};
        this._initOptions('bitmapFonts', options);
    }

    BitmapFontLoader.prototype = new AbstractSubLoader();

    BitmapFontLoader.prototype._load = BitmapFontLoader.prototype.load;

    BitmapFontLoader.prototype.load = function(fileMap, options) {
        this.loader = new PIXI.loaders.Loader();
        this.loader.defaultQueryString = (options.queryStr.charAt(0)==='?') ? options.queryStr.replace('?','') : options.queryStr;
        options.queryStr = null;
        this._load(fileMap, options);
        var This = this;
        this.loader.on('load', function(loader, resource){
            if(resource.texture){
                resLib.bitmapFonts[resource.name] = resource;
            }
            This._count.current++;
            This.options.onFileLoaded();
        });
        this.loader.once('complete', function(){
            This._count.complete = true;
            This.options.onFileLoaded();
        });
        this.loader.on('error', this.options.onLoadFailed);
        this.loader.load();
    };

    BitmapFontLoader.prototype._doLoadFile = function(url,success,fail){
        if(Util.getFileExt(url) === 'xml')
        {
            var name = Util.getFileNameWithoutExt(url);
            this.loader.add(name, url);
        }
    };

    return BitmapFontLoader;
});
