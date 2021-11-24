import mockZoneSpawns from './mockZoneSpawns.json';

const evalReturnMap = () => ({
  'Zone.ShortName'    : 'qeytoqrg',
  'Me.Level'          : 8,
  'Me.X'              : 0,
  'Me.Y'              : 0,
  'Me.Z'              : 0,
  'Me.Heading.Degrees': 360 * Math.random(),
});

export const mockMq = {
  eval(str) {
    return evalReturnMap()[str];
  },
  getZoneSpawns: () =>
    mockZoneSpawns.map((s) => ({ ...s, x: s.x + Math.random() * 10 })),
  mock: true,
};
