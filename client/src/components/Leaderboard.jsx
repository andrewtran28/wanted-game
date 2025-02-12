import { useState, useEffect } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const formatDate = (date) => {
  if (!date) return "";

  const dateObj = date instanceof Date ? date : new Date(date);
  if (isNaN(dateObj.getTime())) return "";

  const options = { month: "short" };
  const month = new Intl.DateTimeFormat("en-US", options).format(dateObj);
  const day = dateObj.getDate();
  const year = dateObj.getFullYear();

  return `${month} ${day} ${year}`;
};

function Leaderboard() {
  const [scores, setScores] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/leaderboard`);
        const data = await response.json();
        setScores(data);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <div className="leaderboard">
      <h2>Top 10 Leaderboard</h2>
      <ol>
        {scores.map((entry, index) => (
          <li key={index}>
            <span>{entry.username}</span> - <span>{entry.level}</span> - <span>{entry.score}</span> -{" "}
            <span>{formatDate(entry.createdAt)}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default Leaderboard;
