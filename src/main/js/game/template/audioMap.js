define({
    // IMPLEMENT: Map SFX to channels

    /* 
     * If audio assets are named nicely you can do:
     * {
     *  fileName: channelNumber
     * }
     * 
     * Otherwise use a nice name for the keys and include the filename and channel as an array:
     * {
     *  soundName: ['Ugly_sound_file_V2-final', channelNumber]
     * }
     */

    music: ['BackgroundMusicLoop', 12],
    bonusMusic: ['BonusMusicLoop', 0],

    numberMatch_1 : ['NumberMatch',1],
    numberMatch_2 : ['NumberMatch',2],
    numberMatch_3 : ['NumberMatch',11],

    winTerminator: ['BackgroundMusicTerm_WIN', 1],
    loseTerminator: ['BackgroundMusicTerm_LOSE', 1],
    click: ['UI_Click', 4],
    costDown: ['BetDown', 1],
    costUp: ['BetUp', 2],
    buy: ['BuyButton', 2],
    costMax: ['BetMax', 3],

    /*
     * Audio groups
     * A game can include multiple variations of each of these sounds. Ensure each variation starts
     * with the same name plus some kind of ordered suffix. Each time a sound group plays the next 
     * item in the group will be used.
     */
    playerNumber_1: ['YourNumberSelect_1', 3],
    playerNumber_2: ['YourNumberSelect_2', 4],
    playerNumber_3: ['YourNumberSelect_3', 5],
    playerNumber_4: ['YourNumberSelect_4', 6],
    playerNumber_5: ['YourNumberSelect_5', 7],

    winningNumber_1: ['LuckyNumberSelect_1', 3],
    winningNumber_2: ['LuckyNumberSelect_2', 4],
    winningNumber_3: ['LuckyNumberSelect_3', 5],
    winningNumber_4: ['LuckyNumberSelect_2', 4],
    winningNumber_5: ['LuckyNumberSelect_1', 3],

    revealAllLuckyNumbers: ['LuckyNumberSelect__RevealAll',6],

    revealAllYourNumbers_1: ['YourNumberSelect_RevealAll',13],
    revealAllYourNumbers_2: ['YourNumberSelect_RevealAll',14],
    revealAllYourNumbers_3: ['YourNumberSelect_RevealAll',15],
    revealAllYourNumbers_4: ['YourNumberSelect_RevealAll',16],
    revealAllYourNumbers_5: ['YourNumberSelect_RevealAll',17],
    revealAllYourNumbers_6: ['YourNumberSelect_RevealAll',18],

    instantWin:['InstantWin',9],
    instantWin2X:['InstantWin2x',10],

    spinStart: ['SpinButton', 1],

    transition:['Transition',4],

    wheelBonusTransition:['WheelBonusTransition',5],
    wheelBonusRevealed:['WheelBonusReveal',7],
    wheelBonusTriggered:['WheelBonusTriggered',10],
    wheelBonusWin:['WheelCashWin',11],

    prizeBonusTransition:['PrizeBonusTransition',8],
    prizeBonusRevealed:['PrizeBonusReveal',9],
    prizeBonusTriggered:['PrizeBonusTriggered',9],
    prizeBonusWin:['Collect',1],

    GoldBar_1:['GoldBar1',1],
    GoldBar_2:['GoldBar2',2],
    GoldBar_3:['GoldBar3',3],
    GoldBar_4:['GoldBar4',4],
    GoldBar_5:['GoldBar5',5],
    GoldBar_6:['GoldBar6',6],
    GoldBar_7:['GoldBar7',7],
    GoldBar_8:['GoldBar8',8],
    GoldBar_9:['GoldBar9',9],
    AllGoldBars:['9_GoldBars',11],

    collect:['Collect',1],
    bagDrop:['BagDrop',11],
    MultiplierWin:['WheelMultiplierWin',8],
});
