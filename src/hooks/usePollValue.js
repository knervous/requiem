import { useEffect, useState } from 'react';

export const usePollValue = (expr) => {
  const [state, setState] = useState(expr());
  useEffect(() => {
    const interval = setInterval(() => {
      setState(expr());
    }, 50);

    return () => {
      clearInterval(interval);
    };
  }, [expr]);

  return state;
};
