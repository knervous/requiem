import React, {
  useEffect,
  useRef,
  useState,
} from 'react';

import { useToasts } from 'react-toast-notifications';
import { gameController } from '../controllers/GameController';
import UiOverlay from '../../Ui/component';
import { UiState, useSelector } from '../../../state';

const params = new Proxy(new URLSearchParams(window.location.search), {
  get: (searchParams, prop) => searchParams.get(prop),
});

const RenderedZone = () => {
  const [zone, _setZone] = useState(params.zone ?? 'qeynos');
  const [, forceRender] = useState({});
  const loading = useSelector(UiState.loading);
  const canvasRef = useRef();
  const zoneRef = useRef();
  const { addToast } = useToasts();
  useEffect(() => {
    gameController.loadEngine(canvasRef.current, addToast);
    gameController.loadZoneScene(zone, params.spawns === 'true').then(() => {
      window.addEventListener('resize', gameController.resize);
      window.addEventListener('keydown', gameController.keyDown);
      forceRender({});
    });

    return () => {
      window.removeEventListener('resize', gameController.resize);
      window.addEventListener('keydown', gameController.keyDown);
    };
    
  }, [zone, addToast]);

  return <div ref={zoneRef} width="100%" height="100%">
    {params.ui === 'true' && !loading && <UiOverlay rootNode={zoneRef.current} /> }
    <canvas width="100vw" height="100vh" ref={canvasRef} id="renderCanvas" /></div>;
};

export const BabylonZone = () => {
  return (
    <RenderedZone />
  );
};
