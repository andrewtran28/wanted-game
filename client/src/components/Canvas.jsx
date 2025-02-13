import { useState, useEffect } from "react";
import { canvasSize, difficulty } from "../utils/gameConfig";
import "../styles/Game.css";

function Canvas({ icons, setIsPaused, loading, timeLeft, setTimeLeft, nextRound, setScore, level }) {
  const [highlightedTarget, setHighlightedTarget] = useState(null);
  const [clickDisabled, setClickDisabled] = useState(false);
  const [missedClick, setMissedClick] = useState(false);
  const [lastRoundTime, setLastRoundTime] = useState(timeLeft);
  const [floatingTexts, setFloatingTexts] = useState([]); // Floating text state

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
    if (clickDisabled || timeLeft <= 0) return;

    setClickDisabled(true);
    setTimeout(() => setClickDisabled(false), 1250); // Click cooldown time

    const rect = event.currentTarget.getBoundingClientRect();
    const scaleX = rect.width / canvasSize;
    const scaleY = rect.height / canvasSize;
    const clickX = (event.clientX - rect.left) / scaleX;
    const clickY = (event.clientY - rect.top) / scaleY;
    const clickedTarget = isTargetClicked(clickX, clickY);

    if (clickedTarget) {
      setMissedClick(false);
      highlightTarget(clickedTarget.id, clickX, clickY);
    } else {
      setMissedClick(true);
      setTimeLeft((prev) => Math.max(0, prev - 3)); // Misclick time penalty
      showFloatingText("-3.0s", clickX, clickY, "#cd0000");
    }
  };

  const highlightTarget = (targetId, clickX, clickY) => {
    setIsPaused(true);
    setHighlightedTarget(targetId);

    setTimeout(() => {
      setHighlightedTarget(null);
      nextRound();
    }, 1250);

    const reactionTime = lastRoundTime - (level > 1 ? timeLeft - 2 : timeLeft);
    const pointsEarned = calculateScore(reactionTime);
    setScore((prevScore) => prevScore + pointsEarned);
    setLastRoundTime(timeLeft);

    setTimeLeft((prevTime) => Math.min(45, prevTime + 2));
    showFloatingText(pointsEarned, clickX, clickY, "#00ba00");
    showFloatingText("+2.0s", clickX, clickY + 30, "#ffc500");
  };

  const calculateScore = (reactionTime) => {
    console.log(`Level ${level}: Reaction Time: ${reactionTime.toFixed(3)}s`);
    if (reactionTime <= 1.5) return 1000 * scoreBonus; //Success within 1.5s grants full points.
    const roundedPenalty = Math.floor((reactionTime - 0.25) * 10) * 7.5; //Start penalty after 0.25s.
    let score = Math.max(1000 - roundedPenalty, 100) * scoreBonus;
    return Math.floor(score / 10) * 10;
  };

  const showFloatingText = (text, x, y, color) => {
    const id = Math.random().toString(36).substr(2, 9);
    setFloatingTexts((prev) => [...prev, { id, text, x, y, color }]);

    setTimeout(() => {
      setFloatingTexts((prev) => prev.filter((item) => item.id !== id));
    }, 1250); // Remove after animation
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
        position: "relative",
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
              style={{ position: "absolute", width: iconWidth, height: iconWidth }}
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

      {floatingTexts.map(({ id, text, x, y, color }) => (
        <span key={id} className="floating-text" style={{ top: y - 30, left: x + 10, color }}>
          {text}
        </span>
      ))}
    </div>
  );
}

export default Canvas;
