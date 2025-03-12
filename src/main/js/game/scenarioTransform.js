define((require) => {
  const prizeData = require('skbJet/componentManchester/standardIW/prizeData');

  return function scenarioTransform(scenarioString) {

    // split the string into the four components; winning, player numbers, picker bonus, wheel bonus
    const [winningString, playerString, prizeBonusString, wheelBonusString] = scenarioString.split('|');

    // winning numbers are just a comma seperated list of numbers
    const winningNumbers = winningString.split(',').map(int => parseInt(int, 10));

    const bonusLookup = {
      "U" : 'WheelBonus',
      "T" : "CollectBonus"
    };
    
    let bonusData = {
      prizeBonus : false,
      prizeBonusAwards : null,
      wheelBonus : false,
      wheelTotalPrize : null,
      wheelCashPrize : null,
      wheelMultiplier : null
    };

    if(wheelBonusString !== ''){
      let wheelChunks = wheelBonusString.split('*');
      bonusData.wheelBonus = true;
      bonusData.wheelCashPrize = prizeData.prizeTable[wheelChunks[0]];
      bonusData.wheelTotalPrize = prizeData.prizeTable[wheelChunks[0]] * Number(wheelChunks[1]) ;
      bonusData.wheelCode = wheelChunks[0];
      bonusData.wheelMultiplier = wheelChunks[1]+"x";
    }

    if(prizeBonusString !== ''){
      bonusData.prizeBonus = true;
      bonusData.prizeBonusAwards = prizeBonusString.split(',');
    }

    // player numbers are a list of key:value pairs describing a number and its associated prize
    const playerPairs = playerString.split(',');
    
    const playerNumbers = playerPairs.map((pair) => {

      let numberOrSymbol;
      let prize = null;

      if(pair.indexOf(':') > -1){
        let prizeChunks = pair.split(':');
        numberOrSymbol = !isNaN(prizeChunks[0]) ? parseInt(prizeChunks[0],10) : prizeChunks[0];
        prize = prizeData.prizeTable[prizeChunks[1]];
      }
      else {
        numberOrSymbol = bonusLookup[pair];
      }

      return [
          numberOrSymbol,
          prize
        ];
    });

    return {
      winningNumbers,      
      playerNumbers,
      bonusData
    };
  };
});