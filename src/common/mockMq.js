import mockZoneSpawns from './mockZoneSpawns.json';

const evalReturnMap = {
  'Zone.ShortName': 'qeytoqrg',
  'Me.Level'      : 8,
  'Me.X'          : 8 * Math.random(),
  'Me.Y'          : 8 * Math.random(),
  'Me.Z'          : 8 * Math.random(),
};

export const mockMq = {
  eval(str) {
    return evalReturnMap[str];
  },
  getZoneSpawns: () =>
    mockZoneSpawns.map((s) => ({ ...s, x: s.x + Math.random() * 10 })),
  mock: true,
};
