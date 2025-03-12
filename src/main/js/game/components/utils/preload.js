define(require => {
    const PIXI = require('com/pixijs/pixi');
    const displayList = require('skbJet/componentManchester/standardIW/displayList');

    function preload(app, callback) {
        // Sprite sheets

        app.renderer.plugins.prepare.add(PIXI.utils.BaseTextureCache['BG_atlas_page_BG.png']);
        app.renderer.plugins.prepare.add(PIXI.utils.BaseTextureCache['BG_atlas_page_BG.jpg']);
        // app.renderer.plugins.prepare.add(PIXI.utils.BaseTextureCache['BG_atlas_page_BG2.jpg']);
        // app.renderer.plugins.prepare.add(PIXI.utils.BaseTextureCache['BG_atlas_page_BG3.jpg']);
        // app.renderer.plugins.prepare.add(PIXI.utils.BaseTextureCache['BG_atlas_page_BG4.jpg']);
        // app.renderer.plugins.prepare.add(PIXI.utils.BaseTextureCache['BG_atlas_page_BG5.jpg']);
        // app.renderer.plugins.prepare.add(PIXI.utils.BaseTextureCache['BG_atlas_page_BG6.jpg']);
        // app.renderer.plugins.prepare.add(PIXI.utils.BaseTextureCache['BG_atlas_page_BG7.jpg']);
        
        app.renderer.plugins.prepare.add(PIXI.utils.BaseTextureCache['BG_elements_atlas_page_BG_elements.jpg']);
        app.renderer.plugins.prepare.add(PIXI.utils.BaseTextureCache['BGshapes_atlas_page_BGshapes.png']);

        //app.renderer.plugins.prepare.add(PIXI.utils.BaseTextureCache['BonusBG_atlas_page_BonusBG.jpg']);
        //app.renderer.plugins.prepare.add(PIXI.utils.BaseTextureCache['BonusBG_atlas_page_BonusBG.png']);
        app.renderer.plugins.prepare.add(PIXI.utils.BaseTextureCache['Bonuses_atlas_page_Bonuses.jpg']);
        app.renderer.plugins.prepare.add(PIXI.utils.BaseTextureCache['Bonuses_atlas_page_Bonuses.png']);
        app.renderer.plugins.prepare.add(PIXI.utils.BaseTextureCache['Bonuses_atlas_page_Bonuses2.jpg']);
        app.renderer.plugins.prepare.add(PIXI.utils.BaseTextureCache['Bonuses_atlas_page_Bonuses3.jpg']);
        app.renderer.plugins.prepare.add(PIXI.utils.BaseTextureCache['Bonuses_atlas_page_Bonuses4.jpg']);
        app.renderer.plugins.prepare.add(PIXI.utils.BaseTextureCache['Bonuses_atlas_page_Bonuses5.jpg']);
        app.renderer.plugins.prepare.add(PIXI.utils.BaseTextureCache['Bonuses_atlas_page_Bonuses6.jpg']);
        app.renderer.plugins.prepare.add(PIXI.utils.BaseTextureCache['Bonuses_atlas_page_Bonuses7.jpg']);
        app.renderer.plugins.prepare.add(PIXI.utils.BaseTextureCache['Bonuses_atlas_page_Bonuses8.jpg']);
        app.renderer.plugins.prepare.add(PIXI.utils.BaseTextureCache['Bonuses_atlas_page_Bonuses9.jpg']);
        app.renderer.plugins.prepare.add(PIXI.utils.BaseTextureCache['Bonuses_atlas_page_Bonuses10.jpg']);
        app.renderer.plugins.prepare.add(PIXI.utils.BaseTextureCache['Bonuses_atlas_page_Bonuses11.jpg']);
        app.renderer.plugins.prepare.add(PIXI.utils.BaseTextureCache['Bonuses_atlas_page_Bonuses12.jpg']);
        app.renderer.plugins.prepare.add(PIXI.utils.BaseTextureCache['Bonuses_atlas_page_Bonuses13.jpg']);
        app.renderer.plugins.prepare.add(PIXI.utils.BaseTextureCache['Bonuses_atlas_page_Bonuses14.jpg']);
        app.renderer.plugins.prepare.add(PIXI.utils.BaseTextureCache['BonusTriggers_atlas_page_BonusTriggers.png']);

        app.renderer.plugins.prepare.add(PIXI.utils.BaseTextureCache['buyButtonHighlight_atlas_page_buyButtonHighlight.jpg']);

        app.renderer.plugins.prepare.add(PIXI.utils.BaseTextureCache['CoverAnims_atlas_page_CoverAnims.jpg']);
        app.renderer.plugins.prepare.add(PIXI.utils.BaseTextureCache['CoverAnims_atlas_page_CoverAnims.png']);
        app.renderer.plugins.prepare.add(PIXI.utils.BaseTextureCache['CoverAnims_atlas_page_CoverAnims2.png']);
        app.renderer.plugins.prepare.add(PIXI.utils.BaseTextureCache['CoverAnims_atlas_page_CoverAnims3.png']);
        app.renderer.plugins.prepare.add(PIXI.utils.BaseTextureCache['GoldNumbers_atlas_page_GoldNumbers.png']);
        app.renderer.plugins.prepare.add(PIXI.utils.BaseTextureCache['GoldNumbers_atlas_page_GoldNumbers2.png']);

        app.renderer.plugins.prepare.add(PIXI.utils.BaseTextureCache['NumberBG_atlas_page_NumberBG.png']);

        app.renderer.plugins.prepare.add(PIXI.utils.BaseTextureCache['SilverNumbers_atlas_page_SilverNumbers.png']);
        app.renderer.plugins.prepare.add(PIXI.utils.BaseTextureCache['SilverNumbers_atlas_page_SilverNumbers2.png']);
        app.renderer.plugins.prepare.add(PIXI.utils.BaseTextureCache['Transition_atlas_page_Transition.png']);
        app.renderer.plugins.prepare.add(PIXI.utils.BaseTextureCache['WinAnnounce_atlas_page_WinAnnounce.jpg']);
        app.renderer.plugins.prepare.add(PIXI.utils.BaseTextureCache['WinAnnounce_atlas_page_WinAnnounce.png']);
        app.renderer.plugins.prepare.add(PIXI.utils.BaseTextureCache['WinAnnounce_atlas_page_WinAnnounce2.jpg']);
        app.renderer.plugins.prepare.add(PIXI.utils.BaseTextureCache['WinAnnounce_atlas_page_WinAnnounce3.jpg']);
        app.renderer.plugins.prepare.add(PIXI.utils.BaseTextureCache['WinAnnounce_atlas_page_WinAnnounce4.jpg']);
        app.renderer.plugins.prepare.add(PIXI.utils.BaseTextureCache['WinAnnounce_atlas_page_WinAnnounce5.jpg']);
        app.renderer.plugins.prepare.upload(callback);
    }

    function textFix() {
        displayList.moveToMoneyButton.label.maxWidth = 230;
        displayList.autoPlayStartButton.label.maxWidth = 230;
        displayList.autoPlayStopButton.label.maxWidth = 230;
        displayList.collectInfoRevealAllButton.label.maxWidth = 230;
        displayList.howToPlayClose.label.maxWidth = 230;

        displayList.ticketSelectCostValue.maxWidth = 180;

        // if(displayList.winPlaqueMessage.height > 75) {
        //     displayList.winPlaqueMessage.scale.set(0.6);
        // }
        // if(displayList.losePlaqueMessage.height > 283) {
        //     displayList.losePlaqueMessage.scale.set(0.6);
        // }

    }

    return {
        preload,
        textFix
    };    
});