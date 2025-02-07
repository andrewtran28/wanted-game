import React from "react";
import { useState, useEffect } from "react";
import "../styles/Canvas.css";

function Canvas({ icons, setTimeLeft, iconWidth, iconHeight, canvasSize, resetCanvas, setIsPaused }) {
  const [highlightedTarget, setHighlightedTarget] = useState(null);

  const handleCanvasClick = (event) => {
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
      highlightTarget(clickedTarget.id);
    } else {
      setTimeLeft((prevTime) => Math.max(0, prevTime - 5)); // Penalize wrong click
    }
  };

  const highlightTarget = (targetId) => {
    setIsPaused(true); // Pause timer
    setHighlightedTarget(targetId); // Highlight clicked target

    setTimeout(() => {
      setHighlightedTarget(null); // Remove highlight
      resetCanvas();
    }, 2000);

    setTimeout(() => setTimeLeft((prevTime) => prevTime + 2), 250);
  };

  return (
    <div
      id="canvas"
      onClick={handleCanvasClick}
      style={{
        width: canvasSize,
        height: canvasSize,
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
              className="target-highlight"
              style={{
                position: "absolute",
                width: iconWidth + 10,
                height: iconHeight + 20,
                borderRadius: "50%",
                border: "5px solid lime",
                top: "-15px",
                left: "-10px",
                zIndex: 9,
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
