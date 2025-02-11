import { useState, useEffect, useCallback } from "react";
import Scoreboard from "../components/Scoreboard";
import Canvas from "../components/Canvas";
import GameOverModal from "../components/GameOverModal";
import Leaderboard from "../components/Leaderboard";
import "../styles/Canvas.css";

function Game() {
  const [icons, setIcons] = useState([]);
  const [target, setTarget] = useState(null);
  const [loading, setLoading] = useState(false);
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isPaused, setIsPaused] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [sessionId, setSessionId] = useState(null);

  useEffect(() => {
    if (!gameStarted) return;
    if (timeLeft <= 0) handleGameOver();
  }, [timeLeft, gameStarted]);

  const startGame = async () => {
    try {
      setLoading(true);
      const newSessionId = crypto.randomUUID(); // Generate a unique session ID
      setSessionId(newSessionId);

      const response = await fetch("http://localhost:1997/api/game/start-level", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: newSessionId, level: 1 }),
      });

      if (!response.ok) throw new Error("Failed to start game");

      const data = await response.json();
      setLevel(1);
      setIcons(data.icons);
      setTarget(data.target);
      setTimeLeft(30);
      setScore(0);
      setGameStarted(true);
    } catch (error) {
      console.error("Error starting game:", error);
    } finally {
      setLoading(false);
    }
  };

  const nextLevel = useCallback(async () => {
    try {
      if (!sessionId) return;
      setLoading(true);

      const response = await fetch("http://localhost:1997/api/game/start-level", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, level: level + 1 }),
      });

      if (!response.ok) throw new Error("Failed to start next level");

      const data = await response.json();
      setLevel((prev) => prev + 1);
      setIcons(data.icons);
      setTarget(data.target);
    } catch (error) {
      console.error("Error advancing level:", error);
    } finally {
      setLoading(false);
    }
  }, [level, sessionId]);

  const handleGameOver = async () => {
    if (!sessionId) return;

    try {
      setIsGameOver(true);
      const response = await fetch("http://localhost:1997/api/game/end-level", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      });

      if (!response.ok) throw new Error("Failed to end game");

      const data = await response.json();
      console.log("Final reaction time:", data.reactionTime);
    } catch (error) {
      console.error("Error ending game:", error);
    }
  };

  const continueGame = () => {
    setGameStarted(false);
    setLevel(0);
    setTimeLeft(30);
    setIsGameOver(false);
    setIcons([]);
  };

  return (
    <div id="web-layout">
      <div id="game-cont">
        {!gameStarted ? (
          <div id="canvas">
            <button className="btn-start" onClick={startGame} disabled={loading}>
              {loading ? "Loading..." : "Start Game"}
            </button>
          </div>
        ) : (
          <div className={`canvas-container ${isGameOver ? "canvas-disabled" : ""}`}>
            <Scoreboard
              level={level}
              timeLeft={timeLeft}
              target={target}
              score={score}
              isPaused={isPaused}
              onTimeOut={handleGameOver}
            />
            <Canvas
              icons={icons}
              loading={loading}
              setScore={setScore}
              nextRound={nextLevel}
              setTimeLeft={setTimeLeft}
              setIsPaused={setIsPaused}
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
