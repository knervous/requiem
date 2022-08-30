const liveTemplate = {
  version    : 'live',
  pointerSize: 8,
  eq         : { pointer: 12487376, gamestate: { offset: 1508, size: 4 } },
  zoneHeader : {
    offset       : 12031684,
    size         : 676,
    characterName: { offset: 0, size: 0 },
    shortName    : { offset: 0, size: 128 },
    longName     : { offset: 128, size: 128 },
    gravity      : { offset: 480, size: 4 }
  },
  spawnList: {
    pointer  : -1,
    hashTable: { pointer: 12477920, next: { offset: 16, size: 8 } }
  },
  character: { pointer: 11999560 },
  groupInfo: { pointer: 12011736, groupList: { offset: 8, size: 20 } },
  target   : { pointer: 11999728 },
  spawn    : {
    offset       : 0,
    size         : 8064,
    nextPtr      : { offset: 0, size: 0 },
    x            : { offset: 120, size: 4 },
    y            : { offset: 116, size: 4 },
    z            : { offset: 124, size: 4 },
    id           : { offset: 360 },
    name         : { offset: 180, size: 64 },
    displayedName: { offset: 244, size: 64 },
    level        : { offset: 1420, size: 1 },
    heading      : { offset: 144, size: 4 },
    classId      : { offset: 1184, size: 1 },
    race         : { offset: 0, size: 0 },
    hp           : { offset: 1616, size: 8 },
    maxHp        : { offset: 1456, size: 8 },
    spawnType    : { offset: 309, size: 1 },
    gender       : { offset: 0, size: 0 },
    holding      : { offset: 0, size: 0 }
  }
};

const hexRegex = /0x[0-9A-Fa-f]+/;
const lineRegex = /\r\n|\r|\n/;

const extractOffset = line => {
  const [offset] = hexRegex.exec(line);
  return parseInt(offset, 16);
};

const getLineAttribute = line => {
  const maxName = 64;
  const [offset, type, name] = line.split(' ').filter(Boolean);
  const map = {
    float         : 4,
    uint8_t       : 1,
    int64_t       : 8,
    bool          : 1,
    'unsigned int': 4,
    int           : 4
  };
  let size;
  if (map[type]) {
    size = map[type];
  } else if (type === 'char') {
    if (name.includes('EQ_MAX_NAME')) {
      size = maxName;
    } else if (/\[[0-9]+\]/.test(name)) {
      const [, charSize] = /\[([0-9]+)\]/.exec(name);
      size = +charSize;
    } else {
      size = extractOffset(name);
    }
  }
  return {
    offset: extractOffset(offset),
    size
  };
};

