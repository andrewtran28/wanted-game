import { useState, useEffect } from "react";
import { canvasSize, difficulty } from "../utils/gameConfig";
import "../styles/Game.css";

function Canvas({ icons, setIsPaused, loading, timeLeft, setTimeLeft, nextRound, setScore, level }) {
  const [highlightedTarget, setHighlightedTarget] = useState(null);
  const [clickDisabled, setClickDisabled] = useState(false);
  const [missedClick, setMissedClick] = useState(false);
  const [lastRoundTime, setLastRoundTime] = useState(timeLeft);

  const { iconWidth, iconHeight, scoreBonus } = difficulty(level);

  useEffect(() => {
    if (timeLeft <= 0) {
      const targetIcon = icons.find((icon) => icon.isTarget);
      if (targetIcon) setHighlightedTarget(targetIcon.id);
    }
  }, [timeLeft, icons]);

  const isTargetClicked = (clickX, clickY) => {
    return icons.find(
      (icon) =>
        icon.isTarget &&
        clickX >= icon.x &&
        clickX <= icon.x + iconWidth &&
        clickY >= icon.y &&
        clickY <= icon.y + iconHeight
    );
  };

  const handleCanvasClick = (event) => {
    if (clickDisabled) return;

    setClickDisabled(true);
    setTimeout(() => setClickDisabled(false), 1250); // Click cooldown time

    const rect = event.currentTarget.getBoundingClientRect();

    // Calculate scale factor
    const scaleX = rect.width / canvasSize;
    const scaleY = rect.height / canvasSize;

    // Adjust click position based on scaling
    const clickX = (event.clientX - rect.left) / scaleX;
    const clickY = (event.clientY - rect.top) / scaleY;

    const clickedTarget = isTargetClicked(clickX, clickY);

    if (clickedTarget) {
      setMissedClick(false);
      highlightTarget(clickedTarget.id);
    } else {
      setMissedClick(true);
      setTimeLeft((prev) => Math.max(0, prev - 3)); // Misclick time penalty
    }
  };

  const highlightTarget = (targetId) => {
    setIsPaused(true);
    setHighlightedTarget(targetId);

    setTimeout(() => {
      setHighlightedTarget(null);
      nextRound();
    }, 1250);

    const reactionTime = lastRoundTime - timeLeft; // Time taken to click
    const pointsEarned = calculateScore(reactionTime);
    setScore((prevScore) => prevScore + pointsEarned);
    setLastRoundTime(timeLeft);

    setTimeout(() => {
      setTimeLeft((prevTime) => Math.min(45, prevTime + 2)); // Add 2s, ensure max time is 30s
    }, 250);
  };

  const calculateScore = (reactionTime) => {
    if (reactionTime <= 1) return 1000 * scoreBonus; // Full score for clicks within 1s

    const roundedPenalty = Math.floor(reactionTime * 10) * 7.5;
    let score = Math.max(1000 - roundedPenalty, 100) * scoreBonus;

    return Math.floor(score / 10) * 10;
  };

  if (loading)
    return (
      <div id="canvas" style={{ width: canvasSize, height: canvasSize }}>
        Loading...
      </div>
    );

  return (
    <div
      id="canvas"
      onClick={handleCanvasClick}
      style={{
        width: canvasSize,
        height: canvasSize,
        pointerEvents: clickDisabled ? "none" : "auto",
        opacity: clickDisabled && missedClick ? 0.75 : 1,
      }}
    >
      {icons.map((icon) => (
        <div
          key={icon.id}
          style={{ position: "absolute", top: icon.y, left: icon.x, zIndex: highlightedTarget === icon.id ? 10 : 1 }}
        >
          {highlightedTarget === icon.id && (
            <div
              className={timeLeft <= 0 ? "target-highlight target-fail" : "target-highlight"}
              style={{ position: "absolute", width: iconWidth + 10, height: iconHeight + 30 }}
            />
          )}

          <img
            className={icon.isTarget ? "icon-target" : "icon-random"}
            src={icon.imgPath}
            alt="icon"
            style={{ width: iconWidth, height: "auto", position: "absolute", pointerEvents: "none" }}
          />
        </div>
      ))}
    </div>
  );
}

export default Canvas;
