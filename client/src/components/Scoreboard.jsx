function Scoreboard({ points, timeLeft, target, resetCanvas, imgArr }) {
  return (
    <div className="game-info">
      {target !== null && (
        <div className="target-container">
          <h3>Find this penguin:</h3>
          <img src={imgArr[target]} alt="Target Icon" className="target-image" style={{ width: 107, height: "auto" }} />
        </div>
      )}
      <div className="game-scoreboard">
        <span>Points: {points}</span>
        <span>Time: {timeLeft.toFixed(1)}</span>
        <button className="btn-reset" onClick={resetCanvas}>
          Reset Canvas
        </button>
      </div>
    </div>
  );
}

export default Scoreboard;
