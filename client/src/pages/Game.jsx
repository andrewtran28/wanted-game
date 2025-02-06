import { useState, useEffect } from "react";
import "../styles/Canvas.css";

function Game() {
  const [icons, setIcons] = useState([]);
  const [target, setTarget] = useState(null);
  const iconSize = 75;
  const canvasSize = 500;
  const maxAttempts = 500; // Limit attempts to prevent infinite loops
  const OVERLAP_THRESHOLD = 0.5; // Adjust threshold value between 0 and 1

  const TOTAL_ICONS = 6;
  const imgArr = [
    "penguins/Aurora.png",
    "penguins/Wade.png",
    "penguins/Roald.png",
    "penguins/Chabwick.png",
    "penguins/Flo.png",
    "penguins/Gwen.png",
  ];

  const selectTarget = () => {
    return Math.floor(Math.random() * TOTAL_ICONS);
  };

  useEffect(() => {
    setTarget(selectTarget());
  }, [target]);

  const randomExcluding = (excludedNum) => {
    let randomNum;
    do {
      randomNum = Math.floor(Math.random() * TOTAL_ICONS);
    } while (randomNum === excludedNum);

    return randomNum;
  };

  // Function to check if a new position overlaps with existing icons
  const isOverlapping = (x, y) => {
    return icons.some((icon) => {
      const dx = Math.abs(icon.x - x);
      const dy = Math.abs(icon.y - y);
      return dx < iconSize * OVERLAP_THRESHOLD && dy < iconSize * OVERLAP_THRESHOLD;
    });
  };

  const resetCanvas = () => {
    setTarget(selectTarget());
    setIcons([]);
  };

  const addIcon = (imgPath) => {
    let x, y;
    let attempts = 0;

    do {
      x = Math.random() * (canvasSize - iconSize);
      y = Math.random() * (canvasSize - iconSize);
      attempts++;
    } while (isOverlapping(x, y) && attempts < maxAttempts);

    if (attempts >= maxAttempts) {
      alert("No more valid spots available!");
      return;
    }

    setIcons([...icons, { id: Date.now(), x, y, imgPath }]);
  };

  return (
    <div>
      <div style={{ marginBottom: "10px" }}>
        <button className="btn-random" onClick={() => addIcon(imgArr[randomExcluding(target)])}>
          Add Random
        </button>
        <button className="btn-target" onClick={() => addIcon(imgArr[target])}>
          Add Target
        </button>
        <button className="btn-reset" onClick={resetCanvas}>
          Reset Canvas
        </button>
      </div>
      <div
        id="canvas"
        style={{
          width: canvasSize,
          height: canvasSize,
        }}
      >
        {icons.map((icon) => (
          <img
            className="icon"
            key={icon.id}
            src={icon.imgPath}
            style={{
              width: iconSize,
              top: `${icon.y}px`,
              left: `${icon.x}px`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default Game;
