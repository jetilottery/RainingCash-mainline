"use strict";

define({
    _BASE_APP: {
        children: ['background', 'baseGameContainer', 'WheelBonusContainer', 'CollectBonusContainer', 'extraUI']
    },
    baseGameContainer: {
        children: ['logo', 'winUpTo', 'bonusCardContainer', 'numberContainer']
    },

    /*
     * BACKGROUND
     */
    background: {
        type: 'sprite',
        children: ['bonusBackground', 'basegameBackground', 'backgroundElements', 'backgroundShapes']
    },
    basegameBackground: {
        type: 'sprite',
        x: 0,
        y: 0
    },
    bonusBackground: {
        type: 'sprite',
        x: 0,
        y: 0
    },
    backgroundElements: {
        type: 'sprite',
        x: 0,
        y: 0
    },
    backgroundShapes: {
        type: 'sprite',
        x: 0,
        y: 0
    },

    /*
     * LOGO
     */
    logo: {
        type: 'sprite',
        anchor: 0.5,
        landscape: {
            texture: 'landscape_Logo',
            x: 1165,
            //1150
            y: 153
        },
        portrait: {
            texture: 'portrait_Logo',
            x: 405,
            y: 85 //110

        }
    },

    /*
     * WIN UP TO
     */
    winUpTo: {
        type: 'container',
        children: ['winUpToIn', 'winUpToOut'],
        landscape: {
            x: 1156,
            y: 320
        },
        portrait: {
            x: 405,
            y: 220
        }
    },
    winUpToIn: {
        type: 'container',
        children: ['winUpToInTextLower', 'winUpToInTextUpper']
    },
    winUpToInTextLower: {
        type: 'text',
        style: 'winUpToLower',
        string: 'winUpToText',
        anchor: 0.5,
        wordWrap: true,
        landscape: {
            wordWrapWidth: 200
        },
        portrait: {
            wordWrapWidth: 450
        }
    },
    winUpToInTextUpper: {
        type: 'text',
        style: 'winUpToUpper',
        string: 'winUpToText',
        anchor: 0.5,
        wordWrap: true,
        landscape: {
            wordWrapWidth: 200
        },
        portrait: {
            wordWrapWidth: 450
        }
    },
    winUpToOut: {
        type: 'container',
        children: ['winUpToOutTextLower', 'winUpToOutTextUpper']
    },
    winUpToOutTextLower: {
        type: 'text',
        style: 'winUpToLower',
        string: 'winUpToText',
        anchor: 0.5,
        wordWrap: true,
        landscape: {
            wordWrapWidth: 200
        },
        portrait: {
            wordWrapWidth: 450
        }
    },
    winUpToOutTextUpper: {
        type: 'text',
        style: 'winUpToUpper',
        string: 'winUpToText',
        anchor: 0.5,
        wordWrap: true,
        landscape: {
            wordWrapWidth: 200
        },
        portrait: {
            wordWrapWidth: 450
        }
    },

    /*
     * WINNING NUMBERS
     */
    winningNumbers: {
        type: 'container',
        children: ['winningNumbersTitle', 'winningNumbersContainer'],
        landscape: {
            x: 0,
            y: 44
        },
        portrait: {
            x: 0,
            y: 355
        }
    },
    winningNumbersTitle: {
        type: 'container',
        children: ['luckyNumbersnumberDivider', 'winningNumbersTitleText', 'winningNumbersTitleTextGradient'],
        x: 0,
        landscape: {
            y: 5
        },
        portrait: {
            y: 40
        }
    },
    winningNumbersTitleText: {
        type: 'text',
        string: 'luckyNumbers',
        style: 'winningNumbersTitle',
        landscape: {
            maxWidth: 750,
            anchor: 0.5,
            x: 437.5,
            y: 43
        },
        portrait: {
            maxWidth: 405,
            anchor: 0.5,
            x: 405,
            y: 23
        }
    },
    winningNumbersTitleTextGradient: {
        type: 'text',
        string: 'luckyNumbers',
        style: 'winningNumbersTitleGradient',
        landscape: {
            maxWidth: 750,
            anchor: 0.5,
            x: 437.5,
            y: 43
        },
        portrait: {
            maxWidth: 405,
            anchor: 0.5,
            x: 405,
            y: 23
        }
    },
    winningNumbersContainer: {
        type: 'container',
        landscape: {
            x: 175
        },
        portrait: {
            x: 140
        },
        children: ['winningNumber1', 'winningNumber2', 'winningNumber3', 'winningNumber4', 'winningNumber5']
    },
    winningNumber1: {
        type: 'container',
        landscape: {
            x: 0,
            y: 133
        },
        portrait: {
            x: 0,
            y: 153
        }
    },
    winningNumber2: {
        type: 'container',
        landscape: {
            x: 130,
            y: 133
        },
        portrait: {
            x: 130,
            y: 153
        }
    },
    winningNumber3: {
        type: 'container',
        landscape: {
            x: 260,
            y: 133
        },
        portrait: {
            x: 260,
            y: 153
        }
    },
    winningNumber4: {
        type: 'container',
        landscape: {
            x: 390,
            y: 133
        },
        portrait: {
            x: 390,
            y: 153
        }
    },
    winningNumber5: {
        type: 'container',
        landscape: {
            x: 520,
            y: 133
        },
        portrait: {
            x: 520,
            y: 153
        }
    },

    /*
     * BONUS AREA
     */
    bonusCardContainer: {
        type: 'container',
        children: ['bonusCard'],
        landscape: {
            x: 1156,
            y: 475
        },
        portrait: {
            x: 405,
            y: 163
        }
    },
    bonusCard: {
        type: 'sprite',
        children: ['icon_instantWin', 'icon_wheelBonus', 'icon_prizeBonus'],
        anchor: 0.5
    },
    icon_instantWin: {
        type: 'container',
        children: ['icon_instantWinGraphic', 'icon_instantWinText'],
        anchor: 0.5,
        landscape: {
            x: 0,
            y: -45
        },
        portrait: {
            x: 0,
            y: 130
        }
    },
    icon_instantWinGraphic: {
        type: 'sprite',
        anchor: 0.5 // texture:'BonusInfo_IWBonusSymbol'

    },
    icon_instantWinText: {
        type: 'text',
        style: 'bonusCards',
        anchor: 0.5,
        maxWidth: 350,
        y: 80
    },
    icon_wheelBonus: {
        type: 'container',
        children: ['icon_wheelBonusGraphic', 'icon_wheelBonusText'],
        landscape: {
            x: 210,
            y: -45
        },
        portrait: {
            x: 264,
            y: 135
        }
    },
    icon_wheelBonusGraphic: {
        type: 'sprite',
        anchor: 0.5 // texture:'BonusInfo_WheelBonusSymbol',

    },
    icon_wheelBonusText: {
        type: 'text',
        style: 'bonusCards',
        anchor: 0.5,
        maxWidth: 150,
        y: 80
    },
    icon_prizeBonus: {
        type: 'container',
        children: ['icon_prizeBonusGraphic', 'icon_prizeBonusText'],
        landscape: {
            x: -206,
            y: -45
        },
        portrait: {
            x: -264,
            y: 135
        }
    },
    icon_prizeBonusGraphic: {
        type: 'sprite',
        anchor: 0.5,
        scale: 0.85 // texture:'BonusInfo_PrizeBonusSymbol'

    },
    icon_prizeBonusText: {
        type: 'text',
        style: 'bonusCards',
        anchor: 0.5,
        maxWidth: 150,
        y: 80
    },

    /*
     * NUMBER CONTAINER
     */
    numberContainer: {
        type: 'container',
        children: ['playerNumbers', 'winningNumbers']
    },

    /*
     * PLAYER NUMBERS
     */
    playerNumbers: {
        type: 'container',
        children: ['playerNumbersTitle', 'playerNumbersContainer'],
        landscape: {
            x: 0,
            y: 160
        },
        portrait: {
            x: -70,
            y: 520
        }
    },
    playerNumbersnumberDivider: {
        type: 'sprite',
        anchor: 0.5,
        texture: 'light-separator',
        landscape: {
            x: 437.5,
            y: 85
        },
        portrait: {
            x: 405,
            y: 75
        },
        scale: {
            x: 3
        }
    },
    luckyNumbersnumberDivider: {
        //TODO remove it
        alpha: 0,
        type: 'sprite',
        anchor: 0.5,
        texture: 'light-separator',
        landscape: {
            x: 437.5,
            y: 45
        },
        portrait: {
            x: 405,
            y: 25
        },
        scale: {
            x: 3
        }
    },
    playerNumbersTitle: {
        type: 'container',
        children: ['playerNumbersTitleText'],
        landscape: {
            x: 0,
            y: 25
        },
        portrait: {
            x: 70,
            y: 10
        }
    },
    playerNumbersTitleText: {
        type: 'text',
        string: 'yourNumbers',
        style: 'yourNumbers',
        landscape: {
            maxWidth: 750,
            anchor: 0.5,
            x: 437.5,
            y: 82
        },
        portrait: {
            maxWidth: 405,
            anchor: 0.5,
            x: 405,
            y: 73
        }
    },
    playerNumbersContainer: {
        type: 'container',
        children: ['playerNumber1', 'playerNumber2', 'playerNumber3', 'playerNumber4', 'playerNumber5', 'playerNumber6', 'playerNumber7', 'playerNumber8', 'playerNumber9', 'playerNumber10', 'playerNumber11', 'playerNumber12', 'playerNumber13', 'playerNumber14', 'playerNumber15', 'playerNumber16', 'playerNumber17', 'playerNumber18', 'playerNumber19', 'playerNumber20', 'playerNumber21', 'playerNumber22', 'playerNumber23', 'playerNumber24', 'playerNumber25'],
        landscape: {
            scale: 0.95,
            x: -35,
            y: 20
        },
        portrait: {
            x: 0
        }
    },
    playerNumber1: {
        type: 'container',
        landscape: {
            x: 275,
            y: 170
        },
        portrait: {
            x: 229,
            y: 170
        }
    },
    playerNumber2: {
        type: 'container',
        landscape: {
            x: 395,
            y: 170
        },
        portrait: {
            x: 370,
            y: 170
        }
    },
    playerNumber3: {
        type: 'container',
        landscape: {
            x: 515,
            y: 170
        },
        portrait: {
            x: 515,
            y: 170
        }
    },
    playerNumber4: {
        type: 'container',
        landscape: {
            x: 635,
            y: 170
        },
        portrait: {
            x: 660,
            y: 170
        }
    },
    playerNumber5: {
        type: 'container',
        landscape: {
            x: 755,
            y: 170
        },
        portrait: {
            x: 798,
            y: 170
        }
    },
    playerNumber6: {
        type: 'container',
        landscape: {
            x: 215,
            y: 265
        },
        portrait: {
            x: 154,
            y: 265
        }
    },
    playerNumber7: {
        type: 'container',
        landscape: {
            x: 335,
            y: 265
        },
        portrait: {
            x: 300,
            y: 265
        }
    },
    playerNumber8: {
        type: 'container',
        landscape: {
            x: 455,
            y: 265
        },
        portrait: {
            x: 442,
            y: 265
        }
    },
    playerNumber9: {
        type: 'container',
        landscape: {
            x: 575,
            y: 265
        },
        portrait: {
            x: 586,
            y: 265
        }
    },
    playerNumber10: {
        type: 'container',
        landscape: {
            x: 695,
            y: 265
        },
        portrait: {
            x: 730,
            y: 265
        }
    },
    playerNumber11: {
        type: 'container',
        landscape: {
            x: 275,
            y: 360
        },
        portrait: {
            x: 229,
            y: 360
        }
    },
    playerNumber12: {
        type: 'container',
        landscape: {
            x: 395,
            y: 360
        },
        portrait: {
            x: 370,
            y: 360
        }
    },
    playerNumber13: {
        type: 'container',
        landscape: {
            x: 515,
            y: 360
        },
        portrait: {
            x: 515,
            y: 360
        }
    },
    playerNumber14: {
        type: 'container',
        landscape: {
            x: 635,
            y: 360
        },
        portrait: {
            x: 660,
            y: 360
        }
    },
    playerNumber15: {
        type: 'container',
        landscape: {
            x: 755,
            y: 360
        },
        portrait: {
            x: 798,
            y: 360
        }
    },
    playerNumber16: {
        type: 'container',
        landscape: {
            x: 215,
            y: 455
        },
        portrait: {
            x: 154,
            y: 455
        }
    },
    playerNumber17: {
        type: 'container',
        landscape: {
            x: 335,
            y: 455
        },
        portrait: {
            x: 300,
            y: 455
        }
    },
    playerNumber18: {
        type: 'container',
        landscape: {
            x: 455,
            y: 455
        },
        portrait: {
            x: 442,
            y: 455
        }
    },
    playerNumber19: {
        type: 'container',
        landscape: {
            x: 575,
            y: 455
        },
        portrait: {
            x: 586,
            y: 455
        }
    },
    playerNumber20: {
        type: 'container',
        landscape: {
            x: 695,
            y: 455
        },
        portrait: {
            x: 730,
            y: 455
        }
    },
    playerNumber21: {
        type: 'container',
        landscape: {
            x: 275,
            y: 550
        },
        portrait: {
            x: 229,
            y: 550
        }
    },
    playerNumber22: {
        type: 'container',
        landscape: {
            x: 395,
            y: 550
        },
        portrait: {
            x: 370,
            y: 550
        }
    },
    playerNumber23: {
        type: 'container',
        landscape: {
            x: 515,
            y: 550
        },
        portrait: {
            x: 515,
            y: 550
        }
    },
    playerNumber24: {
        type: 'container',
        landscape: {
            x: 635,
            y: 550
        },
        portrait: {
            x: 660,
            y: 550
        }
    },
    playerNumber25: {
        type: 'container',
        landscape: {
            x: 755,
            y: 550
        },
        portrait: {
            x: 798,
            y: 550
        }
    },
    /////////////////////////////////////////////////////
    /////// COLLECT BONUS
    ///////////////////////////////////////////////
    CollectBonusContainer: {
        type: 'container',
        children: ['pickerContainer', 'collectInfoContainer']
    },
    pickerContainer: {
        type: 'container',
        children: ['picker_1', 'picker_2', 'picker_3', 'picker_4', 'picker_5', 'picker_6', 'picker_7', 'picker_8', 'picker_9'],
        landscape: {
            x: 170,
            y: 240
        },
        portrait: {
            x: 134,
            y: 760
        }
    },
    picker_1: {
        type: 'container',
        landscape: {
            x: 0,
            y: 0
        },
        portrait: {
            x: 0,
            y: 0
        }
    },
    picker_2: {
        type: 'container',
        landscape: {
            x: 275,
            y: 0
        },
        portrait: {
            x: 275,
            y: 0
        }
    },
    picker_3: {
        type: 'container',
        landscape: {
            x: 550,
            y: 0
        },
        portrait: {
            x: 550,
            y: 0
        }
    },
    picker_4: {
        type: 'container',
        landscape: {
            x: 0,
            y: 170
        },
        portrait: {
            x: 0,
            y: 170
        }
    },
    picker_5: {
        type: 'container',
        landscape: {
            x: 275,
            y: 170
        },
        portrait: {
            x: 275,
            y: 170
        }
    },
    picker_6: {
        type: 'container',
        landscape: {
            x: 550,
            y: 170
        },
        portrait: {
            x: 550,
            y: 170
        }
    },
    picker_7: {
        type: 'container',
        landscape: {
            x: 0,
            y: 340
        },
        portrait: {
            x: 0,
            y: 340
        }
    },
    picker_8: {
        type: 'container',
        landscape: {
            x: 275,
            y: 340
        },
        portrait: {
            x: 275,
            y: 340
        }
    },
    picker_9: {
        type: 'container',
        landscape: {
            x: 550,
            y: 340
        },
        portrait: {
            x: 550,
            y: 340
        }
    },
    collectInfoContainer: {
        type: 'container',
        children: ['collectInfoLogoGlow', 'collectInfoLogo', 'collectInfoText', 'collectInfoTextGradient', 'collectInfoSprite', 'collectInfoTotalWinHeader', 'collectInfoTotalWinSpineAnimContainer', 'collectInfoTotalWinValue', 'collectInfoTotalWinValue1', 'collectInfoRevealAllButton'],
        landscape: {
            x: 1125,
            y: 130
        },
        portrait: {
            x: 385,
            y: 160
        }
    },
    collectInfoLogoGlow: {
        //TODO remove it
        alpha: 0,
        visible: false,
        renderable: false,
        type: 'container',
        x: 0,
        y: 0
    },
    collectInfoLogo: {
        type: 'sprite',
        texture: 'PrizeBonusLogo',
        anchor: 0.5,
        landscape: {
            scale: 1.1,
            x: 45
        },
        portrait: {
            scale: 1.3,
            x: 40
        },
        y: 10
    },
    collectInfoText: {
        type: 'text',
        string: 'collectBonusInfo',
        style: 'collectBonusInfo',
        y: 164,
        x: -50,
        maxWidth: 300
    },
    collectInfoTextGradient: {
        type: 'text',
        string: 'collectBonusInfo',
        style: 'collectBonusInfoGradient',
        y: 164,
        x: -50,
        maxWidth: 300
    },
    collectInfoSprite: {
        type: 'container',
        landscape: {
            x: -150,
            scale: 0.8
        },
        portrait: {
            x: -160
        },
        y: 213
    },
    collectInfoTotalWinHeader: {
        type: 'text',
        string: 'collectBonusTotalWin',
        style: 'collectBonusTotalWin',
        landscape: {
            x: 34
        },
        portrait: {
            x: 24
        },
        y: 300,
        anchor: {
            x: 0.5,
            y: 0
        },
        maxWidth: 409
    },
    collectInfoTotalWinSpineAnimContainer: {
        scale: 0.75,
        type: 'container',
        x: 24,
        y: 460
    },
    collectInfoTotalWinValue: {
        type: 'text',
        style: 'totalWinValue',
        anchor: 0.5,
        x: 24,
        y: 450,
        portrait: {
            maxWidth: 700
        },
        landscape: {
            maxWidth: 400
        }
    },
    collectInfoTotalWinValue1: {
        type: 'text',
        style: 'totalWinValueGradient',
        anchor: 0.5,
        x: 24,
        y: 450,
        portrait: {
            maxWidth: 700
        },
        landscape: {
            maxWidth: 400
        }
    },
    collectInfoRevealAllButton: {
        type: 'button',
        string: 'button_autoPlayCollectBonus',
        landscape: {
            x: 34,
            y: 570
        },
        portrait: {
            x: 20,
            y: 1133
        },
        maxWidth: 230,
        textures: {
            enabled: 'buyButtonEnabled',
            over: 'buyButtonOver',
            pressed: 'buyButtonPressed',
            disabled: 'buyButtonDisabled'
        },
        style: {
            enabled: 'buyButtonEnabled',
            over: 'buyButtonOver',
            pressed: 'buyButtonPressed',
            disabled: 'buyButtonDisabled'
        }
    },
    /////////////////////////////////////////////////////
    /////// WHEEL BONUS
    ///////////////////////////////////////////////
    WheelBonusContainer: {
        type: 'container',
        children: ['wheelBonusLogo', 'bonusWheelContainer', 'bonusWheelContainerPortrait', 'wheelBonusInfo', 'wheelBonusWinInfo', 'wheelBonusWinInfoPortrait']
    },
    bonusWheelContainer: {
        type: 'container',
        children: ['wheelWinUptoLandscapeContainer', 'bonusWheel'],
        x: 20,
        y: 385
    },
    bonusWheelContainerPortrait: {
        type: 'container',
        children: ['wheelWinUptoPortraitContainer'],
        x: 405,
        y: 1322
    },
    wheelWinUptoLandscapeContainer: {
        type: 'container',
        anchor: 0.5,
        landscape: {
            x: 1157,
            y: 30
        }
    },
    wheelWinUptoPortraitContainer: {
        type: 'container',
        anchor: 0.5,
        landscape: {
            x: 0,
            y: -940
        }
    },
    bonusWheel: {
        type: 'sprite',
        children: ['wheelGlow', 'wheelBack', 'innerWheel', 'innerWheelParticles', 'outerWheel', 'wheelRim', 'outerWheelParticles', 'wheelCenter', 'wheelWinWindow', 'wheelShine'],
        landscape: {
            y: 0,
            scale: 1,
            rotation: 0
        },
        portrait: {
            y: 94,
            scale: 1.1,
            rotation: -1.5708
        }
    },
    wheelBonusInfo: {
        type: 'sprite',
        children: ['wheelWinUpto', 'wheelSpinButton', 'wheelSpinButtonGradient'],
        anchor: 0.5,
        landscape: {
            x: 924,
            y: 400
        },
        portrait: {
            x: 405,
            y: 0
        }
    },
    wheelWinUpto: {
        type: 'sprite',
        children: ['wheelWinUptoLine1', 'wheelWinUptoLine2', 'wheelWinUptoLine2Gradient'],
        anchor: 0.5,
        landscape: {
            x: 0,
            y: 0,
            scale: 1
        },
        portrait: {
            x: 0,
            y: 0,
            scale: 1.1
        }
    },
    wheelWinUptoLine1: {
        type: 'sprite',
        anchor: 0.5
    },
    wheelWinUptoLine2: {
        type: 'text',
        string: 'winUpToText',
        style: 'wheelWinUpToLine2Text',
        anchor: 0.5,
        maxWidth: 480,
        x: 8,
        landscape: {
            y: 88
        },
        portrait: {
            y: 88
        }
    },
    wheelWinUptoLine2Gradient: {
        type: 'text',
        string: 'winUpToText',
        style: 'wheelWinUpToLine2TextGradient',
        anchor: 0.5,
        maxWidth: 480,
        x: 8,
        landscape: {
            y: 88
        },
        portrait: {
            y: 88
        }
    },
    wheelSpinButton: {
        type: 'button',
        string: 'button_wheel',
        landscape: {
            x: 1158,
            y: 320
        },
        portrait: {
            x: 0,
            y: -35
        },
        maxWidth: 230,
        textures: {
            enabled: 'buyButtonEnabled',
            over: 'buyButtonOver',
            pressed: 'buyButtonPressed',
            disabled: 'buyButtonDisabled'
        },
        style: {
            enabled: 'wheelRevealEnabled',
            over: 'wheelRevealOver',
            pressed: 'wheelRevealPressed',
            disabled: 'wheelRevealEnabled'
        }
    },
    wheelSpinButtonGradient: {
        type: 'button',
        string: 'button_wheel',
        landscape: {
            x: 1158,
            y: 320
        },
        portrait: {
            x: 0,
            y: -35
        },
        maxWidth: 230,
        style: {
            enabled: 'wheelRevealEnabledGradient',
            over: 'wheelRevealOverGradient',
            pressed: 'wheelRevealPressedGradient',
            disabled: 'wheelRevealEnabledGradient'
        }
    },
    wheelBonusWinInfo: {
        type: 'sprite',
        visible: false,
        alpha: 0,
        children: ['wheelWinTop', 'wheelWinDivider', 'wheelWinBottom'],
        anchor: 0,
        landscape: {
            x: 925,
            y: 315
        },
        portrait: {
            x: 165,
            y: 300
        }
    },
    wheelBonusWinInfoPortrait: {
        type: 'sprite',
        visible: false,
        alpha: 0,
        anchor: 0,
        landscape: {
            x: 776,
            y: 315
        },
        portrait: {
            x: 173,
            y: 300
        }
    },
    wheelWinTop: {
        type: 'sprite',
        children: ['wheelWinPrizeLabel', 'wheelWinMultiplierLabel', 'wheelWinMultiplierLabelGradient', 'wheelWinPrizeValue', 'wheelWinPrizeValueGradient', 'wheelWinMultiplierValue'],
        anchor: 0,
        landscape: {
            x: 0,
            y: 18
        },
        portrait: {
            x: 0,
            y: 18
        }
    },
    wheelWinPrizeLabel: {
        type: 'text',
        string: '',
        style: 'wheelBonusTotalWinLabel',
        anchor: {
            x: 0,
            y: 0.5
        },
        maxWidth: 330,
        landscape: {
            x: -1,
            y: 20
        },
        portrait: {
            x: 3,
            y: 20
        }
    },
    wheelWinMultiplierLabel: {
        type: 'text',
        string: '',
        style: 'wheelBonusTotalWinLabel',
        anchor: {
            x: 0,
            y: 0.5
        },
        maxWidth: 330,
        landscape: {
            x: -1,
            y: 95
        },
        portrait: {
            x: 3,
            y: 95
        }
    },
    wheelWinMultiplierLabelGradient: {
        type: 'text',
        string: '',
        style: 'wheelBonusTotalWinLabelGradient',
        anchor: {
            x: 0,
            y: 0.5
        },
        maxWidth: 330,
        landscape: {
            x: -1,
            y: 95
        },
        portrait: {
            x: 3,
            y: 95
        }
    },
    wheelWinPrizeValue: {
        type: 'text',
        string: '',
        style: 'wheelWinPrizeValue',
        anchor: {
            x: 1,
            y: 0.5
        },
        maxWidth: 200,
        landscape: {
            x: 464,
            y: 20
        },
        portrait: {
            x: 464,
            y: 20
        }
    },
    wheelWinPrizeValueGradient: {
        type: 'text',
        string: '',
        style: 'wheelWinPrizeValueGradient',
        anchor: {
            x: 1,
            y: 0.5
        },
        maxWidth: 200,
        landscape: {
            x: 464,
            y: 20
        },
        portrait: {
            x: 464,
            y: 20
        }
    },
    wheelWinMultiplierValue: {
        type: 'text',
        string: '',
        style: 'wheelWinMultiplierValue',
        anchor: {
            x: 1,
            y: 0.5
        },
        maxWidth: 200,
        landscape: {
            x: 464,
            y: 95
        },
        portrait: {
            x: 464,
            y: 95
        }
    },
    wheelWinBottom: {
        type: 'sprite',
        children: ['wheelTotalWinGlow', 'wheelTotalWinLabel', 'wheelTotalWinValue', 'wheelTotalWinValueGradient'],
        anchor: 0.5,
        landscape: {
            x: 235,
            y: 240
        },
        portrait: {
            x: 235,
            y: 222
        }
    },
    wheelTotalWinLabel: {
        type: 'text',
        string: '',
        style: 'wheelBonusTotalWinLabel',
        anchor: 0.5,
        maxWidth: 550
    },
    wheelTotalWinValue: {
        type: 'text',
        string: '',
        style: 'totalWinValue',
        anchor: 0.5,
        maxWidth: 550,
        x: 0,
        y: 95
    },
    wheelTotalWinValueGradient: {
        type: 'text',
        string: '',
        style: 'totalWinValueGradient',
        anchor: 0.5,
        maxWidth: 550,
        x: 0,
        y: 95
    },
    wheelTotalWinGlow: {
        type: 'sprite',
        scale: 0.75,
        anchor: 0.5,
        x: 0,
        y: 100
    },
    wheelWinDivider: {
        texture: 'wheelBonusWinDivider',
        type: 'sprite',
        anchor: 0.5,
        landscape: {
            x: 238,
            y: 175
        },
        portrait: {
            x: 238,
            y: 168
        }
    },
    wheelGlow: {
        type: 'sprite',
        anchor: 0.5,
        x: 0,
        y: 100
    },
    wheelBack: {
        type: 'sprite',
        anchor: 0.5,
        texture: 'static-wheel'
    },
    wheelRim: {
        type: 'sprite',
        anchor: 0.5,
        texture: 'rim'
    },
    innerWheel: {
        type: 'container',
        children: ['innerWheelTexture', 'wheelPrizeValues']
    },
    innerWheelTexture: {
        type: 'sprite',
        anchor: 0.5,
        texture: 'inner-wheel',
        rotation: 0.15
    },
    innerWheelParticles: {
        type: 'sprite',
        anchor: 0.5,
        scale: 1,
        x: 460,
        y: 0
    },
    outerWheel: {
        type: 'container',
        children: ['outerWheelTexture', 'wheelMultiplierValues']
    },
    outerWheelTexture: {
        type: 'sprite',
        anchor: 0.5,
        texture: 'outer-wheel',
        rotation: 0.15
    },
    outerWheelParticles: {
        type: 'sprite',
        anchor: 0.5,
        x: 582,
        y: 15
    },
    wheelPrizeValues: {
        type: 'container'
    },
    wheelMultiplierValues: {
        type: 'container'
    },
    wheelCenter: {
        type: 'sprite',
        anchor: 0.5,
        texture: 'wheel-center'
    },
    wheelWinWindow: {
        type: 'sprite',
        anchor: 0.5,
        texture: 'wheel-selector',
        x: 400,
        y: -5
    },
    wheelShine: {
        type: 'sprite',
        anchor: 0.5,
        x: 356,
        y: 0
    },
    wheelBonusLogo: {
        type: 'sprite',
        children: ['wheelBonusLogoGlow', 'wheelBonusLogoText'],
        landscape: {
            scale: 1.3,
            x: 1185,
            y: 150
        },
        portrait: {
            scale: 1.5,
            x: 430,
            y: 150
        }
    },
    wheelBonusLogoAsset: {
        type: 'sprite',
        texture: 'wheel-bonus-symbol',
        anchor: 0.5,
        y: -45,
        landscape: {
            scale: 0.9
        },
        portrait: {
            scale: 0.9
        }
    },
    wheelBonusLogoText: {
        type: 'sprite',
        anchor: 0.5
    },
    wheelBonusLogoGlow: {
        //TODO remove it
        alpha: 0,
        type: 'sprite',
        anchor: 0.5,
        landscape: {
            x: 0,
            y: 25
        },
        portrait: {
            x: 0,
            y: 25
        }
    },
    bonusPrize1Win: {
        type: 'container',
        children: ['bonusPrize1WinIn', 'bonusPrize1WinOut']
    },
    bonusPrize1NoWin: {
        type: 'container',
        children: ['bonusPrize1NoWinIn', 'bonusPrize1NoWinOut']
    },
    bonusPrize2Win: {
        type: 'container',
        children: ['bonusPrize2WinIn', 'bonusPrize2WinOut']
    },
    bonusPrize2NoWin: {
        type: 'container',
        children: ['bonusPrize2NoWinIn', 'bonusPrize2NoWinOut']
    },
    bonusPrize3Win: {
        type: 'container',
        children: ['bonusPrize3WinIn', 'bonusPrize3WinOut']
    },
    bonusPrize3NoWin: {
        type: 'container',
        children: ['bonusPrize3NoWinIn', 'bonusPrize3NoWinOut']
    },
    bonusPrize4Win: {
        type: 'container',
        children: ['bonusPrize4WinIn', 'bonusPrize4WinOut']
    },
    bonusPrize4NoWin: {
        type: 'container',
        children: ['bonusPrize4NoWinIn', 'bonusPrize4NoWinOut']
    },
    bonusPrize5Win: {
        type: 'container',
        children: ['bonusPrize5WinIn', 'bonusPrize5WinOut']
    },
    bonusPrize5NoWin: {
        type: 'container',
        children: ['bonusPrize5NoWinIn', 'bonusPrize5NoWinOut']
    },
    bonusPrize6Win: {
        type: 'container',
        children: ['bonusPrize6WinIn', 'bonusPrize6WinOut']
    },
    bonusPrize6NoWin: {
        type: 'container',
        children: ['bonusPrize6NoWinIn', 'bonusPrize6NoWinOut']
    },
    bonusPrize1WinIn: {
        type: 'text',
        style: 'bonusWin',
        anchor: 0.5,
        maxWidth: 550
    },
    bonusPrize1NoWinIn: {
        type: 'text',
        style: 'bonusNoWin',
        anchor: 0.5,
        maxWidth: 550
    },
    bonusPrize1WinOut: {
        type: 'text',
        style: 'bonusWin',
        anchor: 0.5,
        maxWidth: 550
    },
    bonusPrize1NoWinOut: {
        type: 'text',
        style: 'bonusNoWin',
        anchor: 0.5,
        maxWidth: 550
    },
    bonusPrize2WinIn: {
        type: 'text',
        style: 'bonusWin',
        anchor: 0.5,
        maxWidth: 550
    },
    bonusPrize2NoWinIn: {
        type: 'text',
        style: 'bonusNoWin',
        anchor: 0.5,
        maxWidth: 550
    },
    bonusPrize2WinOut: {
        type: 'text',
        style: 'bonusWin',
        anchor: 0.5,
        maxWidth: 550
    },
    bonusPrize2NoWinOut: {
        type: 'text',
        style: 'bonusNoWin',
        anchor: 0.5,
        maxWidth: 550
    },
    bonusPrize3WinIn: {
        type: 'text',
        style: 'bonusWin3',
        anchor: 0.5,
        maxWidth: 550
    },
    bonusPrize3NoWinIn: {
        type: 'text',
        style: 'bonusNoWin3',
        anchor: 0.5,
        maxWidth: 550
    },
    bonusPrize3WinOut: {
        type: 'text',
        style: 'bonusWin3',
        anchor: 0.5,
        maxWidth: 550
    },
    bonusPrize3NoWinOut: {
        type: 'text',
        style: 'bonusNoWin3',
        anchor: 0.5,
        maxWidth: 550
    },
    bonusPrize4WinIn: {
        type: 'text',
        style: 'bonusWin4',
        anchor: 0.5,
        maxWidth: 550
    },
    bonusPrize4NoWinIn: {
        type: 'text',
        style: 'bonusNoWin4',
        anchor: 0.5,
        maxWidth: 550
    },
    bonusPrize4WinOut: {
        type: 'text',
        style: 'bonusWin4',
        anchor: 0.5,
        maxWidth: 550
    },
    bonusPrize4NoWinOut: {
        type: 'text',
        style: 'bonusNoWin4',
        anchor: 0.5,
        maxWidth: 550
    },
    bonusPrize5WinIn: {
        type: 'text',
        style: 'bonusWin5',
        anchor: 0.5,
        maxWidth: 550
    },
    bonusPrize5NoWinIn: {
        type: 'text',
        style: 'bonusNoWin5',
        anchor: 0.5,
        maxWidth: 550
    },
    bonusPrize5WinOut: {
        type: 'text',
        style: 'bonusWin5',
        anchor: 0.5,
        maxWidth: 550
    },
    bonusPrize5NoWinOut: {
        type: 'text',
        style: 'bonusNoWin5',
        anchor: 0.5,
        maxWidth: 550
    },
    bonusPrize6WinIn: {
        type: 'text',
        style: 'bonusWin6',
        anchor: 0.5,
        maxWidth: 550
    },
    bonusPrize6NoWinIn: {
        type: 'text',
        style: 'bonusNoWin6',
        anchor: 0.5,
        maxWidth: 550
    },
    bonusPrize6WinOut: {
        type: 'text',
        style: 'bonusWin6',
        anchor: 0.5,
        maxWidth: 550
    },
    bonusPrize6NoWinOut: {
        type: 'text',
        style: 'bonusNoWin6',
        anchor: 0.5,
        maxWidth: 550
    },

    /*
     * How To Play
     */
    howToPlayPages: {
        type: 'container',
        children: ['howToPlayPage1Container', 'howToPlayPage2Container', 'howToPlayPage3Container']
    },
    howToPlayPage1Container: {
        type: 'container',
        children: ['howToPlayPage1Title', 'howToPlayPage1textContainer']
    },
    howToPlayPage2Container: {
        type: 'container',
        children: ['howToPlayPage2Title', 'howToPlayPage2TitleText', 'howToPlayPage2textContainer']
    },
    howToPlayPage3Container: {
        type: 'container',
        children: ['howToPlayPage3Title', 'howToPlayPage3TitleText', 'howToPlayPage3textContainer']
    },
    howToPlayPage1Title: {
        type: 'text',
        string: 'howToPlayTitle',
        style: 'howToPlayTitle',
        anchor: 0.5,
        landscape: {
            x: 720,
            y: 210
        },
        portrait: {
            x: 405,
            y: 280
        }
    },
    howToPlayPage1textContainer: {
        type: 'container',
        landscape: {
            x: 305,
            y: -120
        },
        portrait: {
            x: 0,
            y: 0
        },
        children: ['howToPlayPage1text_1', 'howToPlayPage1text_2', 'howToPlayPage1text_3']
    },
    howToPlayPage1text_1: {
        type: 'text',
        landscape: {
            x: 405,
            y: 400,
            style: 'howToPlayText',
            anchor: 0.5
        },
        portrait: {
            x: 405,
            y: 420,
            style: 'howToPlayTextCenter',
            anchor: 0.5
        }
    },
    howToPlayPage1text_2: {
        type: 'text',
        landscape: {
            x: 405,
            y: 440,
            style: 'howToPlayText',
            anchor: 0.5
        },
        portrait: {
            x: 405,
            y: 540,
            style: 'howToPlayTextCenter',
            anchor: 0.5
        }
    },
    howToPlayPage1text_3: {
        type: 'text',
        landscape: {
            x: 405,
            y: 580,
            style: 'howToPlayText',
            anchor: 0.5
        },
        portrait: {
            x: 405,
            y: 700,
            style: 'howToPlayTextCenter',
            anchor: 0.5
        }
    },
    howToPlayPage2Title: {
        type: 'sprite',
        children: ['howToPlayPage2TitleAsset', 'howToPlayPage2TitleAssetText'],
        anchor: 0.5,
        landscape: {
            x: 720,
            y: 280,
            scale: 1.5
        },
        portrait: {
            x: 405,
            y: 450,
            scale: 1
        }
    },
    howToPlayPage2TitleAssetText: {
        type: 'sprite',
        texture: 'wheel-bonus-text',
        scale: 0.45,
        anchor: 0.5
    },
    howToPlayPage2TitleAsset: {
        type: 'sprite',
        texture: 'WheelBonusLogo',
        anchor: 0.5,
        y: -50,
        landscape: {
            scale: 0.45
        },
        portrait: {
            scale: 0.75
        }
    },
    howToPlayPage2TitleText: {
        type: 'text',
        string: 'howToPlayTitle',
        style: 'howToPlayTitle',
        anchor: 0.5,
        landscape: {
            x: 720,
            y: 210,
            visible: false
        },
        portrait: {
            x: 405,
            y: 280,
            visible: true
        }
    },
    howToPlayPage2textContainer: {
        type: 'container',
        children: ['howToPlayPage2text_1', 'howToPlayPage2text_2']
    },
    howToPlayPage2text_1: {
        type: 'text',
        landscape: {
            x: 405,
            y: 320,
            style: 'howToPlayText',
            anchor: 0
        },
        portrait: {
            x: 405,
            y: 530,
            style: 'howToPlayTextCenter',
            anchor: 0.5
        }
    },
    howToPlayPage2text_2: {
        type: 'text',
        style: 'howToPlayTextCenter',
        landscape: {
            x: 720,
            y: 440
        },
        portrait: {
            x: 405,
            y: 770
        },
        anchor: 0.5
    },
    howToPlayPage3Title: {
        type: 'sprite',
        children: ['howToPlayPage3TitleAsset', 'howToPlayPage3TitleAssetText'],
        anchor: 0.5,
        landscape: {
            x: 720,
            y: 280,
            scale: 1.5
        },
        portrait: {
            x: 405,
            y: 450,
            scale: 1
        }
    },
    howToPlayPage3TitleAsset: {
        type: 'sprite',
        texture: 'PrizeBonusLogo',
        anchor: 0.5,
        y: -50,
        landscape: {
            scale: 0.45
        },
        portrait: {
            scale: 0.75
        }
    },
    howToPlayPage3TitleAssetText: {
        type: 'sprite',
        texture: 'collect-bonus-text',
        scale: 0.45,
        anchor: 0.5
    },
    howToPlayPage3TitleText: {
        type: 'text',
        string: 'howToPlayTitle',
        style: 'howToPlayTitle',
        anchor: 0.5,
        landscape: {
            x: 720,
            y: 210,
            visible: false
        },
        portrait: {
            x: 405,
            y: 280,
            visible: true
        }
    },
    howToPlayPage3text_1: {
        type: 'text',
        style: 'howToPlayText',
        landscape: {
            x: 405,
            y: 320,
            anchor: 0
        },
        portrait: {
            x: 405,
            y: 530,
            style: 'howToPlayTextCenter',
            anchor: 0.5
        }
    },
    howToPlayPage3text_2: {
        type: 'text',
        style: 'howToPlayTextCenter',
        landscape: {
            x: 720,
            y: 440
        },
        portrait: {
            x: 405,
            y: 800
        },
        anchor: 0.5
    },
    howToPlayPage3textContainer: {
        type: 'container',
        children: ['howToPlayPage3text_1', 'howToPlayPage3text_2']
    },

    /*
     * UI Panel
     */
    buttonBar: {
        type: 'container',
        landscape: {
            x: 0,
            y: 655
        },
        portrait: {
            x: 0,
            y: 1250
        },
        children: ['helpButtonStatic', 'helpButton', 'homeButtonStatic', 'homeButton', 'exitButton', 'playAgainButton', 'tryAgainButton', 'buyButton', 'buyButtonAnim', 'tryButton', 'tryButtonAnim', 'moveToMoneyButton', 'retryButton']
    },

    /*Componant overrides - start */
    exitButton: {
        type: 'button',
        landscape: {
            x: 1155,
            y: 50
        },
        portrait: {
            x: 405,
            y: 50
        },
        string: 'button_exit',
        textures: {
            enabled: 'mainButtonEnabled',
            over: 'mainButtonOver',
            pressed: 'mainButtonPressed',
            disabled: 'mainButtonDisabled'
        },
        style: {
            enabled: 'mainButtonEnabled',
            over: 'mainButtonOver',
            pressed: 'mainButtonPressed',
            disabled: 'mainButtonDisabled'
        }
    },
    helpButton: {
        type: 'button',
        landscape: {
            x: 1378,
            y: -330
        },
        portrait: {
            x: 755,
            y: 50
        },
        textures: {
            enabled: 'tutorialButtonEnabled',
            disabled: 'tutorialButtonDisabled',
            over: 'tutorialButtonOver',
            pressed: 'tutorialButtonPressed'
        }
    },
    helpButtonStatic: {
        type: 'sprite',
        anchor: 0.5,
        landscape: {
            x: 1378,
            y: -330
        },
        portrait: {
            x: 755,
            y: 50
        },
        texture: 'tutorialButtonDisabled'
    },
    homeButton: {
        type: 'button',
        landscape: {
            x: 942,
            y: -330
        },
        portrait: {
            x: 55,
            y: 50
        },
        textures: {
            enabled: 'homeButtonEnabled',
            over: 'homeButtonOver',
            pressed: 'homeButtonPressed',
            disabled: 'homeButtonDisabled'
        }
    },
    homeButtonStatic: {
        type: 'sprite',
        anchor: 0.5,
        landscape: {
            x: 942,
            y: -330
        },
        portrait: {
            x: 55,
            y: 50
        },
        texture: 'homeButtonDisabled'
    },
    buy_default: {
        type: 'point',
        landscape: {
            x: 1160,
            y: 40
        },
        portrait: {
            x: 405,
            y: 40
        }
    },
    try_default: {
        type: 'point',
        landscape: {
            x: 1160,
            y: 40
        },
        portrait: {
            x: 555,
            y: 50
        }
    },
    buy_multi: {
        type: 'point',
        landscape: {
            x: 1160,
            y: 40
        },
        portrait: {
            x: 405,
            y: 40
        }
    },
    try_multi: {
        type: 'point',
        landscape: {
            x: 1022,
            y: 40
        },
        portrait: {
            x: 555,
            y: 50
        }
    },
    playForMoney_multi: {
        type: 'point',
        landscape: {
            x: 1292,
            y: 40
        },
        portrait: {
            x: 255,
            y: 50
        }
    },
    try_fixed: {
        type: 'point',
        landscape: {
            x: 1299,
            y: 50
        },
        portrait: {
            x: 555,
            y: 50
        }
    },
    playForMoney_default: {
        type: 'point',
        landscape: {
            x: 1019,
            y: 50
        },
        portrait: {
            x: 255,
            y: 50
        }
    },

    /*Componant overrides - end */
    buyButtonAnim: {
        type: 'sprite',
        anchor: 0.5
    },
    tryButtonAnim: {
        type: 'sprite',
        anchor: 0.5
    },
    footerContainer: {
        type: 'container',
        children: ['footerBG', 'balanceMeter', 'ticketCostMeter', 'winMeter', 'divider_1_3', 'divider_2_3', 'divider_1_2'],
        landscape: {
            y: 761
        },
        portrait: {
            y: 1349
        }
    },
    footerBG: {
        type: 'sprite',
        landscape: {
            texture: 'landscape_footerBar',
            y: 5
        },
        portrait: {
            texture: 'portrait_footerBar',
            y: 5
        }
    },
    autoPlayButton_default: {
        type: 'point',
        landscape: {
            x: 1160,
            y: 695
        },
        portrait: {
            x: 405,
            y: 1297
        }
    },
    autoPlayButton_multi: {
        type: 'point',
        landscape: {
            x: 1160,
            y: 695
        },
        portrait: {
            x: 405,
            y: 1297
        }
    },
    howToPlayContainer: {
        type: 'container',
        children: ['howToPlayOverlay', 'howToPlayBackground', 'howToPlayPages', 'versionText', 'audioButtonContainer', 'howToPlayPrevious', 'howToPlayNext', 'howToPlayClose', 'howToPlayIndicators']
    },
    howToPlayBackground: {
        type: 'sprite',
        anchor: {
            x: 0.5
        },
        landscape: {
            x: 720,
            y: 90,
            texture: 'landscape_tutorialBackground'
        },
        portrait: {
            x: 405,
            y: 168,
            texture: 'portrait_tutorialBackground'
        }
    },
    versionText: {
        type: 'text',
        style: 'versionText',
        x: 44,
        landscape: {
            y: 129
        },
        portrait: {
            y: 221
        },
        alpha: 0.5
    },
    howToPlayClose: {
        type: 'button',
        string: 'button_ok',
        landscape: {
            x: 720,
            y: 658
        },
        portrait: {
            x: 405,
            y: 1071
        },
        textures: {
            enabled: 'tutorialOKButtonEnabled',
            over: 'tutorialOKButtonOver',
            pressed: 'tutorialOKButtonPressed'
        },
        style: {
            enabled: 'tutorialOKButtonEnabled',
            over: 'tutorialOKButtonOver',
            pressed: 'tutorialOKButtonPressed'
        }
    },
    howToPlayPrevious: {
        type: 'button',
        landscape: {
            x: 100,
            y: 418
        },
        portrait: {
            x: 74,
            y: 682
        },
        textures: {
            enabled: 'tutorialLeftButtonEnabled',
            over: 'tutorialLeftButtonOver',
            pressed: 'tutorialLeftButtonPressed'
        }
    },
    howToPlayNext: {
        type: 'button',
        landscape: {
            x: 1345,
            y: 418
        },
        portrait: {
            x: 736,
            y: 682
        },
        textures: {
            enabled: 'tutorialRightButtonEnabled',
            over: 'tutorialRightButtonOver',
            pressed: 'tutorialRightButtonPressed'
        }
    },
    howToPlayIndicators: {
        type: 'container',
        children: ['howToPlayIndicatorActive', 'howToPlayIndicatorInactive'],
        landscape: {
            x: 720,
            y: 581
        },
        portrait: {
            x: 405,
            y: 999
        }
    },
    howToPlayIndicatorActive: {
        type: 'sprite',
        texture: 'tutorialPageIndicatorActive'
    },
    howToPlayIndicatorInactive: {
        type: 'sprite',
        texture: 'tutorialPageIndicatorInactive'
    },
    audioButtonContainer: {
        type: 'container',
        landscape: {
            x: 92,
            y: 664
        },
        portrait: {
            x: 71,
            y: 1071
        }
    },
    resultPlaquesContainer: {
        type: 'container',
        children: ['resultPlaqueOverlay', 'winPlaqueGlow', 'winPlaqueBG', 'winPlaqueMessageContainer', 'winPlaqueValue1', 'winPlaqueValue', 'winPlaqueCloseButton', 'losePlaqueBG', 'losePlaqueMessage', 'losePlaqueMessageWithGradient', 'losePlaqueCloseButton'],
        landscape: {
            x: 720,
            y: 377
        },
        portrait: {
            x: 405,
            y: 678
        }
    },
    resultPlaqueOverlay: {
        type: 'sprite',
        anchor: 0.5,
        y: -114
    },
    winPlaqueMessageContainer: {
        type: 'container',
        children: ['winPlaqueMessage', 'winPlaqueMessageWithGradient'],
        alpha: 0,
        landscape: {
            y: 0,
            x: 0
        },
        portrait: {
            y: 0,
            x: 0
        }
    },
    winPlaqueMessage: {
        type: 'text',
        string: 'message_win',
        style: 'winPlaqueBody',
        anchor: 0.5,
        landscape: {
            maxWidth: 450,
            y: -70
        },
        portrait: {
            maxWidth: 380,
            y: -40
        }
    },
    winPlaqueMessageWithGradient: {
        type: 'text',
        string: 'message_win',
        style: 'winPlaqueBodyWithGradient',
        anchor: 0.5,
        landscape: {
            maxWidth: 450,
            y: -70
        },
        portrait: {
            maxWidth: 380,
            y: -40
        }
    },
    winPlaqueValue: {
        type: 'text',
        style: 'totalWinValue',
        anchor: 0.5,
        maxWidth: 600,
        landscape: {
            y: 32,
            scale: 1
        },
        portrait: {
            y: 60,
            scale: 0.9
        }
    },
    winPlaqueValue1: {
        type: 'text',
        style: 'totalWinValueGradient',
        anchor: 0.5,
        maxWidth: 600,
        landscape: {
            y: 32,
            scale: 1
        },
        portrait: {
            y: 60,
            scale: 0.9
        }
    },
    winPlaqueBG: {
        type: 'sprite',
        anchor: 0.5,
        landscape: {
            texture: 'landscape_endOfGameMessageNoWinBackground',
            scale: 1,
            y: -5
        },
        portrait: {
            texture: 'portrait_endOfGameMessageNoWinBackground',
            scale: 0.9,
            y: 25
        },
        alpha: 0
    },
    winPlaqueGlow: {
        type: 'sprite',
        anchor: 0.5,
        landscape: {
            y: -32,
            scale: 1.05
        },
        portrait: {
            y: 10,
            scale: 1
        }
    },
    winPlaqueCloseButton: {
        type: 'button',
        alpha: 0,
        landscape: {
            textures: {
                enabled: 'landscape_endOfGameMessageNoWinBackground',
                over: 'landscape_endOfGameMessageNoWinBackground',
                pressed: 'landscape_endOfGameMessageNoWinBackground'
            },
            scale: 1.2,
            y: 0
        },
        portrait: {
            textures: {
                enabled: 'portrait_endOfGameMessageNoWinBackground',
                over: 'portrait_endOfGameMessageNoWinBackground',
                pressed: 'portrait_endOfGameMessageNoWinBackground'
            },
            scale: 0.82,
            y: 25
        }
    },
    losePlaqueMessage: {
        type: 'text',
        string: 'message_nonWin',
        style: 'losePlaqueBody',
        anchor: 0.5,
        alpha: 0,
        portrait: {
            y: 15,
            maxWidth: 600
        },
        landscape: {
            y: -10,
            maxWidth: 600
        }
    },
    losePlaqueMessageWithGradient: {
        type: 'text',
        string: 'message_nonWin',
        style: 'losePlaqueBodyWithGradient',
        anchor: 0.5,
        alpha: 0,
        portrait: {
            y: 15,
            maxWidth: 600
        },
        landscape: {
            y: -10,
            maxWidth: 600
        }
    },
    losePlaqueCloseButton: {
        type: 'button',
        alpha: 0,
        landscape: {
            textures: {
                enabled: 'landscape_endOfGameMessageNoWinBackground',
                over: 'landscape_endOfGameMessageNoWinBackground',
                pressed: 'landscape_endOfGameMessageNoWinBackground'
            }
        },
        portrait: {
            textures: {
                enabled: 'portrait_endOfGameMessageNoWinBackground',
                over: 'portrait_endOfGameMessageNoWinBackground',
                pressed: 'portrait_endOfGameMessageNoWinBackground'
            }
        }
    },
    buyButton: {
        type: 'button',
        string: 'button_buy',
        landscape: {
            x: 1146
        },
        maxWidth: 230,
        textures: {
            enabled: 'buyButtonEnabled',
            over: 'buyButtonOver',
            pressed: 'buyButtonPressed',
            disabled: 'buyButtonDisabled'
        },
        style: {
            enabled: 'buyButtonEnabled',
            over: 'buyButtonOver',
            pressed: 'buyButtonPressed',
            disabled: 'buyButtonDisabled'
        }
    },
    tryButton: {
        type: 'button',
        string: 'button_try',
        landscape: {
            x: 1299
        },
        maxWidth: 230,
        textures: {
            enabled: 'buyButtonEnabled',
            over: 'buyButtonOver',
            pressed: 'buyButtonPressed',
            disabled: 'buyButtonDisabled'
        },
        style: {
            enabled: 'buyButtonEnabled',
            over: 'buyButtonOver',
            pressed: 'buyButtonPressed',
            disabled: 'buyButtonDisabled'
        }
    },
    moveToMoneyButton: {
        type: 'button',
        string: 'button_moveToMoney',
        landscape: {
            x: 1019
        },
        textures: {
            enabled: 'mainButtonEnabled',
            over: 'mainButtonOver',
            pressed: 'mainButtonPressed',
            disabled: 'mainButtonDisabled'
        },
        style: {
            enabled: 'mainButtonEnabled',
            over: 'mainButtonOver',
            pressed: 'mainButtonPressed',
            disabled: 'mainButtonDisabled'
        }
    },
    ticketSelectBarSmall: {
        type: 'container',
        landscape: {
            x: 1156,
            y: 592
        },
        portrait: {
            x: 405,
            y: 1197
        },
        children: ['ticketSelectBarBG', 'ticketSelectCostValue', 'ticketCostDownButtonStatic', 'ticketCostUpButtonStatic', 'ticketCostDownButton', 'ticketCostUpButton', 'ticketCostIndicators']
    },
    ticketSelectCostValue: {
        type: 'text',
        portrait: {
            y: -4
        },
        landscape: {
            y: -4
        },
        anchor: 0.5,
        style: 'ticketSelectCostValue'
    },
    ticketCostDownButton: {
        type: 'button',
        landscape: {
            x: -208,
            y: 1
        },
        portrait: {
            x: -208,
            y: 1
        },
        textures: {
            enabled: 'minusButtonEnabled',
            disabled: 'minusButtonDisabled',
            over: 'minusButtonOver',
            pressed: 'minusButtonPressed'
        }
    },
    ticketCostUpButton: {
        type: 'button',
        landscape: {
            x: 208,
            y: 1
        },
        portrait: {
            x: 208,
            y: 1
        },
        textures: {
            enabled: 'plusButtonEnabled',
            disabled: 'plusButtonDisabled',
            over: 'plusButtonOver',
            pressed: 'plusButtonPressed'
        }
    },
    ticketCostDownButtonStatic: {
        type: 'sprite',
        anchor: 0.5,
        landscape: {
            x: -208,
            y: 1
        },
        portrait: {
            x: -208,
            y: 1
        },
        texture: 'minusButtonDisabled'
    },
    ticketCostUpButtonStatic: {
        type: 'sprite',
        anchor: 0.5,
        landscape: {
            x: 208,
            y: 1
        },
        portrait: {
            x: 208,
            y: 1
        },
        texture: 'plusButtonDisabled'
    },
    ticketCostIndicators: {
        type: 'container',
        children: ['ticketCostIndicatorActive', 'ticketCostIndicatorInactive'],
        portrait: {
            y: 15
        },
        landscape: {
            y: 15
        }
    },
    errorMessage: {
        type: 'text',
        style: 'errorMessage',
        anchor: 0.5,
        wordWrap: true,
        landscape: {
            x: 720,
            y: 360,
            wordWrapWidth: 750
        },
        portrait: {
            x: 405,
            y: 640,
            wordWrapWidth: 700
        }
    },
    errorExit: {
        type: 'button',
        string: 'button_exit',
        landscape: {
            x: 720,
            y: 560
        },
        portrait: {
            x: 405,
            y: 870
        },
        style: {
            enabled: 'errorButtonEnabled',
            over: 'errorButtonOver',
            pressed: 'errorButtonPressed'
        },
        textures: {
            enabled: 'timeOutButtonEnabled',
            over: 'timeOutButtonOver',
            pressed: 'timeOutButtonPressed'
        }
    },
    timeoutExit: {
        type: 'button',
        landscape: {
            x: 585,
            y: 560
        },
        portrait: {
            x: 270,
            y: 870
        },
        style: {
            enabled: 'errorButtonEnabled',
            over: 'errorButtonOver',
            pressed: 'errorButtonPressed'
        },
        textures: {
            enabled: 'timeOutButtonEnabled',
            over: 'timeOutButtonOver',
            pressed: 'timeOutButtonPressed'
        }
    },
    timeoutContinue: {
        type: 'button',
        landscape: {
            x: 855,
            y: 560
        },
        portrait: {
            x: 540,
            y: 870
        },
        style: {
            enabled: 'errorButtonEnabled',
            over: 'errorButtonOver',
            pressed: 'errorButtonPressed'
        },
        textures: {
            enabled: 'timeOutButtonEnabled',
            over: 'timeOutButtonOver',
            pressed: 'timeOutButtonPressed'
        }
    },
    losePlaqueBG: {
        type: 'sprite',
        anchor: 0.5,
        y: 5,
        landscape: {
            texture: 'landscape_endOfGameMessageNoWinBackground',
            scale: 1
        },
        portrait: {
            texture: 'portrait_endOfGameMessageNoWinBackground',
            scale: 0.9
        },
        alpha: 0
    },
    extraUI: {
        type: 'container',
        children: ['bonusHelpButton']
    },
    bonusHelpButton: {
        type: 'button',
        landscape: {
            x: 1380,
            y: 700
        },
        portrait: {
            x: 755,
            y: 1299
        },
        textures: {
            enabled: 'tutorialButtonEnabled',
            disabled: 'tutorialButtonDisabled',
            over: 'tutorialButtonOver',
            pressed: 'tutorialButtonPressed'
        }
    }
});
//# sourceMappingURL=layout.js.map