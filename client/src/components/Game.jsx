import { useState, useEffect, useCallback, useRef } from "react";
import Scoreboard from "./Scoreboard";
import Canvas from "./Canvas";
import GameOverModal from "./GameOverModal";
import { canvasSize, imgArr, difficulty } from "../utils/gameConfig";
import { selectTarget, randomExcluding, addIcon } from "../utils/randomize";
import "../styles/Game.css";
import fullscreen from "../assets/fullscreen.png";
import exitScreen from "../assets/exit-fullscreen.png";

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
  const [scale, setScale] = useState(1);
  const gameContRef = useRef(null);

  useEffect(() => {
    const handleFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handleFullscreenChange);

    const updateScale = () => {
      const heightScale = window.innerHeight / (canvasSize + 240);
      const widthScale = window.innerWidth / (canvasSize + 120);
      setScale(isFullscreen ? Math.min(2, heightScale, widthScale) : 1);
    };

    updateScale();
    window.addEventListener("resize", updateScale);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      window.removeEventListener("resize", updateScale);
    };
  }, [isFullscreen]);

  useEffect(() => {
    if (timeLeft <= 0) setTimeout(() => setIsGameOver(true), 1250);
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

  const continueGame = () => {
    setGameStarted(false);
    setTarget(null);
    setLevel(0);
    setTimeLeft(30);
    setScore(0);
    setIsGameOver(false);
  };

  const toggleFullscreen = () => {
    document.fullscreenElement ? document.exitFullscreen() : gameContRef.current?.requestFullscreen();
  };

  return (
    <div id="game-cont" ref={gameContRef} className={isFullscreen ? "fullscreen" : ""}>
      <button className="btn-fullscreen" onClick={toggleFullscreen}>
        {isFullscreen ? <img src={exitScreen} width="30px" /> : <img src={fullscreen} width="30px" />}
      </button>
      <div className={`canvas-cont ${isGameOver ? "canvas-disabled" : ""}`} style={{ transform: `scale(${scale})` }}>
        <Scoreboard level={level} timeLeft={timeLeft} target={target} score={score} />
        {!gameStarted ? (
          <div className="canvas-border">
            <div id="canvas" style={{ width: canvasSize, height: canvasSize }}>
              <button className="btn-start" onClick={startGame}>
                Start Game
              </button>
            </div>
          </div>
        ) : (
          <Canvas
            icons={icons}
            loading={loading}
            level={level}
            setIsPaused={setIsPaused}
            timeLeft={timeLeft}
            setTimeLeft={setTimeLeft}
            setScore={setScore}
            nextRound={nextLevel}
          />
        )}
        {isGameOver && <GameOverModal score={score} level={level} onContinue={continueGame} />}
      </div>
    </div>
  );
}

export default Game;
