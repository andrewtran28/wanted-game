import { v4 as uuidv4 } from "uuid";
import { useState, useEffect } from "react";
import "../styles/Canvas.css";

function Game() {
  const [icons, setIcons] = useState([]);
  const [target, setTarget] = useState(null);
  const [loading, setLoading] = useState(false);
  const [iconQueue, setIconQueue] = useState([]);
  const [points, setPoints] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30.0); // Timer starts at 30.00 seconds
  const [highlightedTarget, setHighlightedTarget] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  const iconWidth = 75;
  const iconHeight = 78 / (107 / iconWidth);
  const canvasSize = 500;
  const maxAttempts = 250; // Limit attempts to prevent infinite loops
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

  useEffect(() => {
    setTarget(selectTarget());
  }, []);

  useEffect(() => {
    if (timeLeft <= 0 || isPaused || !gameStarted) return;

    let startTime = Date.now();
    let prevTime = timeLeft;

    const updateTime = () => {
      const elapsed = (Date.now() - startTime) / 1000;
      setTimeLeft(Math.max(0, prevTime - elapsed));
    };

    const interval = setInterval(updateTime, 100);
    return () => clearInterval(interval);
  }, [timeLeft, isPaused, gameStarted]);

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

  useEffect(() => {
    if (iconQueue.length > 0) {
      const timeout = setTimeout(() => {
        const iconPath = iconQueue[0];
        addIcon(iconPath, iconPath === imgArr[target]);

        setIconQueue((prevQueue) => prevQueue.slice(1));

        // Check if this was the last icon to be loaded
        if (iconQueue.length === 1) {
          setLoading(false); // All icons have been loaded
        }
      }, 1);

      return () => clearTimeout(timeout); // Cleanup function to prevent stacking timeouts
    }
  }, [iconQueue]);

  useEffect(() => {
    if (!loading) {
      setIsPaused(false);
    }
  }, [loading]);

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

  const handleCanvasClick = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;

    const clickedTarget = icons.find(
      (icon) =>
        icon.isTarget &&
        clickX >= icon.x &&
        clickX <= icon.x + iconWidth &&
        clickY >= icon.y &&
        clickY <= icon.y + iconHeight
    );

    if (clickedTarget) {
      highlightTarget(clickedTarget.id);
    } else {
      setTimeLeft((prevTime) => Math.max(0, prevTime - 5)); // Penalize wrong click
    }
  };

  const resetCanvas = () => {
    const newTarget = selectTarget();
    setTarget(newTarget);
    setIcons([]);
    setLoading([false]);

    //Set length to higher for higher difficulty.
    const newQueue = [imgArr[newTarget], ...Array.from({ length: 50 }, () => imgArr[randomExcluding(newTarget)])];
    setIconQueue(newQueue);
  };

  const highlightTarget = (targetId) => {
    setIsPaused(true); // Pause timer
    setHighlightedTarget(targetId); // Highlight clicked target

    setTimeout(() => {
      setHighlightedTarget(null); // Remove highlight
      resetCanvas();
    }, 2000);

    setTimeout(() => setTimeLeft((prevTime) => prevTime + 2), 250);
  };

  const startGame = () => {
    setGameStarted(true);
    setPoints(0);
    setTimeLeft(30);
    resetCanvas();
  };

  const gameOver = () => {
    setPoints(0);
    return;
  };

  return (
    <div>
      {!gameStarted && (
        <button
          className="start-button"
          onClick={startGame}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            padding: "20px 40px",
            fontSize: "24px",
            cursor: "pointer",
            zIndex: 1000,
          }}
        >
          Start Game
        </button>
      )}

      <div className="game-info">
        {target !== null && (
          <div className="target-container">
            <h3>Find this penguin:</h3>
            <img
              src={imgArr[target]}
              alt="Target Icon"
              className="target-image"
              style={{ width: 107, height: "auto" }}
            />
          </div>
        )}
        <div className="game-scoreboard">
          <span>Points: {points}</span>
          <span>Time: {timeLeft.toFixed(1)}</span>
          <button className="btn-reset" onClick={resetCanvas}>
            Reset Canvas
          </button>
        </div>
      </div>

      {loading ? (
        <div id="canvas" style={{ width: canvasSize, height: canvasSize }}>
          Loading..
        </div>
      ) : (
        <div
          id="canvas"
          onClick={handleCanvasClick}
          style={{
            width: canvasSize,
            height: canvasSize,
          }}
        >
          {icons.map((icon) => (
            <div
              key={icon.id}
              style={{
                position: "absolute",
                top: icon.y,
                left: icon.x,
                zIndex: highlightedTarget === icon.id ? 10 : 1, // Bring to front
              }}
            >
              {highlightedTarget === icon.id && (
                <div
                  className="target-highlight"
                  style={{
                    position: "absolute",
                    width: iconWidth + 10,
                    height: iconHeight + 20,
                    borderRadius: "50%",
                    border: "5px solid lime",
                    top: "-15px",
                    left: "-10px",
                    zIndex: 9,
                  }}
                />
              )}

              <img
                className={icon.isTarget ? "icon-target" : "icon-random"}
                src={icon.imgPath}
                alt="icon"
                style={{
                  width: iconWidth,
                  height: "auto",
                  position: "absolute",
                  pointerEvents: "none",
                }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Game;
