import * as React from 'react';


import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';


// scss
import './component.scss';
import { SettingsContext } from '../../Context/settings';
import {
  Autocomplete,
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Slider,
  TextField,
  Typography,
} from '@mui/material';
import { ColorPicker } from 'mui-color';

import raceData from '../../../common/raceData.json';
import modelDetails from '../../../common/modelDetails.json';
import { useState } from 'react';

const raceOptions = raceData.map(({ name, id }) => ({
  label: `${name} - ${id}`,
  id,
}));

const skyboxOptions = [
  'forest',
  'fullmoon',
  'halflife',
  'interstellar',
  'meadow',
  'nebula',
  'sand',
  'space',
];

const processMode =
  new URLSearchParams(window.location.search).get('mode') === 'process';

const textureMap = {
  '00': 'None',
  '01': 'Leather',
  '02': 'Chain',
  '03': 'Plate',
};

const variationMap = {
  '00': 'Leather',
  '01': 'Chain',
  '02': 'Plate',
};


export const SettingsDrawer = () => {
  const options = React.useContext(SettingsContext);
  const {
    maxTargetDisplay,
    maxStaticDisplay,
    fontSize,
    showNpcs,
    showGroup,
    showPcs,
    showPoi,
    showPoiLoc,
    showPoiFilter,
    maxPoiDisplay,
    showStaticSpawns,
    showStaticSpawnModels,
    showStaticSpawnDetails,
    showStaticSpawnFilter,
    staticSpawnColor,
    skybox,
    charColor,
    groupColor,
    cameraType,
    locationColor,
    flySpeed,
    wireframe,
    spawnWireframe,
    locationRaycast,
    setOption,
    locationTrails,
    characterRace,
    charGender,
    charSize,
    charVariation,
    charTexture,
    charAnimation,
    animationList
  } = options;

  const [genders, setGenders] = useState([0, 1, 2]);
  const [variations, setVariations] = useState(['']);
  const [textures, setTextures] = useState(['00']);

  React.useEffect(() => {
    const race = raceData.find((r) => r.id === characterRace);
    const genders = [0, 1, 2].filter((g) => race[g]?.length);
    setGenders(genders);
    const selectedRaceGender = race[genders[0]];
    const { variations, textures } = Object.entries(modelDetails).find(
      ([key, _value]) => key.toLowerCase() === selectedRaceGender.toLowerCase(),
    )[1];
    setVariations(variations);
    setTextures(textures);
  }, [characterRace]) // eslint-disable-line

   
  const selectRace = charRace => {
    const race = raceData.find((r) => r.id === charRace);
    const genders = [0, 1, 2].filter((g) => race[g]?.length);
    setOption('charGender', genders[0]);
    const selectedRaceGender = race[genders[0]];
    const { variations, textures } = Object.entries(modelDetails).find(
      ([key, _value]) => key.toLowerCase() === selectedRaceGender.toLowerCase(),
    )[1];
    setOption('charVariation', variations[0]);
    setOption('charTexture', textures[0]);
  };


  return (
    <div
      className="accordion-container"
      onMouseDown={(e) => (e.stopPropagation(), e.preventDefault())} // eslint-disable-line
    >
      {/* World */}
      <Accordion disableGutters>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>World</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormControl sx={{ marginTop: 1 }} fullWidth>
            <Typography
              sx={{ fontSize: 14 }}
              color="text.secondary"
              gutterBottom
            >
              Font Size: {fontSize}px
            </Typography>
            <Slider
              value={fontSize}
              onChange={(e) => setOption('fontSize', +e.target.value)}
              step={1}
              min={5}
              max={25}
            />
          </FormControl>
          <FormControlLabel
            control={
              <Checkbox
                checked={wireframe}
                onChange={({ target: { checked } }) =>
                  setOption('wireframe', checked)
                }
              />
            }
            label="Wireframe"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={locationRaycast}
                onChange={({ target: { checked } }) =>
                  setOption('locationRaycast', checked)
                }
              />
            }
            label="Location raycast"
          />
          {/* <FormControlLabel
            control={
              <Checkbox
                checked={grid}
                onChange={({ target: { checked } }) =>
                  setOption('grid', checked)
                }
              />
            }
            label="Show grid"
          />
          <FormControl sx={{ marginTop: 1 }} fullWidth>
            <Typography
              sx={{ fontSize: 14, marginTop: 2, width: '80%' }}
              color="text.secondary"
              gutterBottom
            >
            Grid Interval: {gridInterval}
            </Typography> 
            <Slider
              value={gridInterval}
              onChange={(e) => setOption('gridInterval', +e.target.value)}
              step={1}
              min={4}
              max={50}
            />
          </FormControl> */}
          <FormControl sx={{ marginTop: 1 }} fullWidth>
            <InputLabel id="demo-simple-select-label">Skybox</InputLabel>
            <Select
              size="small"
              value={skybox ?? ''}
              label="Skybox"
              displayEmpty
              onChange={({ target: { value } }) => setOption('skybox', value)}
            >
              {skyboxOptions.map((p, i) => (
                <MenuItem key={`skybox-${i}`} value={p}>
                  {p}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </AccordionDetails>
      </Accordion>

      {/* Camera */}
      <Accordion disableGutters>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>Camera</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormControl sx={{ marginTop: 1 }} fullWidth>
            <InputLabel id="demo-simple-select-label">Camera Type</InputLabel>
            <Select
              value={cameraType}
              label="Camera Type"
              size="small"
              displayEmpty
              onChange={({ target: { value } }) =>
                setOption('cameraType', value)
              }
            >
              <MenuItem key="orbit" value={'orbit'}>
                Orbit
              </MenuItem>
              <MenuItem key="fly" value={'fly'}>
                Fly
              </MenuItem>
            </Select>
          </FormControl>
          <FormControl sx={{ marginTop: 1 }} fullWidth>
            <Typography
              sx={{ fontSize: 14, marginTop: 2, width: '80%' }}
              color="text.secondary"
              gutterBottom
            >
              Camera Fly Speed: {flySpeed}
            </Typography>
            <Slider
              disabled={cameraType !== 'fly'}
              value={flySpeed}
              onChange={(e) => setOption('flySpeed', +e.target.value)}
              step={0.5}
              min={0.5}
              max={20}
            />
          </FormControl>
        </AccordionDetails>
      </Accordion>

      {/* Static Spawns */}
      <Accordion disableGutters>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>Static Spawns</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormControlLabel
            control={
              <Checkbox
                checked={spawnWireframe}
                onChange={({ target: { checked } }) =>
                  setOption('spawnWireframe', checked)
                }
              />
            }
            label="Wireframe"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={showStaticSpawns}
                onChange={({ target: { checked } }) =>
                  setOption('showStaticSpawns', checked)
                }
              />
            }
            label="Show spawns"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={showStaticSpawnModels}
                onChange={({ target: { checked } }) =>
                  setOption('showStaticSpawnModels', checked)
                }
              />
            }
            label="Show models"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={showStaticSpawnDetails}
                onChange={({ target: { checked } }) =>
                  setOption('showStaticSpawnDetails', checked)
                }
              />
            }
            label="Show details"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={showStaticSpawnFilter}
                onChange={({ target: { checked } }) =>
                  setOption('showStaticSpawnFilter', checked)
                }
              />
            }
            label="Show filter"
          />
          <FormControlLabel
            control={
              <ColorPicker
                hideTextfield={true}
                value={staticSpawnColor ?? '#FFFFFF'}
                onChange={(color) => setOption('staticSpawnColor', color)}
              />
            }
            label="Placeholder Color"
          />
          <FormControl sx={{ marginTop: 1 }} fullWidth>
            <Typography
              sx={{ fontSize: 14 }}
              color="text.secondary"
              gutterBottom
            >
              Max Distance for Spawns: {maxStaticDisplay}
            </Typography>
            <Slider
              value={maxStaticDisplay}
              onChange={(e) => setOption('maxStaticDisplay', +e.target.value)}
              step={10}
              min={0}
              max={10000}
            />
          </FormControl>
        </AccordionDetails>
      </Accordion>

      {/* Map Markers */}
      <Accordion disableGutters>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>Map Markers</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormControlLabel
            control={
              <Checkbox
                checked={showPoi}
                onChange={({ target: { checked } }) =>
                  setOption('showPoi', checked)
                }
              />
            }
            label="Show markers"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={showPoiLoc}
                onChange={({ target: { checked } }) =>
                  setOption('showPoiLoc', checked)
                }
              />
            }
            label="Show marker location"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={showPoiFilter}
                onChange={({ target: { checked } }) =>
                  setOption('showPoiFilter', checked)
                }
              />
            }
            label="Show marker filter"
          />
          <FormControl sx={{ marginTop: 1 }} fullWidth>
            <Typography
              sx={{ fontSize: 14 }}
              color="text.secondary"
              gutterBottom
            >
              Max Distance for Markers: {maxPoiDisplay}
            </Typography>
            <Slider
              value={maxPoiDisplay}
              onChange={(e) => setOption('maxPoiDisplay', +e.target.value)}
              step={10}
              min={0}
              max={10000}
            />
          </FormControl>
        </AccordionDetails>
      </Accordion>

      {/* Character */}
      <Accordion disableGutters>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>Character</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormControlLabel
            control={
              <ColorPicker
                hideTextfield={true}
                value={charColor ?? '#FFFFFF'}
                onChange={(color) => setOption('charColor', color)}
              />
            }
            label="Character Text Color"
          />
          <FormControlLabel
            control={
              <ColorPicker
                hideTextfield={true}
                value={locationColor ?? '#FFFFFF'}
                onChange={(color) => setOption('locationColor', color)}
              />
            }
            label="Location Trail Color"
          />
          <FormControl sx={{ marginTop: 1 }} fullWidth>
            <Typography
              sx={{ fontSize: 14 }}
              color="text.secondary"
              gutterBottom
            >
              Location Trails {locationTrails}
            </Typography>
            <Slider
              value={locationTrails}
              onChange={(e) => setOption('locationTrails', +e.target.value)}
              step={1}
              min={1}
              max={20}
            />
          </FormControl>
          <FormControl sx={{ marginTop: 1 }} fullWidth>
            <Typography
              sx={{ fontSize: 14 }}
              color="text.secondary"
              gutterBottom
            >
              Size {charSize}
            </Typography>
            <Slider
              value={charSize}
              onChange={(e) => setOption('charSize', +e.target.value)}
              step={1}
              min={1}
              max={100}
            />
          </FormControl>
          
          <Autocomplete
            blurOnSelect
            value={raceOptions.find(({ id }) => id === characterRace)}
            disablePortal
            onChange={(e_, { id } = {}) => {
              setOption('characterRace', id);
              selectRace(id);
            }}
            id="combo-box-demo"
            options={raceOptions}
            size="small"
            renderInput={(params) => (
              <TextField
                sx={{ height: 38 }}
                {...params}
                label="Character Race"
              />
            )}
          />
          <FormControl sx={{ marginTop: 1 }} fullWidth>
            <InputLabel id="demo-simple-select-label">Gender</InputLabel>
            <Select
              value={charGender}
              label="Gender"
              size="small"
              displayEmpty
              onChange={({ target: { value } }) =>
                setOption('charGender', +value)
              }
            >
              {genders.map((g) => (
                <MenuItem key={`gender-${g}`} value={g}>
                  {g === 0 ? 'Male' : g === 1 ? 'Female' : 'Neutral'}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ marginTop: 1 }} fullWidth>
            <InputLabel id="demo-simple-select-label">Texture</InputLabel>
            <Select
              value={charTexture}
              label="Texture"
              size="small"
              displayEmpty
              onChange={({ target: { value } }) =>
                setOption('charTexture', value)
              }
            >
              {textures.map((t) => (
                <MenuItem key={`tex-${t}`} value={t}>
                  {textureMap[t] || t}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ marginTop: 1 }} fullWidth>
            <InputLabel id="demo-simple-select-label">Variation</InputLabel>
            <Select
              value={charVariation}
              label="Variation"
              size="small"
              displayEmpty
              onChange={({ target: { value } }) =>
                setOption('charVariation', value)
              }
            >
              <MenuItem key={'charVariation-none'} value={''}>
                  None
              </MenuItem>
              {variations.map((v) => (
                <MenuItem key={`charVariation-${v}`} value={v}>
                  {variationMap[v] || v}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ marginTop: 1 }} fullWidth>
            <InputLabel id="demo-simple-select-label">Animation</InputLabel>
            <Select
              value={charAnimation}
              label="Animation"
              size="small"
              displayEmpty
              onChange={({ target: { value } }) =>
                setOption('charAnimation', value)
              }
            >
              {animationList.map((anim) => (
                <MenuItem key={`animationList-${anim}`} value={anim}>
                  {anim}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </AccordionDetails>
      </Accordion>

      {/* Live Spawns */}
      {processMode && (
        <Accordion disableGutters>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography>Live Spawns</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <FormControlLabel
              control={
                <Checkbox
                  checked={showNpcs}
                  onChange={({ target: { checked } }) =>
                    setOption('showNpcs', checked)
                  }
                />
              }
              label="Show NPCs"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={showPcs}
                  onChange={({ target: { checked } }) =>
                    setOption('showPcs', checked)
                  }
                />
              }
              label="Show PCs"
            />

            <FormControl sx={{ marginTop: 1 }} fullWidth>
              <Typography
                sx={{ fontSize: 14 }}
                color="text.secondary"
                gutterBottom
              >
                Max Distance for Spawn Name: {maxTargetDisplay}
              </Typography>
              <Slider
                value={maxTargetDisplay}
                onChange={(e) => setOption('maxTargetDisplay', +e.target.value)}
                step={10}
                min={0}
                max={5000}
              />
            </FormControl>
          </AccordionDetails>
        </Accordion>
      )}

      {/* Group */}
      {processMode && (
        <Accordion disableGutters>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography>Group</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <FormControlLabel
              control={
                <Checkbox
                  checked={showGroup}
                  onChange={({ target: { checked } }) =>
                    setOption('showGroup', checked)
                  }
                />
              }
              label="Show Group Members"
            />
            <FormControlLabel
              control={
                <ColorPicker
                  hideTextfield={true}
                  value={groupColor ?? '#FFFFFF'}
                  onChange={(color) => setOption('groupColor', color)}
                />
              }
              label="Group Text Color"
            />
          </AccordionDetails>
        </Accordion>
      )}
    </div>
  );
};
