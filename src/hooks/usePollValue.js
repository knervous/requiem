import { useEffect, useState } from 'react';

export const usePollValue = (expr, pollMs = 100) => {
  const [state, setState] = useState(expr());
  useEffect(() => {
    const interval = setInterval(() => {
      const val = expr();
      if (JSON.stringify(val) !== JSON.stringify(state)) {
        setState(val);
      }
    }, pollMs);

    return () => {
      clearInterval(interval);
    };
  }, [expr, pollMs, state]);

  return state;
};
