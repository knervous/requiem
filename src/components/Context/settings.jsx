import React, { createContext, useState, useEffect, useCallback } from 'react';

export const SettingsContext = createContext({});
const processMode =
  new URLSearchParams(window.location.search).get('mode') === 'process';
const defaultOptions = {
  maxTargetDisplay      : 1000,
  maxPoiDisplay         : 3000,
  maxStaticDisplay      : 500,
  fontSize              : 13,
  cameraFollowMe        : false,
  showNpcs              : true,
  showPcs               : true,
  showPoi               : true,
  showStaticSpawns      : true,
  showStaticSpawnModels : false,
  showStaticSpawnDetails: false,
  showStaticSpawnFilter : false,
  followTel             : false,
  showPoiLoc            : true,
  showGroup             : true,
  follow                : false,
  skybox                : 'interstellar',
  charColor             : { css: { backgroundColor: '#00FF00' } },
  groupColor            : { css: { backgroundColor: '#0000FF' } },
  staticSpawnColor      : { css: { backgroundColor: '#0000FF' } },
  locationColor         : { css: { backgroundColor: '#0000FF' } },
  address               : 'https://127.0.0.1:9003',
  token                 : '',
  showPoiFilter         : false,
  cameraType            : 'fly',
  flySpeed              : 2,
  wireframe             : false,
  grid                  : false,
  locationTrails        : 5,
  characterRace         : 1,
  charSize              : 3,
  charGender            : 0,
  charVariation         : '',
  charTexture           : '',
  charAnimation         : 'p01',
  locationTrailOpacity  : 0.9,
  locationTrailDashed   : true,
  autoConnect           : false,
  version               : 'live',
  alwaysDaylight        : false,
  enduringBreath        : false,
  farFallow             : false,
  jumpAlways            : false,
  notEncumbered         : false,
  noAnonymous           : false,
  noBlind               : false,
  noDelayedJump         : false,
  noFallDmg             : false,
  noRoot                : false,
  noSilence             : false,
  noSnare               : false,
  noStun                : false,
  seeInvisible          : false,
  ultravision           : false,
  runSpeed              : 0.7,
  camLock               : false,
  ui                    : {
    target: {
      show: true,
      x   : (window.innerWidth / 2) - 50,
      y   : 25
    },
    chat: {
      show  : true,
      x     : (window.innerWidth / 2) - 120,
      y     : window.height - 250,
      width : 250,
      height: 300,
    },
    group: {
      show: true,
      x   : 25,
      y   : 450
    },
  }
};
export const SettingsProvider = ({ children }) => {
  const [options, setOptions] = useState(
    JSON.parse(localStorage.getItem('options') ?? '{}'),
  );
  const setOption = useCallback((key, value) => {
    setOptions((options) => {
      const newOptions = { ...options, [key]: value };
      localStorage.setItem('options', JSON.stringify(newOptions));
      return newOptions;
    });
  }, []);
  const [animationList, setAnimationList] = useState(['p01']);

  useEffect(() => {
    const listener = e => {
      if (e.key === 'T') {
        setOption('locationRaycast', !options.locationRaycast);
      }
    };
    window.addEventListener('keydown', listener);
    return () => window.removeEventListener('keydown', listener);
  }, [options.locationRaycast, setOption]);

  return (
    <SettingsContext.Provider
      value={{
        ...defaultOptions,
        ...options,
        setOption,
        animationList,
        setAnimationList,
        processMode
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};
