import { v4 as uuidv4 } from "uuid";
import { useState, useEffect } from "react";
import Scoreboard from "../components/Scoreboard";
import Canvas from "../components/Canvas";
import { imgArr, selectTarget, randomExcluding } from "../utils/randomize";
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

  // const gameOver = () => {
  //   setPoints(0);
  //   return;
  // };

  return (
    <div>
      {!gameStarted ? (
        <button className="btn-start" onClick={startGame}>
          Start Game
        </button>
      ) : (
        <>
          <Scoreboard points={points} timeLeft={timeLeft} target={target} resetCanvas={resetCanvas} imgArr={imgArr} />

          <Canvas
            icons={icons}
            canvasSize={canvasSize}
            iconWidth={iconWidth}
            iconHeight={iconHeight}
            loading={loading}
            setIsPaused={setIsPaused}
            setTimeLeft={setTimeLeft}
            scorePoint={() => setPoints((prevPoints) => prevPoints + 1)}
            nextRound={() => resetCanvas()}
          />
        </>
      )}
    </div>
  );
}

export default Game;
