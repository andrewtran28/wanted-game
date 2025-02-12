const canvasSize = 500;

const imgArr = [
  "penguins/Aurora.png",
  "penguins/Wade.png",
  "penguins/Roald.png",
  "penguins/Chabwick.png",
  "penguins/Flo.png",
  "penguins/Gwen.png",
];

function difficulty(level) {
  const settings = [
    { range: [1, 3], iconWidth: 150, iconNum: 5, overlapThreshold: 1, scoreBonus: 1 },
    { range: [4, 5], iconWidth: 125, iconNum: 11, overlapThreshold: 0.75, scoreBonus: 1 },
    { range: [6, 7], iconWidth: 125, iconNum: 17, overlapThreshold: 0.75, scoreBonus: 1 },
    { range: [8, 9], iconWidth: 100, iconNum: 25, overlapThreshold: 0.75, scoreBonus: 1 },
    { range: [10, 14], iconWidth: 90, iconNum: 35, overlapThreshold: 0.7, scoreBonus: 1.1 },
    { range: [15, 19], iconWidth: 80, iconNum: 50, overlapThreshold: 0.65, scoreBonus: 1.1 },
    { range: [20, 24], iconWidth: 75, iconNum: 80, overlapThreshold: 0.6, scoreBonus: 1.25 },
    { range: [25, 29], iconWidth: 75, iconNum: 90, overlapThreshold: 0.5, scoreBonus: 1.25 },
    { range: [30, 39], iconWidth: 70, iconNum: 100, overlapThreshold: 0.45, scoreBonus: 1.5 },
    { range: [40, 49], iconWidth: 65, iconNum: 150, overlapThreshold: 0.45, scoreBonus: 2 },
    { range: [50, Infinity], iconWidth: 60, iconNum: 175, overlapThreshold: 0.4, scoreBonus: 3 },
  ];

  const config = settings.find(({ range }) => level >= range[0] && level <= range[1]) || settings[0];

  return {
    iconWidth: config.iconWidth,
    iconHeight: 78 / (107 / config.iconWidth),
    iconNum: config.iconNum,
    overlapThreshold: config.overlapThreshold,
    scoreBonus: config.scoreBonus,
  };
}

export { canvasSize, imgArr, difficulty };
