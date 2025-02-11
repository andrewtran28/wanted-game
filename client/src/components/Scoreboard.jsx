import { useEffect } from "react";
import { imgArr } from "../utils/randomize";

function Scoreboard({ level, timeLeft, setTimeLeft, onTimeOut, score, target, gameStarted, isPaused }) {
  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeOut();
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

  return (
    <div className="game-info">
      {target !== null && (
        <div className="target-container">
          <h3>Find this penguin:</h3>
          <img src={imgArr[target]} alt="Target Icon" className="target-image" />
        </div>
      )}
      <div className="game-scoreboard">
        <p>Level: {level}</p>
        <p>Score: {score} </p>
        <p>Time: {timeLeft !== undefined ? timeLeft.toFixed(1) : "0.0"}</p>
      </div>
    </div>
  );
}

export default Scoreboard;
