import { useEffect } from 'react';

export const useDidMount = (fn = () => undefined) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => fn(), []);
};
