export const p99Offsets = {
  version    : 'titanium',
  pointerSize: 4,
  eq         : {
    pointer  : 0x988DF0,
    gamestate: { offset: 0xB54, size: 4 }
  },
  zoneHeader: {
    offset       : 0x9239e0,
    size         : 0x240,
    characterName: { offset: 0x0, size: 0x40 },
    shortName    : { offset: 0x40, size: 0x20 },
    longName     : { offset: 0x60, size: 0x80 },
    gravity      : { offset: 0x1a4, size: 4 },
  },
  spawnList: {
    pointer: 0x905cc4,
  },
  character: {
    pointer: 0x905cf8,
  },
  groupInfo: {
    pointer  : 0x904248,
    groupList: {
      offset: 0x148, size: 4 * 5
    }
  },
  target: {
    pointer: 0x905D04
  },
  spawn: {
    offset       : 0x0,
    size         : 0x348,
    nextPtr      : { offset: 0x0214, size: 4 },
    x            : { offset: 0x34, size: 4 },
    y            : { offset: 0x30, size: 4 },
    z            : { offset: 0x38, size: 4 },
    id           : { offset: 0x0258, size: 4 },
    name         : { offset: 0x0120, size: 0x40 },
    displayedName: { offset: 0x0160, size: 0x40 },
    level        : { offset: 0x024c, size: 1 },
    heading      : { offset: 0x004c, size: 4 },
    classId      : { offset: 0x0252, size: 1 },
    race         : { offset: 0x0260, size: 4 },
    hp           : { offset: 0x0274, size: 4 },
    maxHp        : { offset: 0x0284, size: 4 },
    spawnType    : { offset: 0x0244, size: 1 },
    gender       : { offset: 0x024e, size: 1 },
    holding      : { offset: 0x024b, size: 1 },
    speed        : { offset: 0x0230, size: 4 },
    levitate     : { offset: 0x028c, size: 1 },
  },
};

export default p99Offsets;