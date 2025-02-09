function difficulty(level) {
  const settings = [
    { range: [1, 3], iconWidth: 150, iconNum: 5, overlapThreshold: 1 },
    { range: [4, 5], iconWidth: 125, iconNum: 11, overlapThreshold: 0.75 },
    { range: [6, 7], iconWidth: 125, iconNum: 17, overlapThreshold: 0.75 },
    { range: [8, 9], iconWidth: 100, iconNum: 25, overlapThreshold: 0.75 },
    { range: [10, 14], iconWidth: 90, iconNum: 35, overlapThreshold: 0.7 },
    { range: [15, 19], iconWidth: 80, iconNum: 50, overlapThreshold: 0.65 },
    { range: [20, 24], iconWidth: 75, iconNum: 80, overlapThreshold: 0.6 },
    { range: [25, 29], iconWidth: 75, iconNum: 90, overlapThreshold: 0.5 },
    { range: [30, 39], iconWidth: 70, iconNum: 100, overlapThreshold: 0.45 },
    { range: [40, 49], iconWidth: 65, iconNum: 150, overlapThreshold: 0.45 },
    { range: [50, Infinity], iconWidth: 60, iconNum: 150, overlapThreshold: 0.4 }, // 35+
  ];

  const config = settings.find(({ range }) => level >= range[0] && level <= range[1]) || settings[0];

  return {
    iconWidth: config.iconWidth,
    iconNum: config.iconNum,
    overlapThreshold: config.overlapThreshold,
  };
}

export default difficulty;
