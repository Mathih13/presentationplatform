// Who holds each context ring, for ContextPeopleMap. Tune `who` to the audience's real roles.
// Inside-out. `r` is the outer radius of each ring.
export const RINGS = [
  { name: 'Kode', r: 120, fill: '#a5d8ff', who: 'Utviklerne' },
  { name: 'Team', r: 205, fill: '#ffffff', who: 'Teamet — produkteier, design, test' },
  { name: 'Domene', r: 290, fill: '#b2f2bb', who: 'Fagfolk — rute, billett, kundesenter, drift' },
  { name: 'Selskap', r: 375, fill: '#ffec99', who: 'Ledelse og strategi' },
  {
    name: 'Industri',
    r: 460,
    fill: '#ffc9c9',
    who: 'Fylkeskommune, Entur, regelverk, anskaffelser',
  },
];
