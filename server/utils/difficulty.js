const { v4: uuidv4 } = require("uuid");
const { imgArr, selectTarget, randomExcluding } = require("../utils/randomize");

const difficulty = (level) => {
  const settings = [
    { range: [1, 3], iconWidth: 150, iconNum: 5, overlapThreshold: 1, scoreBonus: 1 },
    { range: [4, 5], iconWidth: 125, iconNum: 11, overlapThreshold: 0.75, scoreBonus: 1 },
    { range: [6, 7], iconWidth: 125, iconNum: 17, overlapThreshold: 0.75, scoreBonus: 1 },
    { range: [8, 9], iconWidth: 100, iconNum: 25, overlapThreshold: 0.75, scoreBonus: 1 },
    { range: [10, 14], iconWidth: 90, iconNum: 35, overlapThreshold: 0.7, scoreBonus: 1.25 },
    { range: [15, 19], iconWidth: 80, iconNum: 50, overlapThreshold: 0.65, scoreBonus: 1.25 },
    { range: [20, 24], iconWidth: 75, iconNum: 80, overlapThreshold: 0.6, scoreBonus: 1.5 },
    { range: [25, 29], iconWidth: 75, iconNum: 90, overlapThreshold: 0.5, scoreBonus: 1.5 },
    { range: [30, 39], iconWidth: 70, iconNum: 100, overlapThreshold: 0.45, scoreBonus: 2 },
    { range: [40, 49], iconWidth: 65, iconNum: 150, overlapThreshold: 0.45, scoreBonus: 3 },
    { range: [50, Infinity], iconWidth: 60, iconNum: 150, overlapThreshold: 0.4, scoreBonus: 5 },
  ];

  const config = settings.find(({ range }) => level >= range[0] && level <= range[1]) || settings[0];

  return {
    canvasSize: 500,
    iconWidth: config.iconWidth,
    iconHeight: 78 / (107 / config.iconWidth),
    iconNum: config.iconNum,
    overlapThreshold: config.overlapThreshold,
    scoreBonus: config.scoreBonus,
  };
};

const isOverlapping = (x, y, icons, iconWidth, iconHeight, overlapThreshold) => {
  return icons.some(
    (icon) =>
      Math.abs(icon.x - x) < iconWidth * overlapThreshold && Math.abs(icon.y - y) < iconHeight * overlapThreshold
  );
};

function generateIcons(level) {
  const { iconNum, iconWidth, iconHeight, overlapThreshold, canvasSize } = difficulty(level);
  const targetIndex = selectTarget();
  let icons = [];

  // Place target icon first
  for (let attempts = 0; attempts < 250; attempts++) {
    const x = Math.random() * (canvasSize - iconWidth);
    const y = Math.random() * (canvasSize - iconHeight);
    if (!isOverlapping(x, y, icons, iconWidth, iconHeight, overlapThreshold)) {
      icons.push({ id: uuidv4(), x, y, imgPath: imgArr[targetIndex], isTarget: true });
      break;
    }
  }

  // Place remaining non-target icons
  for (let i = 0; i < iconNum; i++) {
    for (let attempts = 0; attempts < 250; attempts++) {
      const nonTargetIndex = randomExcluding(targetIndex);
      const x = Math.random() * (canvasSize - iconWidth);
      const y = Math.random() * (canvasSize - iconHeight);
      if (!isOverlapping(x, y, icons, iconWidth, iconHeight, overlapThreshold)) {
        icons.push({ id: uuidv4(), x, y, imgPath: imgArr[nonTargetIndex], isTarget: false });
        break;
      }
    }
  }

  return { icons, targetIndex };
}

module.exports = generateIcons;
