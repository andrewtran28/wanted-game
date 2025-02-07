import React, { createContext, useState, useContext } from "react";

// Create the context
const GameContext = createContext();

// Create the provider component
const GameProvider = ({ children }) => {
  const [icons, setIcons] = useState([]);
  const [target, setTarget] = useState(null);
  const [loading, setLoading] = useState(false);
  const [iconQueue, setIconQueue] = useState([]);
  const [points, setPoints] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30.0);
  const [isPaused, setIsPaused] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  const value = {
    icons,
    setIcons,
    target,
    setTarget,
    loading,
    setLoading,
    iconQueue,
    setIconQueue,
    points,
    setPoints,
    timeLeft,
    setTimeLeft,
    isPaused,
    setIsPaused,
    gameStarted,
    setGameStarted,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

// Custom hook to use game context
const useGameContext = () => {
  return useContext(GameContext);
};

export { GameProvider, useGameContext };
