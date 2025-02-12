import { imgArr } from "../utils/randomize";

function Scoreboard({ level, timeLeft, target, score, loading }) {
  return (
    <div id="game-info">
      {target !== null && !loading && (
        <div className="target-container">
          <h3>Find this penguin:</h3>
          <img src={imgArr[target]} className="target-image" />
        </div>
      )}
      {loading && (
        <div className="target-container">
          <h3>Find this penguin:</h3>
          <span>Loading...</span>
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
