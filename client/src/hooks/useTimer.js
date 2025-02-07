import { useState, useEffect } from "react";
function useTimer() {
  const [timeLeft, setTimeLeft] = useState(30);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => setTimeLeft((t) => Math.max(0, t - 0.1)), 100);
    return () => clearInterval(interval);
  }, [isPaused]);

  return { timeLeft, setTimeLeft, isPaused, startTimer: () => setIsPaused(false), pauseTimer: () => setIsPaused(true) };
}
export default useTimer;
