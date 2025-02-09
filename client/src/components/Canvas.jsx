import { useState, useEffect } from "react";
import "../styles/Canvas.css";

function Canvas({ icons, iconWidth, iconHeight, canvasSize, setIsPaused, loading, timeLeft, setTimeLeft, nextRound }) {
  const [highlightedTarget, setHighlightedTarget] = useState(null);
  const [clickDisabled, setClickDisabled] = useState(false);
  const [missedClick, setMissedClick] = useState(false);

  // Highlight target indefinitely if game over
  useEffect(() => {
    if (timeLeft <= 0) {
      const targetIcon = icons.find((icon) => icon.isTarget);
      if (targetIcon) setHighlightedTarget(targetIcon.id);
    }
  }, [timeLeft, icons]);

  const handleCanvasClick = (event) => {
    if (clickDisabled) return;

    setClickDisabled(true);
    setTimeout(() => setClickDisabled(false), 1250); //Click cool down time

    const rect = event.currentTarget.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;

    const clickedTarget = icons.find(
      (icon) =>
        icon.isTarget &&
        clickX >= icon.x &&
        clickX <= icon.x + iconWidth &&
        clickY >= icon.y &&
        clickY <= icon.y + iconHeight
    );

    if (clickedTarget) {
      setMissedClick(false);
      highlightTarget(clickedTarget.id);
    } else {
      setMissedClick(true);
      setTimeLeft((prev) => Math.max(0, prev - 3)); //Misclick time penalize.
    }
  };

  const highlightTarget = (targetId) => {
    setIsPaused(true);
    setHighlightedTarget(targetId);

    setTimeout(() => {
      setHighlightedTarget(null);
      nextRound();
    }, 1250); //Time until next round

    setTimeout(() => setTimeLeft((prevTime) => prevTime + 2), 250);
  };

  if (loading) {
    return (
      <div id="canvas" style={{ width: canvasSize, height: canvasSize }}>
        Loading...
      </div>
    );
  }

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
          style={{
            position: "absolute",
            top: icon.y,
            left: icon.x,
            zIndex: highlightedTarget === icon.id ? 10 : 1,
          }}
        >
          {highlightedTarget === icon.id && (
            <div
              className={timeLeft <= 0 ? "target-highlight target-fail" : "target-highlight"}
              style={{
                position: "absolute",
                width: iconWidth + 10,
                height: iconHeight + 30,
              }}
            />
          )}

          <img
            className={icon.isTarget ? "icon-target" : "icon-random"}
            src={icon.imgPath}
            alt="icon"
            style={{
              width: iconWidth,
              height: "auto",
              position: "absolute",
              pointerEvents: "none",
            }}
          />
        </div>
      ))}
    </div>
  );
}

export default Canvas;
