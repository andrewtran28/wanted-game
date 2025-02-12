import { useState, useEffect } from "react";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function GameOverModal({ score, level, onContinue }) {
  const [username, setUsername] = useState("");
  const [isTop10, setIsTop10] = useState(false);

  useEffect(() => {
    const checkLeaderboard = async () => {
      try {
        console.log(API_BASE_URL);
        const response = await fetch(`${API_BASE_URL}/api/leaderboard`);
        const data = await response.json();

        if (data.length < 10 || score > data[data.length - 1].score) {
          setIsTop10(true);
        }
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      }
    };

    checkLeaderboard();
  }, [score]);

  const handleSubmit = async () => {
    if (!username.trim()) return;

    try {
      await fetch(`${API_BASE_URL}/api/leaderboard`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, score, level }),
      });

      onContinue();
    } catch (error) {
      console.error("Error submitting score:", error);
    }
  };

  return (
    <div className="game-over-modal">
      <div className="modal-content">
        <h2>Game Over</h2>
        <p>Highest Level: {level}</p>
        <p>Your Score: {score}</p>

        {isTop10 && score > 0 ? (
          <>
            <p>Congratulations! You made it to the Top 10 Leaderboard!</p>
            <input
              type="text"
              maxLength="25"
              placeholder="Enter your name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <button onClick={handleSubmit} className="btn-submit">
              Submit Score
            </button>
          </>
        ) : (
          <p>Try again to reach the leaderboard!</p>
        )}

        <button onClick={onContinue} className="btn-continue">
          {isTop10 && score > 10 ? "Skip" : "Continue"}
        </button>
      </div>
    </div>
  );
}

export default GameOverModal;
