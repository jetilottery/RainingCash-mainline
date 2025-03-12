define(function (require) {
    require('polyfill');
    const msgBus = require('skbJet/component/gameMsgBus/GameMsgBus');
    const app = require('skbJet/componentManchester/standardIW/app');
    const layout = require('skbJet/componentManchester/standardIW/layout');
    const config = require('skbJet/componentManchester/standardIW/gameConfig');
    const audio = require('skbJet/componentManchester/standardIW/audio');
    const textStyles = require('skbJet/componentManchester/standardIW/textStyles');
    const gameSize = require('skbJet/componentManchester/standardIW/gameSize');
    const gameFlow = require('skbJet/componentManchester/standardIW/gameFlow');
    const documents = require('skbJet/componentManchester/standardIW/documents');
    const scenarioData = require('skbJet/componentManchester/standardIW/scenarioData');
    const loadController = require('skbJet/componentManchester/standardIW/loadController');
    const spineSubLoader = require('skbJet/componentManchester/spineLoader/SpineSubLoader');
    const bitmapFontLoader = require('game/bitmapFontLoader');
    const prizetableTransform = require('game/prizetableTransform');
    const SKBeInstant = require("skbJet/component/SKBeInstant/SKBeInstant");
    const prizestructureTransform = require("game/prizestructureTransform");
    const scenarioTransform = require('game/scenarioTransform');

    const templateLayout = require('game/template/layout');
    const gameLayout = require('game/custom/layout');
    const templateConfig = require('game/template/config');
    const gameConfig = require('game/custom/config');
    const templateAudioMap = require('game/template/audioMap');
    const gameAudioMap = require('game/custom/audioMap');
    const templateTextStyles = require('game/template/textStyles');
    const gameTextStyles = require('game/custom/textStyles');
    const dimensions = require('game/template/dimensions');

    // Require StandardIW component templates
    let buttonBar = require('skbJet/componentManchester/standardIW/ui/buttonBar/template');
    let autoPlayButton = require('skbJet/componentManchester/standardIW/ui/autoPlayButton/template');
    let resultPlaques = require('skbJet/componentManchester/standardIW/ui/resultPlaques/template');
    let howToPlay = require('skbJet/componentManchester/standardIW/ui/howToPlay/template');
    let errorPlaque = require('skbJet/componentManchester/standardIW/ui/errorPlaque/template');
    let ticketSelectBar = require('skbJet/componentManchester/standardIW/ui/ticketSelectBarSmall/template');
    let footer = require('skbJet/componentManchester/standardIW/ui/footer/template');
    let networkActivity = require('skbJet/componentManchester/standardIW/ui/networkActivity/template');

    // Require all game specific components that need initializing
    const winningNumbers = require('game/components/winningNumbers');
    const playerNumbers = require('game/components/playerNumbers');
    const tutorialPlaque = require('game/components/tutorialPlaque');
    const bonusCard = require('game/components/bonusCard');

    const wheelBonus = require('game/components/bonus/wheelBonus');
    const prizeBonus = require('game/components/bonus/prizeBonus');

    const bonusHelpButton = require('game/components/bonusHelpButton');

    const background = require('game/components/effects/background');
    // const logo = require('game/components/effects/logo');
    const buyTryAnim = require('game/components/effects/buyTryAnim');
    const bigWin = require('game/components/effects/bigWin');
    const autoPlayAudio = require('game/components/effects/autoPlayAudio');
    const transition = require('game/components/transition/transition');
    const setup = require('game/components/setup/setup');
    const appPreload = require('game/components/utils/preload');
    const resultScreen = require('game/resultScreen');

    require('game/components/winUpTo');

    // Require game side state handlers.
    require('game/ticketAcquired');
    require('game/startReveal');
    require('game/endReveal');
    require('game/gameReset');
    require('game/error');

    // Register template configs and game overrides
    layout.register(templateLayout, gameLayout);
    audio.register(templateAudioMap, gameAudioMap);
    config.register(templateConfig, gameConfig);
    textStyles.register(templateTextStyles, gameTextStyles);
    // Add Spine subLoader (not included in loadController by default)
    loadController.registerSubLoader('spine', new spineSubLoader());
    loadController.registerSubLoader('bitmapFonts', new bitmapFontLoader());

    // Set game size for portrait and landscape
    gameSize.set(dimensions);

    function gameInit() {
        // Register a transform function that can be used to turn the prizetable data into structured
        // data representing the prizetables in the paytable document
        if (SKBeInstant.isWLA()) {
            documents.registerPrizestructureTransform(prizestructureTransform);
        } else {
            documents.registerPrizetableTransform(prizetableTransform);
        }
        // Register a transform function that can be used to turn the scenario string into useable data
        scenarioData.registerTransform(scenarioTransform);

        // Init StandardIW UI templates
        howToPlay = howToPlay();
        resultPlaques = resultPlaques();
        errorPlaque = errorPlaque();
        buttonBar = buttonBar();
        autoPlayButton = autoPlayButton();
        ticketSelectBar = ticketSelectBar();
        footer = footer();
        networkActivity = networkActivity();

        msgBus.publish('UI.updateButtons', {
            autoPlay: false
        });

        // Inititialize all game components
        appPreload.preload(app, () => {
            winningNumbers.init();
            playerNumbers.init();
            bonusCard.init();
            autoPlayAudio.init();
            buyTryAnim.init();

            // Add everything to the stage
            app.stage.addChild(
                layout.container,
                ticketSelectBar,
                buttonBar,
                autoPlayButton,
                resultPlaques,
                howToPlay,
                footer,
                errorPlaque,
                networkActivity
            );

            // Init setup
            setup.init();

            // Init transition
            transition.init();

            // Init Big Win
            bigWin.init();

            // Init animated background
            background.init();

            wheelBonus.init();

            prizeBonus.init();

            resultScreen.init();

            appPreload.textFix();

            // Once everything is initialized continue to next state
            tutorialPlaque.init();

            bonusHelpButton.init();

            gameFlow.next();
        });
    }

    gameFlow.handle(gameInit, 'GAME_INIT');
});
