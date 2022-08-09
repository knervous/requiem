import * as React from 'react';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import ListItemText from '@mui/material/ListItemText';
import HouseIcon from '@mui/icons-material/House';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccessibilityIcon from '@mui/icons-material/Accessibility';
import GroupIcon from '@mui/icons-material/Group';
import { Character } from '../../Character/component';
import { Zone } from '../../Zone/component';
import { Group } from '../../Group/component';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import Paper from '@mui/material/Paper';

// scss
import './component.scss';
import { SettingsContext } from '../../Context/settings';
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Slider,
  Typography,
} from '@mui/material';
import { ColorPicker } from 'mui-color';

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

export const SettingsDrawer = () => {
  const options = React.useContext(SettingsContext);
  const {
    maxTargetDisplay,
    maxStaticDisplay = 500,
    fontSize,
    showNpcs,
    showGroup,
    showPcs,
    showPoi,
    showPoiLoc,
    showPoiFilter,
    maxPoiDisplay,
    showStaticSpawns = true,
    showStaticSpawnDetails = false,
    showStaticSpawnFilter = true,
    staticSpawnColor,
    skybox = 'interstellar',
    charColor,
    groupColor,
    cameraType = 'orbit',
    gridInterval = 500,
    flySpeed = 1.5,
    wireframe = false,
    grid = false,
    spawnWireframe = false,
    locationRaycast = false,
    setOption,
  } = options;

  return (
    <div
      className="accordion-container"
      onMouseDown={(e) => (e.stopPropagation(), e.preventDefault())}
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
