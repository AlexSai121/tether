import { useState, useEffect } from 'react';

const useTabFocus = (onAwayLimitReached) => {
      const [isFocused, setIsFocused] = useState(true);
      const [timeAway, setTimeAway] = useState(0);

      useEffect(() => {
            let interval;
            const handleVisibilityChange = () => {
                  const isHidden = document.hidden;
                  setIsFocused(!isHidden);

                  if (isHidden) {
                        // Start counting time away
                        const startTime = Date.now();
                        interval = setInterval(() => {
                              const elapsed = (Date.now() - startTime) / 1000;
                              setTimeAway(elapsed);

                              if (elapsed > 10) {
                                    if (onAwayLimitReached) onAwayLimitReached();
                                    clearInterval(interval);
                              }
                        }, 100);
                  } else {
                        // Reset when back
                        clearInterval(interval);
                        setTimeAway(0);
                  }
            };

            document.addEventListener("visibilitychange", handleVisibilityChange);
            return () => {
                  document.removeEventListener("visibilitychange", handleVisibilityChange);
                  clearInterval(interval);
            };
      }, [onAwayLimitReached]);

      return { isFocused, timeAway };
};

export default useTabFocus;
