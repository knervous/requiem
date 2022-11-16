import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { SettingsContext } from '../../Context/settings';

const def = { x: 0, y: 0, show: true };

export const usePersistentUiLoc = (name, rootNode) => {
  const { ui, setOption } = useContext(SettingsContext);
  const [force, ren] = useState();
  const forceRender = () => ren({});
  const onStop = useCallback((e) => {
    const { x, y } = e.target.getBoundingClientRect();
    setOption('ui', { ...ui, [name]: {
      ...ui[name] ?? {},
      x,
      y,
    } });
  }, [ui, name, setOption]);

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
  
  const { x, y } = useMemo(() => {
    if (!ui[name]) {
      return { x: 100, y: 100 };
    }

    return {
      x: ui[name].x + rootNode.getBoundingClientRect().left,
      y: ui[name].y
    };
  }, [ui, name, rootNode, force]); // eslint-disable-line

  useEffect(() => {
    const observer = new ResizeObserver(forceRender);
    observer.observe(rootNode);
    return () => observer.unobserve(rootNode);
  }, [rootNode]);
  
  return {
    onStop,
    onResize,
    ...(ui[name] ?? {}),
    x,
    y
  };
};