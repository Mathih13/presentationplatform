// The context rings, inside-out. `r` is each ring's outer radius; `who` is who holds it in the
// audience's organisation (tune it to their real roles). `period` is seconds per revolution and
// `dir` the direction when the rings drift: code changes daily, industry over decades.
export const RINGS = [
  { name: 'Kode', r: 120, fill: '#a5d8ff', who: 'Utviklerne', period: 7, dir: 1 },
  {
    name: 'Team',
    r: 205,
    fill: '#ffffff',
    who: 'Produkteier, design, test',
    period: 16,
    dir: -1,
  },
  {
    name: 'Domene',
    r: 290,
    fill: '#b2f2bb',
    who: 'Rute, billett, kundesenter, drift',
    period: 34,
    dir: 1,
  },
  { name: 'Selskap', r: 375, fill: '#ffec99', who: 'Ledelsen', period: 70, dir: -1 },
  {
    name: 'Industri',
    r: 460,
    fill: '#ffc9c9',
    who: 'Fylkeskommunen, Entur, regelverk',
    period: 140,
    dir: 1,
  },
];
