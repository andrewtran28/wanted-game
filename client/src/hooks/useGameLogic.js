import { useState } from "react";

function useGameLogic() {
  const [icons, setIcons] = useState([]);
  const [target, setTarget] = useState(null);
  const [highlightedTarget, setHighlightedTarget] = useState(null);
  const selectTarget = () => Math.floor(Math.random() * 6);
  const addIcon = (imgPath) => {
    setIcons([...icons, { imgPath, id: Math.random() }]);
  };
  const resetCanvas = () => {
    setIcons([]);
    setTarget(selectTarget());
  };
  return {
    icons,
    target,
    highlightedTarget,
    setIcons,
    setTarget,
    setHighlightedTarget,
    resetCanvas,
    selectTarget,
    addIcon,
  };
}

export default useGameLogic;
