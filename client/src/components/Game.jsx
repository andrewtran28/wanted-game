import { useState, useEffect, useCallback, useRef } from "react";
import Scoreboard from "./Scoreboard";
import Canvas from "./Canvas";
import GameOverModal from "./GameOverModal";
import Leaderboard from "./Leaderboard";
import { canvasSize, imgArr, difficulty } from "../utils/gameConfig";
import { selectTarget, randomExcluding, addIcon } from "../utils/randomize";
import "../styles/Game.css";

function Game() {
  const [icons, setIcons] = useState([]);
  const [iconQueue, setIconQueue] = useState([]);
  const [target, setTarget] = useState(null);
  const [loading, setLoading] = useState(false);
  const [level, setLevel] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isPaused, setIsPaused] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const gameContainerRef = useRef(null);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

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
      addIcon(iconQueue[0], iconQueue[0] === imgArr[target], icons, setIcons, level);
      setIconQueue((prev) => prev.slice(1));
      if (iconQueue.length === 1) setLoading(false);
    }, 1);

    return () => clearTimeout(timeout);
  }, [iconQueue]);

  useEffect(() => {
    if (!loading) setIsPaused(false);
  }, [loading]);

  const nextLevel = useCallback(() => {
    const newLevel = level + 1;
    const { iconNum } = difficulty(newLevel);
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

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      gameContainerRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div id="web-layout">
      <div id="game-cont" ref={gameContainerRef} className={isFullscreen ? "fullscreen" : ""}>
        <button className="btn-fullscreen" onClick={toggleFullscreen}>
          {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
        </button>

        {!gameStarted ? (
          <>
            <Scoreboard level={"1"} timeLeft={timeLeft} target={target} score={"00000000"} />
            <div id="canvas" style={{ width: canvasSize, height: canvasSize }}>
              <button className="btn-start" onClick={startGame}>
                Start Game
              </button>
            </div>
          </>
        ) : (
          <div className={`canvas-container ${isGameOver ? "canvas-disabled" : ""}`}>
            <Scoreboard level={level} timeLeft={timeLeft} target={target} score={score} />

            <Canvas
              icons={icons}
              loading={loading}
              level={level}
              setIsPaused={setIsPaused}
              timeLeft={timeLeft}
              setTimeLeft={setTimeLeft}
              setScore={setScore}
              nextRound={() => nextLevel()}
            />
            {isGameOver && <GameOverModal score={score} level={level} onContinue={continueGame} />}
          </div>
        )}
      </div>

      <Leaderboard />
    </div>
  );
}

export default Game;
