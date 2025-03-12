define(require => {
  const SKBeInstant = require('skbJet/component/SKBeInstant/SKBeInstant');
  const resources = require('skbJet/component/pixiResourceLoader/pixiResourceLoader');

  return data => ({
    cells: {
      prizeLevel: data.division,
      description: data.division < 11 ? resources.i18n.Paytable.descriptionText1 : 
                    data.division < 25 ? resources.i18n.Paytable.descriptionText2 : resources.i18n.Paytable.descriptionText3,
      prizeValue: SKBeInstant.formatCurrency(data.prize).formattedAmount,
    },
  });
});
