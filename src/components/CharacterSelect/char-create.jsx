import React, { useCallback, useEffect, useState } from 'react';
import { nameByRace } from 'fantasy-name-generator';

import {
  Box,
  Button,
  FormControl,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import RaceData from '../../common/raceData.json';
import ClassData from '../../common/classData.json';
import { gameController } from '../Babylon/controllers/GameController';
import {
  CharClassStrings,
  CharRaceStrings,
  Races,
  VIEWS,
  baseClassStats,
  baseStats,
  classLookupTable,
  preferredStats,
} from './constants';
import classNames from 'classnames';
import { getAvailableDeities, startingCityMap } from './util';
import EQStrings from '../../common/eqstr.json';

const formControlSx = {
  marginTop: 200,
  padding  : '120px 0 0 0',
  width    : 300,
  display  : 'block',
  margin   : '0 auto',
};

export const CharacterCreate = ({ setView, loginInfo }) => {
  const [selectedRace, setSelectedRace] = useState(1);
  const [selectedClass, setSelectedClass] = useState(1);
  const [selectedDeity, setSelectedDeity] = useState(1);
  const [selectedCity, setSelectedCity] = useState(1);
  const [gender, setGender] = useState(0);
  const [face, setFace] = useState(0);
  const [name, setName] = useState('');
  const [deities, setDeities] = useState([]);
  const [startingCities, setStartingCities] = useState([]);

  const [character, setCharacter] = useState({});
  const [baseCharacter, setBaseCharacter] = useState({});
  const [initialLength] = useState(loginInfo?.characters?.length);
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (initialLength !== loginInfo?.characters?.length) {
      setView(VIEWS.CHAR_SELECT);
    }
  }, [loginInfo?.characters?.length, setView, initialLength]);

  useEffect(() => {
    const deities = getAvailableDeities(selectedRace, selectedClass);
    if (!deities.length) {
      return;
    }
    setDeities(deities);
    setSelectedDeity(deities[0][0]);
  }, [selectedRace, selectedClass]);

  useEffect(() => {
    const deity = deities.find(([val]) => val === selectedDeity);
    const availableCities =
      startingCityMap[selectedClass]?.[selectedRace]?.[deity];
    if (!availableCities) {
      return;
    }
    setStartingCities(availableCities);
    setSelectedCity(availableCities[0][0]);
  }, [selectedRace, selectedClass, selectedDeity, deities]);

  useEffect(() => {
    const newCharacter = {
      charClass: selectedClass,
      race     : selectedRace,
      equip    : [],
      name     : '',
      face,
      gender,
    };

    // Check if we can keep the same class applied
    // If not, find the first available class for a new race
    if (!classLookupTable[selectedClass - 1][selectedRace - 1]) {
      for (const [idx, classEntry] of Object.entries(classLookupTable)) {
        if (classEntry[selectedRace - 1]) {
          setSelectedClass(+idx + 1);
          return;
        }
      }
    }

    const classStats = baseClassStats[selectedClass - 1];
    const raceStats = baseStats[selectedRace - 1];
    // Initialize stats
    const char = {
      str       : classStats[0] + raceStats[0],
      sta       : classStats[1] + raceStats[1],
      agi       : classStats[2] + raceStats[2],
      dex       : classStats[3] + raceStats[3],
      wis       : classStats[4] + raceStats[4],
      intel     : classStats[5] + raceStats[5],
      cha       : classStats[6] + raceStats[6],
      statPoints: classStats[7],
      deity     : 0,
    };
    setCharacter(char);
    setBaseCharacter(char);
    // Instantiate model
    let pos = { x: 0, y: 0, z: 16 };
    let size = 15;
    let heading = 0;
    const goodRaces = [1, 2, 3, 4, 5, 7, 8, 11];
    const evilClasses = [5, 11];
    const bigRaces = [2, 9, 10];
    if (
      goodRaces.includes(selectedRace) &&
      !evilClasses.includes(selectedClass)
    ) {
      gameController.CameraController.swapCharacterSelectView(
        gameController.CameraController.VIEWS.GOOD
      );
    } else {
      gameController.CameraController.swapCharacterSelectView(
        gameController.CameraController.VIEWS.EVIL
      );
      pos = { x: -315, y: -2.18, z: 15 };
      heading = 180;
    }
    if (bigRaces.includes(selectedRace)) {
      size = 20;
      pos.z += 3;
    }
    gameController.SpawnController.setCharacterSelectModel({
      ...newCharacter,
      size,
      ...pos,
      heading,
    });
  }, [selectedRace, selectedClass, gender, face]);

  const createCharacter = useCallback(() => {
    gameController.NetWorldController.createCharacter(name, {
      gender,
      face,
      tutorial : 0,
      race     : selectedRace,
      charClass: selectedClass,
      startZone: selectedCity,
      deity    : selectedDeity,
      ...character,
    });
  }, [
    name,
    gender,
    selectedRace,
    character,
    selectedClass,
    selectedDeity,
    selectedCity,
    face,
  ]);

  return (
    <>
      <FormControl className="char-create" sx={formControlSx}>
        <Typography variant="h5" noWrap component="div">
          Character
        </Typography>

        <Stack
          sx={{ marginTop: '5px' }}
          justifyContent={'center'}
          alignContent={'center'}
          direction={'row'}
        >
          <Button
            className={classNames({ 'btn-selected': gender === 0 })}
            onClick={() => {
              setGender(0);
            }}
            variant="outlined"
          >
            Male
          </Button>
          <Button
            className={classNames({ 'btn-selected': gender === 1 })}
            onClick={() => {
              setGender(1);
            }}
            variant="outlined"
          >
            Female
          </Button>
          <Select
            value={face}
            sx={{ background: 'rgba(0,0,0, 0.25)' }}
            onChange={(e) => setFace(e.target.value)}
          >
            {Array.from({ length: 8 }).map((_, idx) => (
              <MenuItem value={idx}>Face {idx + 1}</MenuItem>
            ))}
          </Select>
        </Stack>
        <Stack
          sx={{ marginTop: '5px' }}
          justifyContent={'center'}
          alignContent={'center'}
          direction={'row'}
        >
          {/** Races */}
          <Stack
            sx={{ marginTop: '5px' }}
            alignContent={'center'}
            direction={'column'}
          >
            {RaceData.slice(0, 11)
              .sort((race, race2) => (race.name > race2.name ? 1 : -1))
              .map((race) => (
                <Button
                  className={classNames({
                    'btn-selected': race.id === selectedRace,
                  })}
                  onClick={() => {
                    setDescription(CharRaceStrings[race.id]);
                    setSelectedRace(race.id);
                  }}
                  variant="outlined"
                >
                  {race.name}
                </Button>
              ))}
          </Stack>

          {/** Classes */}
          <Stack
            sx={{ marginTop: '5px' }}
            justifyContent={'center'}
            alignContent={'center'}
            direction={'column'}
          >
            {Object.entries(ClassData)
              .slice(0, 14)
              .sort(([, name], [, name2]) => (name > name2 ? 1 : -1))
              .map(([id, name]) => (
                <Button
                  disabled={!classLookupTable[id - 1][selectedRace - 1]}
                  className={classNames({
                    'btn-selected': +id === selectedClass,
                  })}
                  onClick={() => {
                    setDescription(CharClassStrings[+id]);
                    setSelectedClass(+id);
                  }}
                  variant="outlined"
                >
                  {name}
                </Button>
              ))}
          </Stack>
        </Stack>

        <Button
          sx={{
            fontSize     : 20,
            textTransform: 'none',
            marginTop    : '20px !important',
          }}
          onClick={() => setView(VIEWS.CHAR_SELECT)}
          variant="outlined"
        >
          Back to Character Select
        </Button>
      </FormControl>

      <FormControl className="char-create-stats" sx={formControlSx}>
        <Typography variant="h5" noWrap component="div">
          Abilities
        </Typography>
        <Typography variant="h6" noWrap component="div">
          Points Remaining: {character.statPoints}
        </Typography>
        {[
          ['Strength', 'str'],
          ['Stamina', 'sta'],
          ['Agility', 'agi'],
          ['Dexterity', 'dex'],
          ['Wisdom', 'wis'],
          ['Intelligence', 'intel'],
          ['Charisma', 'cha'],
        ].map(([label, stat]) => (
          <Stack
            key={`stat-${stat}`}
            sx={{ marginTop: '2px' }}
            direction={'row'}
          >
            <Stack
              key={`stat-${stat}`}
              minWidth={200}
              sx={{ marginTop: '15px' }}
              justifyContent={'center'}
              direction={'column'}
            >
              <Typography
                textAlign={'left'}
                paddingLeft={3}
                variant="h7"
                noWrap
                component="div"
              >
                {label}:{' '}
                <Typography
                  sx={{
                    color: preferredStats[selectedClass].includes(stat)
                      ? 'lightgreen'
                      : 'white',
                  }}
                  variant="p"
                >
                  {character[stat]}
                </Typography>
              </Typography>
            </Stack>

            <Stack
              key={`stat-${stat}`}
              sx={{ marginTop: '15px' }}
              direction={'row'}
            >
              <Button
                sx={{ padding: 0, margin: 0, minWidth: '25px' }}
                disabled={character[stat] === baseCharacter[stat]}
                onClick={() =>
                  setCharacter((char) => ({
                    ...char,
                    [stat]    : char[stat] - 1,
                    statPoints: char.statPoints + 1,
                  }))
                }
                variant="outlined"
              >
                -
              </Button>
              <Button
                disabled={character.statPoints === 0}
                sx={{ padding: 0, margin: 0, minWidth: '25px' }}
                onClick={() => {
                  setCharacter((char) => ({
                    ...char,
                    [stat]    : char[stat] + 1,
                    statPoints: char.statPoints - 1,
                  }));
                }}
                variant="outlined"
              >
                +
              </Button>
            </Stack>
          </Stack>
        ))}
        <Typography variant="h6" noWrap component="div">
          Deity
        </Typography>
        <Select
          value={selectedDeity}
          sx={{ background: 'rgba(0,0,0, 0.25)', width: '75%' }}
          onChange={(e) => setSelectedDeity(e.target.value)}
        >
          {deities.map(([value, display]) => (
            <MenuItem value={value}>{display}</MenuItem>
          ))}
        </Select>

        <Typography variant="h6" noWrap component="div">
          Starting City
        </Typography>
        <Select
          value={selectedCity}
          sx={{ background: 'rgba(0,0,0, 0.25)', width: '75%' }}
          onChange={(e) => setSelectedCity(e.target.value)}
        >
          {startingCities.map(([value, display]) => (
            <MenuItem value={value}>{display}</MenuItem>
          ))}
        </Select>

        <Button
          disabled={character.statPoints > 0 || name === ''}
          sx={{ width: '80%', marginTop: '30px !important' }}
          onClick={() => {
            createCharacter();
          }}
          variant="outlined"
        >
          Create Character
        </Button>
      </FormControl>

      <Stack direction={'column'} className="char-create-name">
        <TextField
          autoComplete="off"
          InputProps={{
            sx: {
              background: 'rgba(0,0,0,0.5) !important',
              margin    : '5px auto !important',
            },
          }}
          label="Name"
          variant="outlined"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Button
          sx={{
            marginTop    : '20px !important',
            textTransform: 'none',
            width        : '200px',
            margin       : '5px auto !important',
          }}
          onClick={() => {
            const nameMap = {
              [Races.HUMAN]    : 'human',
              [Races.BARBARIAN]: 'cavePerson',
              [Races.ERUDITE]  : 'drow',
              [Races.WOODELF]  : 'elf',
              [Races.HIGHELF]  : 'highelf',
              [Races.DARKELF]  : 'darkelf',
              [Races.HALFELF]  : 'human',
              [Races.DWARF]    : 'dwarf',
              [Races.TROLL]    : 'ogre',
              [Races.OGRE]     : 'ogre',
              [Races.HALFLING] : 'halfling',
              [Races.GNOME]    : 'gnome',
            };

            let name = nameByRace(nameMap[selectedRace], {
              gender: gender === 0 ? 'male' : 'female',
            });

            name = name.replaceAll('-', '');
            name = name.toLowerCase();
            name = name[0].toUpperCase() + name.slice(1);
            name = name.split(' ')[0];
            setName(name);
          }}
          variant="outlined"
        >
          Generate Random Name
        </Button>
        <Box className="char-description">
          {EQStrings[description]?.split('<BR>').map((c) => (
            <>
              <Typography variant="p">{c}</Typography>
              <br />
            </>
          ))}
        </Box>
      </Stack>
    </>
  );
};
