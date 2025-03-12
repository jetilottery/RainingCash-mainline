define({
  // Optional config in which to overrid configuration options from the template. Alternatively
  // place options in i18n/default/default/config.json to override at skin level.

  resultParticleConfig: {
    level1: {
      enabled: false,
      landscape: {speed: {start: 1100, end: 1500, minimumSpeedMultiplier: 1}, frequency: 0.12, scale: {start: 0.74, end: 0.78, minimumScaleMultiplier: 0.74}, emitterLifetime: 2},
      portrait: {speed: {start: 1100, end: 1500, minimumSpeedMultiplier: 1}, frequency: 0.12, scale: {start: 0.74, end: 0.78, minimumScaleMultiplier: 0.74}, emitterLifetime: 2}
    },
    level2: {
      enabled: true,
      landscape: {rotationSpeed: {min: -90, max: 90}, acceleration: {x: 0, y: 400}, speed: {start: 800, end: 400, minimumSpeedMultiplier: 0.8}, frequency: 0.005, scale: {start: 0.94, end: 1.45, minimumScaleMultiplier: 0.94}, emitterLifetime: 0.35},
      portrait: {rotationSpeed: {min: -90, max: 90}, acceleration: {x: 0, y: 400}, speed: {start: 1000, end: 400, minimumSpeedMultiplier: 0.8}, frequency: 0.005, scale: {start: 0.94, end: 1.45, minimumScaleMultiplier: 0.94}, emitterLifetime: 0.35}
    },
    level3: {
      enabled: true,
      landscape: {rotationSpeed: {min: -90, max: 90}, acceleration: {x: 0, y: 400}, speed: {start: 800, end: 400, minimumSpeedMultiplier: 0.8}, frequency: 0.003, scale: {start: 0.94, end: 1.45, minimumScaleMultiplier: 0.94}, emitterLifetime: 0.35},
      portrait: {rotationSpeed: {min: -90, max: 90}, acceleration: {x: 0, y: 400}, speed: {start: 1000, end: 400, minimumSpeedMultiplier: 0.8}, frequency: 0.003, scale: {start: 0.94, end: 1.45, minimumScaleMultiplier: 0.94}, emitterLifetime: 0.35}
    }
  },

});
