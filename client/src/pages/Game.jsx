import { v4 as uuidv4 } from "uuid";
import { useState, useEffect } from "react";
import Scoreboard from "../components/Scoreboard";
import Canvas from "../components/Canvas";
import GameOverModal from "../components/GameOverModal"; // Import the Modal component
import { imgArr, selectTarget, randomExcluding } from "../utils/randomize";
import difficulty from "../utils/difficulty";
import "../styles/Canvas.css";

function Game() {
  const [icons, setIcons] = useState([]);
  const [target, setTarget] = useState(null);
  const [loading, setLoading] = useState(false);
  const [iconQueue, setIconQueue] = useState([]);
  const [level, setLevel] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30.0);
  const [isPaused, setIsPaused] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);

  const { iconWidth, iconNum, overlapThreshold } = difficulty(level);

  const iconHeight = 78 / (107 / iconWidth);
  const canvasSize = 500;
  const maxAttempts = 250;

  useEffect(() => {
    setTarget(selectTarget());
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) {
      gameOver();
      return;
    }

    if (isPaused || !gameStarted) return;

    let startTime = Date.now();
    let prevTime = timeLeft;

    const updateTime = () => {
      const elapsed = (Date.now() - startTime) / 1000;
      setTimeLeft(Math.max(0, prevTime - elapsed));
    };

    const interval = setInterval(updateTime, 100);
    return () => clearInterval(interval);
  }, [timeLeft, isPaused, gameStarted]);

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

  const isOverlapping = (x, y) => {
    return icons.some((icon) => {
      const dx = Math.abs(icon.x - x);
      const dy = Math.abs(icon.y - y);
      return dx < iconWidth * overlapThreshold && dy < iconHeight * overlapThreshold;
    });
  };

  const addIcon = (imgPath, isTarget) => {
    let x, y;
    let attempts = 0;

    do {
      x = Math.random() * (canvasSize - iconWidth);
      y = Math.random() * (canvasSize - iconHeight);
      attempts++;
    } while (isOverlapping(x, y) && attempts < maxAttempts);

    if (attempts >= maxAttempts) {
      console.log(`Level: ${level}: No more valid spots available!`);
    } else {
      const id = uuidv4();

      setIcons((prevIcons) => {
        return [...prevIcons, { isTarget, id, x, y, imgPath }];
      });
    }
  };

  // const resetCanvas = () => {
  //   const newTarget = selectTarget();
  //   setlevel((prevlevel) => prevlevel + 1);
  //   setTarget(newTarget);
  //   setIcons([]);
  //   setLoading(true);

  //   const newQueue = [imgArr[newTarget], ...Array.from({ length: iconNum }, () => imgArr[randomExcluding(newTarget)])];
  //   setIconQueue(newQueue);
  // };

  const resetCanvas = () => {
    const newLevel = level + 1; // Calculate next level
    setLevel(newLevel);

    const { iconWidth, iconNum } = difficulty(newLevel); // Get difficulty for new level

    const newTarget = selectTarget();
    setTarget(newTarget);
    setIcons([]);
    setLoading(true);

    const newQueue = [imgArr[newTarget], ...Array.from({ length: iconNum }, () => imgArr[randomExcluding(newTarget)])];
    setIconQueue(newQueue);
  };

  const startGame = () => {
    setGameStarted(true);
    setLevel(1);
    setTimeLeft(30);
    resetCanvas();
  };

  const gameOver = () => {
    setIsGameOver(true); // Show the modal
  };

  const continueGame = () => {
    setGameStarted(false);
    setLevel(0);
    setTimeLeft(30); // Reset time to prevent gameOver() from triggering again
    setIsGameOver(false); // Hide the modal
  };

  return (
    <div>
      {!gameStarted ? (
        <button className="btn-start" onClick={startGame}>
          Start Game
        </button>
      ) : (
        <>
          <div className={`canvas-container ${isGameOver ? "canvas-disabled" : ""}`}>
            <Scoreboard level={level} timeLeft={timeLeft} target={target} resetCanvas={resetCanvas} imgArr={imgArr} />

            <Canvas
              icons={icons}
              canvasSize={canvasSize}
              iconWidth={iconWidth}
              iconHeight={iconHeight}
              loading={loading}
              setIsPaused={setIsPaused}
              setTimeLeft={setTimeLeft}
              nextRound={() => resetCanvas()}
            />
            {isGameOver && <GameOverModal score={level} onContinue={continueGame} />}
          </div>
        </>
      )}
    </div>
  );
}

export default Game;
