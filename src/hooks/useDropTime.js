import {useState, useCallback, useEffect, useRef} from 'react';

const defaultDropTime = 500;
const minimumDropTime = 100;
const speedIncrement = 50;

// Custom hook by Dan Abramov
export const useInterval = (callback, delay) => {
  const savedCallback = useRef();

  // Remember the latest callback
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => {
        clearInterval(id);
      };
    }
  }, [delay]);
};

export const useDropTime = ({gameStats}) => {
  const [dropTime, setDropTime] = useState(defaultDropTime);
  const [isPaused, setIsPaused] = useState(false);

  // Function to pause the dropping
  const pauseDropTime = useCallback(() => {
    if (!isPaused) {
      setIsPaused(true);
    }
  }, [isPaused]);

  // Function to resume dropping
  const resumeDropTime = useCallback(() => {
    if (isPaused) {
      setIsPaused(false);
    }
  }, [isPaused]);

  useEffect(() => {
    if (!isPaused) {
      const speed = speedIncrement * (gameStats.level - 1);
      const newDropTime = Math.max(defaultDropTime - speed, minimumDropTime);
      setDropTime(newDropTime);
    } else {
      setDropTime(null); // Pause dropping by setting to null
    }
  }, [gameStats.level, isPaused]);

  return [dropTime, pauseDropTime, resumeDropTime];
};
