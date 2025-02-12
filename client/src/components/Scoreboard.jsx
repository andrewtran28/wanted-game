import { imgArr } from "../utils/randomize";

function padNum(num, length) {
  return String(num).length < length ? new Array(length - String(num).length + 1).join("0") + String(num) : num;
}

function Scoreboard({ level, timeLeft, target, score }) {
  const timeColor = timeLeft < 10 ? "red" : timeLeft > 30 ? "green" : "orange";

  return (
    <div id="scoreboard">
      <div className="scoreboard-target">
        <span>Find this Penguin!</span>
        <img className="target-image" src={imgArr[target]} />
      </div>
      <div className="game-info">
        <div className="game-info-top">
          <div className="info">
            <span>Level</span>
            <span>{level}</span>
          </div>
          <div className="info">
            <span>Score</span>
            <span>{padNum(score, 8)}</span>
          </div>
        </div>

        <div className="info">
          <span>Time</span>
          <span className="info-time" style={{ color: timeColor }}>
            {timeLeft.toFixed(1)}
          </span>
        </div>
      </div>
    </div>
  );
}

export default Scoreboard;
