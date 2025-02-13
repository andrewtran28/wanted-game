import { v4 as uuidv4 } from "uuid";
import { canvasSize, imgArr, difficulty } from "./gameConfig";

const selectTarget = () => {
  return Math.floor(Math.random() * imgArr.length);
};

const randomExcluding = (excludedNum) => {
  let randomNum;
  do {
    randomNum = Math.floor(Math.random() * imgArr.length);
  } while (randomNum === excludedNum);

  return randomNum;
};

const isOverlapping = (x, y, icons, level) => {
  const { iconWidth, iconHeight, overlapThreshold } = difficulty(level);
  return icons
    .filter((icon) => Math.abs(icon.x - x) < iconWidth * 2 && Math.abs(icon.y - y) < iconHeight * 2)
    .some(
      (icon) =>
        Math.abs(icon.x - x) < iconWidth * overlapThreshold && Math.abs(icon.y - y) < iconHeight * overlapThreshold
    );
};

const addIcon = (imgPath, isTarget, icons, setIcons, level) => {
  const { iconWidth, iconHeight } = difficulty(level);
  for (let attempts = 0; attempts < 250; attempts++) {
    const x = Math.random() * (canvasSize - iconWidth);
    const y = Math.random() * (canvasSize - iconHeight);

    if (!isOverlapping(x, y, icons, level)) {
      setIcons((prev) => [...prev, { isTarget, id: uuidv4(), x, y, imgPath }]);
      return;
    }
  }
};

export { imgArr, selectTarget, randomExcluding, isOverlapping, addIcon };
