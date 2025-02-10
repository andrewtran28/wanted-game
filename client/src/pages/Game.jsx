import { v4 as uuidv4 } from "uuid";
import { useState, useEffect, useCallback } from "react";
import Scoreboard from "../components/Scoreboard";
import Canvas from "../components/Canvas";
import GameOverModal from "../components/GameOverModal";
import Leaderboard from "../components/Leaderboard";
import { imgArr, selectTarget, randomExcluding } from "../utils/randomize";
import difficulty from "../utils/difficulty";
import "../styles/Canvas.css";

function Game() {
  const [icons, setIcons] = useState([]);
  const [target, setTarget] = useState(null);
  const [loading, setLoading] = useState(false);
  const [iconQueue, setIconQueue] = useState([]);
  const [level, setLevel] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isPaused, setIsPaused] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);

  const { iconWidth, iconNum, overlapThreshold } = difficulty(level);

  const iconHeight = 78 / (107 / iconWidth);
  const canvasSize = 500;

  useEffect(() => {
    if (timeLeft <= 0) {
      gameOver();
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
    if (!iconQueue.length) return;

    const timeout = setTimeout(() => {
      addIcon(iconQueue[0], iconQueue[0] === imgArr[target]);
      setIconQueue((prev) => prev.slice(1));
      if (iconQueue.length === 1) setLoading(false);
    }, 1);

    return () => clearTimeout(timeout);
  }, [iconQueue]);

  useEffect(() => {
    if (!loading) setIsPaused(false);
  }, [loading]);

  const isOverlapping = (x, y) => {
    return icons
      .filter((icon) => Math.abs(icon.x - x) < iconWidth * 2 && Math.abs(icon.y - y) < iconHeight * 2)
      .some(
        (icon) =>
          Math.abs(icon.x - x) < iconWidth * overlapThreshold && Math.abs(icon.y - y) < iconHeight * overlapThreshold
      );
  };

  const addIcon = (imgPath, isTarget) => {
    for (let attempts = 0; attempts < 250; attempts++) {
      const x = Math.random() * (canvasSize - iconWidth);
      const y = Math.random() * (canvasSize - iconHeight);

      if (!isOverlapping(x, y)) {
        setIcons((prev) => [...prev, { isTarget, id: uuidv4(), x, y, imgPath }]);
        return;
      }
    }

    console.log(`Level ${level}: No more valid spots available!`);
  };

  const nextLevel = useCallback(() => {
    const newLevel = level + 1;
    const { iconWidth, iconNum } = difficulty(newLevel);
    const newTarget = selectTarget();
    const newQueue = [imgArr[newTarget], ...Array.from({ length: iconNum }, () => imgArr[randomExcluding(newTarget)])];

    setLevel(newLevel);
    setTarget(newTarget);
    setIcons([]);
    setLoading(true);
    setIconQueue(newQueue);
  }, [level]);

  const startGame = () => {
    setGameStarted(true);
    setLevel(1);
    setTimeLeft(30);
    setScore(0);
    nextLevel();
  };

  const gameOver = () => setTimeout(() => setIsGameOver(true), 1250);

  const continueGame = () => {
    setGameStarted(false);
    setLevel(0);
    setTimeLeft(30);
    setIsGameOver(false);
  };

  return (
    <div id="web-layout">
      <div id="game-cont">
        {!gameStarted ? (
          <div id="canvas" style={{ width: canvasSize, height: canvasSize }}>
            <button className="btn-start" onClick={startGame}>
              Start Game
            </button>
          </div>
        ) : (
          <div className={`canvas-container ${isGameOver ? "canvas-disabled" : ""}`}>
            <Scoreboard level={level} timeLeft={timeLeft} target={target} score={score} />

            <Canvas
              icons={icons}
              canvasSize={canvasSize}
              iconWidth={iconWidth}
              iconHeight={iconHeight}
              loading={loading}
              setIsPaused={setIsPaused}
              timeLeft={timeLeft}
              setTimeLeft={setTimeLeft}
              setScore={setScore} // Pass setScore to Canvas
              nextRound={() => nextLevel()}
            />
            {isGameOver && <GameOverModal score={level} onContinue={continueGame} />}
          </div>
        )}
      </div>

      <Leaderboard />
    </div>
  );
}

export default Game;