export const extractLive = (eqgame, playerClient, pcClient, everquest, globals) => {
  const eqGameOffset = extractOffset(
    globals.split(lineRegex).find(l => l.includes(') + EQGameBaseAddress'))
  );
  for (const line of eqgame.split(lineRegex)) {
    // EQ info
    if (line.includes('pinstCEverQuest_x')) {
      liveTemplate.eq.pointer = extractOffset(line) - eqGameOffset;
    }

    // Zone Info
    if (line.includes('instEQZoneInfo_x')) {
      liveTemplate.zoneHeader.offset = extractOffset(line) - eqGameOffset;
    }

    // Local character
    if (line.includes('pinstLocalPlayer_x')) {
      liveTemplate.character.pointer = extractOffset(line) - eqGameOffset;
    }

    // Target
    if (line.includes('pinstTarget_x')) {
      liveTemplate.target.pointer = extractOffset(line) - eqGameOffset;
    }

    // Spawn List
    if (line.includes('pinstSpawnManager_x')) {
      const base = extractOffset(line);
      liveTemplate.spawnList.pointer = -1;
      liveTemplate.spawnList.hashTable = {
        pointer: base - eqGameOffset,
        next   : { offset: 0x10, size: 8 }
      };
    }

    // Group
    if (line.includes('pinstLocalPC_x')) {
      const pcClientBase = extractOffset(line);
      const groupBase = extractOffset(
        pcClient.split(lineRegex).find(l => /CGroup\*\W+Group;/.test(l))
      );
      const firstGroupMember = extractOffset(
        pcClient
          .split(lineRegex)
          .find(l =>
            /CGroupMember\*\W+m_groupMembers\[MAX_GROUP_SIZE\];/.test(l)
          )
      );
      liveTemplate.groupInfo.pointer = pcClientBase + groupBase - eqGameOffset;
      liveTemplate.groupInfo.groupList.offset = firstGroupMember;
    }
  }
  for (const line of everquest.split(lineRegex)) {
    if (line.includes('zoneHeader_size =') && !liveTemplate.zoneHeader.size) {
      liveTemplate.zoneHeader.size = extractOffset(line);
    }

    if (line.includes(' ShortName')) {
      liveTemplate.zoneHeader.shortName = getLineAttribute(line);
    }

    if (line.includes(' LongName')) {
      liveTemplate.zoneHeader.longName = getLineAttribute(line);
    }

    if (line.includes(' ZoneGravity')) {
      liveTemplate.zoneHeader.gravity = getLineAttribute(line);
    }

    if (line.includes(' GameState;')) {
      liveTemplate.eq.gamestate = getLineAttribute(line);
    }
  }

  const playerBaseIdx = playerClient
    .split(lineRegex)
    .findIndex(a => a.includes('class [[offsetcomments]] PlayerBase'));

  for (const [idx, line] of Object.entries(playerClient.split(lineRegex))) {
    if (line.includes('PlayerClient_size = ')) {
      liveTemplate.spawn.size = extractOffset(line);
    }

    if (+idx > playerBaseIdx && line.includes(' X;')) {
      liveTemplate.spawn.x = getLineAttribute(line);
    }

    if (+idx > playerBaseIdx && line.includes(' Y;')) {
      liveTemplate.spawn.y = getLineAttribute(line);
    }

    if (+idx > playerBaseIdx && line.includes(' Z;')) {
      liveTemplate.spawn.z = getLineAttribute(line);
    }

    if (+idx > playerBaseIdx && line.includes('  SpawnID;')) {
      liveTemplate.spawn.id = getLineAttribute(line);
    }

    if (+idx > playerBaseIdx && line.includes('  Name[')) {
      liveTemplate.spawn.name = getLineAttribute(line);
    }

    if (+idx > playerBaseIdx && line.includes('  DisplayedName[')) {
      liveTemplate.spawn.displayedName = getLineAttribute(line);
    }

    if (+idx > playerBaseIdx && line.includes('  Heading;')) {
      liveTemplate.spawn.heading = getLineAttribute(line);
    }

    if (+idx > playerBaseIdx && line.includes('  CharClass;')) {
      liveTemplate.spawn.classId = getLineAttribute(line);
    }

    if (+idx > playerBaseIdx && line.includes('  HPCurrent;')) {
      liveTemplate.spawn.hp = getLineAttribute(line);
    }

    if (+idx > playerBaseIdx && line.includes('  Level;')) {
      liveTemplate.spawn.level = getLineAttribute(line);
    }

    if (+idx > playerBaseIdx && line.includes('  HPMax;')) {
      liveTemplate.spawn.maxHp = getLineAttribute(line);
    }

    if (+idx > playerBaseIdx && line.includes('  Type;')) {
      liveTemplate.spawn.spawnType = getLineAttribute(line);
    }
  }

  return liveTemplate;
};

// const fs = require('fs');

// extractLive(
//   fs.readFileSync('./eqgame.h', 'utf8'),
//   fs.readFileSync('./PlayerClient.h', 'utf-8'),
//   fs.readFileSync('./PcClient.h', 'utf-8'),
//   fs.readFileSync('./EverQuest.h', 'utf-8'),
//   fs.readFileSync('./Globals.h', 'utf-8')
// );
