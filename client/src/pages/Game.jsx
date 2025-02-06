import { v4 as uuidv4 } from "uuid";
import { useState, useEffect } from "react";
import "../styles/Canvas.css";

function Game() {
  const [icons, setIcons] = useState([]);
  const [target, setTarget] = useState(null);
  const [points, setPoints] = useState(0);
  const iconWidth = 75;
  const iconHeight = 78 / (100 / iconWidth);
  const canvasSize = 500;
  const maxAttempts = 250; // Limit attempts to prevent infinite loops
  const OVERLAP_THRESHOLD = 0.5; // Adjust threshold value between 0 and 1

  const [iconQueue, setIconQueue] = useState([]);

  const TOTAL_ICONS = 6;
  const imgArr = [
    "penguins/Aurora.png",
    "penguins/Wade.png",
    "penguins/Roald.png",
    "penguins/Chabwick.png",
    "penguins/Flo.png",
    "penguins/Gwen.png",
  ];

  useEffect(() => {
    setTarget(selectTarget());
  }, []);

  const selectTarget = () => {
    return Math.floor(Math.random() * TOTAL_ICONS);
  };

  const randomExcluding = (excludedNum) => {
    let randomNum;
    do {
      randomNum = Math.floor(Math.random() * TOTAL_ICONS);
    } while (randomNum === excludedNum);

    return randomNum;
  };

  const isOverlapping = (x, y) => {
    return icons.some((icon) => {
      const dx = Math.abs(icon.x - x);
      const dy = Math.abs(icon.y - y);
      return dx < iconWidth * OVERLAP_THRESHOLD && dy < iconHeight * OVERLAP_THRESHOLD;
    });
  };

  const resetCanvas = () => {
    const newTarget = selectTarget();
    setTarget(newTarget);
    setIcons([]);

    const newQueue = [imgArr[newTarget], ...Array.from({ length: 100 }, () => imgArr[randomExcluding(newTarget)])];
    setIconQueue(newQueue);
  };

  useEffect(() => {
    if (iconQueue.length > 0) {
      const timeout = setTimeout(() => {
        const iconPath = iconQueue[0];
        addIcon(iconPath, iconPath === imgArr[target]);

        setIconQueue((prevQueue) => prevQueue.slice(1));
      }, 1); // Small delay to prevent blocking

      return () => clearTimeout(timeout); // Cleanup function to prevent stacking timeouts
    }
  }, [iconQueue]);

  const addIcon = (imgPath, isTarget) => {
    let x, y;
    let attempts = 0;

    do {
      x = Math.random() * (canvasSize - iconWidth);
      y = Math.random() * (canvasSize - iconHeight);
      attempts++;
    } while (isOverlapping(x, y) && attempts < maxAttempts);

    if (attempts >= maxAttempts) {
      console.log("No more valid spots available!");
    } else {
      const id = uuidv4();

      setIcons((prevIcons) => {
        return [...prevIcons, { isTarget, id, x, y, imgPath }];
      });
    }
  };

  const handleTargetClick = (isTarget) => {
    if (isTarget) {
      setPoints(points + 1);
      resetCanvas();
      //Implment plus 3 seconds on timer.
    } else {
      //Implement minus 5 seconds on timer.
      return;
    }
  };

  return (
    <div>
      {/* Display the target image above the canvas */}
      {target !== null && (
        <div className="target-container">
          <h3>Find this penguin:</h3>
          <img src={imgArr[target]} alt="Target Icon" className="target-image" style={{ width: 100, height: "auto" }} />
        </div>
      )}
      <button className="btn-random" onClick={() => addIcon(imgArr[randomExcluding(target)], false)}>
        Add Random
      </button>
      <button className="btn-target" onClick={() => addIcon(imgArr[target], true)}>
        Add Target
      </button>
      <button className="btn-reset" onClick={resetCanvas}>
        Reset Canvas
      </button>
      <div
        id="canvas"
        style={{
          width: canvasSize,
          height: canvasSize,
        }}
      >
        {icons.map((icon) => (
          <img
            className={icon.isTarget ? "icon-target" : "icon-random"}
            key={icon.id}
            src={icon.imgPath}
            alt="icon"
            style={{
              width: iconWidth,
              top: `${icon.y}px`,
              left: `${icon.x}px`,
              position: "absolute",
              pointerEvents: icon.isTarget ? "auto" : "none",
            }}
            onClick={() => handleTargetClick(icon.isTarget)} // Add click handler
          />
        ))}
      </div>
      <h2>Points: {points}</h2> {/* Display points */}
    </div>
  );
}

export default Game;
