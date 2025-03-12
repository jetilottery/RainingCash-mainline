define(require => {
    const msgBus = require('skbJet/component/gameMsgBus/GameMsgBus');
    //const displayList = require('skbJet/componentManchester/standardIW/displayList');
    //const orientation = require('skbJet/componentManchester/standardIW/orientation');
    //const utils = require('game/components/utils/utils');

    // const _howToPlayConfig = {
    //     landscape: {
    //         MAX_HEIGHT: 40,
    //         DEFAULT_FONT_SIZE: 35
    //     },
    //     portrait: {
    //         MAX_HEIGHT: 40,
    //         DEFAULT_FONT_SIZE: 35
    //     }
    // };
    
    /*
     *
     */
    function init(){
        doSetup();
        msgBus.subscribe('GameSize.OrientationChange', doSetup);        
    }

    /*
     *
     */
    function doSetup(){
        console.debug('Do Set Up');
        // TMP012-79 - TMP012_IQA_siteId 0:text overflow on how to play page and total demo win dialog
        // Auto resizing is not implemented on the tutorial plaque by default
        // let maxHeight = _howToPlayConfig[orientation.get().toLowerCase()].MAX_HEIGHT;
        // let defFont = _howToPlayConfig[orientation.get().toLowerCase()].DEFAULT_FONT_SIZE;

        // utils.autoResize(displayList['howToPlayPage1TopText'], maxHeight, defFont);
        // utils.autoResize(displayList['howToPlayPage1Line1'], maxHeight, defFont);
        // utils.autoResize(displayList['howToPlayPage1Line2'], maxHeight, defFont);

        // for (let i = 0; i < displayList.howToPlayPages.children.length; i++){
        //     utils.autoResize(displayList['howToPlayPage'+(i+1)], maxHeight, defFont);
        // }
    }

    return {
      init
    };
  });
  