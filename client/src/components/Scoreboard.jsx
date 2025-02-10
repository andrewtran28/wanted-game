import { imgArr } from "../utils/randomize";

function Scoreboard({ level, timeLeft, target, score }) {
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
        <p>Time: {timeLeft.toFixed(1)}</p>
      </div>
    </div>
  );
}

export default Scoreboard;
