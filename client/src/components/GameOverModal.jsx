import React from "react";

function GameOverModal({ score, onContinue }) {
  return (
    <div className="game-over-modal">
      <div className="modal-content">
        <h2>Game Over</h2>
        <p>Your Final Score: {score}</p>
        <button onClick={onContinue} className="btn-continue">
          Continue
        </button>
      </div>
    </div>
  );
}

export default GameOverModal;
