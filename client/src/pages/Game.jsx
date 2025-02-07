import { v4 as uuidv4 } from "uuid";
import { useState, useEffect } from "react";
import Scoreboard from "../components/Scoreboard";
import Canvas from "../components/Canvas"; // Import the Canvas component
import "../styles/Canvas.css";

function Game() {
  const [icons, setIcons] = useState([]);
  const [target, setTarget] = useState(null);
  const [loading, setLoading] = useState(false);
  const [iconQueue, setIconQueue] = useState([]);
  const [points, setPoints] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30.0); // Timer starts at 30.00 seconds

  const [isPaused, setIsPaused] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  const iconWidth = 75;
  const iconHeight = 78 / (107 / iconWidth);
  const canvasSize = 500;
  const maxAttempts = 250; // Limit attempts to prevent infinite loops
  const OVERLAP_THRESHOLD = 0.5; // Adjust threshold value between 0 and 1

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
    return Math.floor(Math.random() * imgArr.length);
  };

  const randomExcluding = (excludedNum) => {
    let randomNum;
    do {
      randomNum = Math.floor(Math.random() * imgArr.length);
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

  const resetCanvas = () => {
    const newTarget = selectTarget();
    setTarget(newTarget);
    setIcons([]);
    setLoading([false]);

    // Set length to higher for higher difficulty.
    const newQueue = [imgArr[newTarget], ...Array.from({ length: 50 }, () => imgArr[randomExcluding(newTarget)])];
    setIconQueue(newQueue);
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

      <Scoreboard points={points} timeLeft={timeLeft} target={target} resetCanvas={resetCanvas} imgArr={imgArr} />

      {loading ? (
        <div id="canvas" style={{ width: canvasSize, height: canvasSize }}>
          Loading..
        </div>
      ) : (
        <Canvas
          icons={icons}
          setTimeLeft={setTimeLeft}
          canvasSize={canvasSize}
          iconWidth={iconWidth}
          iconHeight={iconHeight}
          resetCanvas={resetCanvas}
          target={target}
          setIsPaused={setIsPaused}
          setTarget={setTarget}
          imgArr={imgArr}
          randomExcluding={randomExcluding}
          setIconQueue={setIconQueue}
          setLoading={setLoading}
        />
      )}
    </div>
  );
}

export default Game;
