function Scoreboard({ level, timeLeft, target, resetCanvas, imgArr }) {
  return (
    <div className="game-info">
      {target !== null && (
        <div className="target-container">
          <h3>Find this penguin:</h3>
          <img src={imgArr[target]} alt="Target Icon" className="target-image" style={{ width: 107, height: "auto" }} />
        </div>
      )}
      <div className="game-scoreboard">
        <h2>Level: {level}</h2>
        <h2>Time: {timeLeft.toFixed(1)}</h2>
        <button className="btn-reset" onClick={resetCanvas}>
          Reset Canvas
        </button>
      </div>
    </div>
  );
}

export default Scoreboard;
