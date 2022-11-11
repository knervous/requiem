import { useCallback, useContext, useEffect } from 'react';
import { SettingsContext } from '../../Context/settings';
import { UiContext } from '../component';

const def = { x: 0, y: 0, show: true };

export const usePersistentUiLoc = name => {
  const { ui, setOption } = useContext(SettingsContext);
  const { rootNode } = useContext(UiContext);
  const onStop = useCallback((e) => {
    const { x, y } = e.target.getBoundingClientRect();
    const { x: rootNodeX, } = rootNode.getBoundingClientRect();
    setOption('ui', { ...ui, [name]: {
      ...ui[name] ?? {},
      x: x - rootNodeX,
      y,
    } });
  }, [ui, name, setOption, rootNode]);

  const onResize = useCallback((_, { size: { width, height } }) => {
    setOption('ui', { ...ui, [name]: {
      ...ui[name] ?? {},
      width,
      height,
    } });
  }, [ui, name, setOption]);

  useEffect(() => {
    if (!ui[name]) {
      setOption('ui', { ...ui, [name]: def });
    }
  }, [setOption, name, ui]);
  

  return {
    onStop,
    onResize,
    ...(ui[name] ?? {})
  };
};