import React, { createContext, useCallback, useState } from 'react';

export const SettingsContext = createContext({});

export const SettingsProvider = ({ children }) => {
  const [options, setOptions] = useState(JSON.parse(
    localStorage.getItem('options') ??
          JSON.stringify({
            maxTargetDisplay      : 1000,
            maxPoiDisplay         : 3000,
            maxStaticDisplay      : 500,
            fontSize              : 13,
            cameraFollowMe        : false,
            showNpcs              : true,
            showPcs               : true,
            showPoi               : true,
            showStaticSpawns      : false,
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
            address               : 'https://localhost:4500',
            token                 : '',
            showPoiFilter         : false,
            cameraType            : 'orbit',
            flySpeed              : 1,
            wireframe             : false,
            grid                  : false,
            locationTrails        : 5,
            characterRace         : 1,
            charSize              : 3,
            charGender            : 0,
            charVariation         : undefined,
            charTexture           : '00',
            charAnimation         : 'p01',
          }),
  ));
  const setOption = (key, value) => {
    setOptions((options) => {
      const newOptions = { ...options, [key]: value };
      localStorage.setItem('options', JSON.stringify(newOptions));
      return newOptions;
    });
  };
  const [animationList, setAnimationList] = useState([]);
  return <SettingsContext.Provider value={{ ...options, setOption, animationList, setAnimationList: useCallback(setAnimationList, []) }}>{children}</SettingsContext.Provider>;
};