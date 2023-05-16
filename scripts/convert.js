const fs = require('fs');

const supportedZones = [
  'abysmal', 'acrylia', 'airplane', 'akanon', 'akheva', 'arena', 'barindu', 'befallen', 'beholder', 'blackburrow', 'bothunder', 'burningwood', 'butcher', 'cabeast', 'cabwest',
  'cauldron', 'cazicthule', 'charasis', 'chardok', 'chardokb', 'citymist', 'cobaltscar', 'codecay', 'codecayb', 'crushbone', 'crystal', 'crystalshard', 'dalnir', 'dawnshroud',
  'dreadlands', 'droga', 'drogab', 'dulak', 'eastkarana', 'eastwastes', 'eastwastesshard', 'echo', 'ecommons', 'emeraldjungle', 'erudnext', 'erudnint', 'erudsxing', 'everfrost', 'fearplane', 
  'feerrott', 'felwithea', 'felwitheb', 'ferubi', 'fieldofbone', 'firiona', 'freporte', 'freportn', 'freportw', 'frontiermtns', 'frozenshadow', 'fungusgrove', 'gfaydark', 'greatdivide', 
  'griegsend', 'grimling', 'grobb', 'growthplane', 'guka', 'gukb', 'gukbottom', 'gukc', 'gukd', 'guke', 'gukf', 'gukg', 'gukh', 'guktop', 'gunthak', 'halas', 'hateplane', 'hateplaneb', 
  'hatesfury', 'highkeep', 'hohonora', 'hohonorb', 'hole', 'hollowshade', 'iceclad', 'ikkinz', 'inktuta', 'innothule', 'jaggedpine', 'kael', 'kaelshard', 'kaesora', 'kaladima', 'kaladimb',
  'karnor', 'katta', 'kedge', 'kerraridge', 'kithicor', 'kodtaz', 'kurn', 'lakeofillomen', 'lakerathe', 'letalis', 'lfaydark', 'load', 'maiden', 'mira', 'mirb', 'mirc', 'mird', 'mire', 'mirf',
  'mirg', 'mirh', 'miri', 'mirj', 'mischiefplane', 'mistmoore', 'mmca', 'mmcb', 'mmcc', 'mmcd', 'mmce', 'mmcf', 'mmcg', 'mmch', 'mmci', 'mmcj', 'mseru', 'nadox', 'najena', 'natimbi', 'necropolis', 
  'nedaria', 'nektulos', 'neriaka', 'neriakb', 'neriakc', 'netherbian', 'nexus', 'nightmareb', 'northkarana', 'nro', 'nurga', 'oggok', 'overthere', 'paineel', 'paludal', 'paw', 'permafrost', 'poair',
  'podisease', 'poeartha', 'poearthb', 'pofire', 'poinnovation', 'pojustice', 'poknowledge', 'pomischief', 'ponightmare', 'postorms', 'potactics', 'potimea', 'potimeb', 'potorment', 'potranquility', 'povalor', 'powater', 'qcat', 'qey2hh1', 'qeynos', 'qeynos2', 'qeytoqrg', 'qinimi', 'qrg', 'qvic', 'rathemtn', 'rivervale', 'riwwi', 'ruja', 'rujb', 'rujc', 'rujd', 'ruje', 'rujf', 'rujg', 'rujh', 'ruji', 'rujj', 'runnyeye', 'scarlet', 'sebilis', 'shadeweaver', 'shadowhaven', 'shadowrest', 'sharvahl', 'sirens', 'skyfire', 'skyshrine', 'sleeper', 'sncrematory', 'snlair', 'snplant', 'snpool', 'soldunga', 'soldungb', 'soldungc', 'solrotower', 'soltemple', 'southkarana', 'sseru', 'ssratemple', 'steamfont', 'stonebrunt', 'swampofnohope', 'tacvi', 'taka', 'takb', 'takc', 'takd', 'take', 'takf', 'takg', 'takh', 'taki', 'takj', 'templeveeshan', 'tenebrous', 'thedeep', 'thegrey', 'thurgadina', 'thurgadinb', 'timorous', 'tipt', 'torgiran', 'trakanon', 'tutorial', 'tutoriala', 'tutorialb', 'twilight', 'txevu', 'umbral', 'unrest', 'uqua', 'veeshan', 
  'veksar', 'velketor', 'vexthal', 'vxed', 'wakening', 'warrens', 'warslikswood', 'westwastes'];

const parseContent = result => {
  const zoneDetails = [];
  for (const line of result.split('\n')) {
    if (line.startsWith('P')) {
      const [x, y, z, _1, _2, _3, _4, description] = line.slice(1).split(',').map(t => t.trim());
      zoneDetails.push({ x: +x * -1, y: +y * -1, z: +z, description: description.replace(/_/g, ' ') });
    }
  }
  return zoneDetails;
};

const zones = fs
  .readdirSync('./').filter(a => a.endsWith('.txt') && supportedZones.some(sz => a.startsWith(sz))).map(z => ({ name: z.replace('.txt', ''), contents: parseContent(fs.readFileSync(z, 'utf-8')) }));
const z = {};
for (const { name, contents } of zones) {
  const normalizedName = name.replace(/_\d+/, '');
  z[normalizedName] = [ ...(z[normalizedName] ?? []), ...contents ];
}
fs.writeFileSync('./zoneDetails.json', JSON.stringify(z, null, 2));
// const 

// if (result) {
//     // P 636.0752, -299.8139, -0.9990,  0, 0, 0,  3,  Moreo_(Spells)
//     const zoneDetails = [];
//     for (const line of result.split('\n')) {
//       if (line.startsWith('P')) {
//         const [x, y, z, _1, _2, _3, _4, description] = line.slice(1).split(',').map(t => t.trim());
//         zoneDetails.push({ x: +x * -1, y: +y * -1, z: +z, description });
//       }
//     }
//     setZoneDetails(zoneDetails);
//   }