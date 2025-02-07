import React from "react";

function TargetDisplay({ target }) {
  return (
    <div>
      <h3>Find this Penguin: </h3>
      <img src={target} />
    </div>
  );
}

export default TargetDisplay;
