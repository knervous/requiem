import React, {
  useEffect,
  useRef,
  useState,
  useCallback
} from 'react';

import { useToasts } from 'react-toast-notifications';
import { gameController } from '../controllers/GameController';
import UiOverlay from '../../Ui/component';
import { UiState, ZoneState, useSelector } from '../../../state';

const params = new Proxy(new URLSearchParams(window.location.search), {
  get: (searchParams, prop) => searchParams.get(prop),
});

export const BabylonZone = () => {
  const zoneInfo = useSelector(ZoneState.zoneInfo);
  const [zone, _setZone] = useState(params.zone ?? zoneInfo?.shortName ?? 'qeynos');
  const [, forceRender] = useState({});
  const loading = useSelector(UiState.loading);
  const canvasRef = useRef();
  const zoneRef = useRef();

  useEffect(() => {
    (async () => {
      await gameController.loadEngine(canvasRef.current);
      gameController.loadZoneScene(zone, params.spawns === 'true').then(() => {
        window.addEventListener('resize', gameController.resize);
        window.addEventListener('keydown', gameController.keyDown);
        forceRender({});
      });
    })();
   

    return () => {
      window.removeEventListener('resize', gameController.resize);
      window.addEventListener('keydown', gameController.keyDown);
    };
    
  }, [zone]);

  return <div ref={zoneRef} width="100%" height="100%">
    {gameController.showUi && !loading && <UiOverlay rootNode={zoneRef.current} /> }
    <canvas width="100vw" height="100vh" ref={canvasRef} id="renderCanvas" /></div>;
};