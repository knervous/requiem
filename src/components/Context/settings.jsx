import React, { createContext, useState } from 'react';

export const SettingsContext = createContext({});

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
  hasConnected          : false
};
export const SettingsProvider = ({ children }) => {
  const [options, setOptions] = useState(
    JSON.parse(localStorage.getItem('options') ?? '{}'),
  );
  const setOption = (key, value) => {
    setOptions((options) => {
      const newOptions = { ...options, [key]: value };
      localStorage.setItem('options', JSON.stringify(newOptions));
      return newOptions;
    });
  };
  const [animationList, setAnimationList] = useState(['p01']);
  return (
    <SettingsContext.Provider
      value={{
        ...defaultOptions,
        ...options,
        setOption,
        animationList,
        setAnimationList,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};
