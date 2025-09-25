export const ROUTES = {
  home: '/',
  ideaBooks: '/idea-books',
  findProfessional: '/professionals',
  speakWithAdvisor: '/speak-with-an-advisor',
  hardwareShops: '/professionals/hardware-shops',
  commercialStores: '/professionals/commercial-stores',
  tilesAndCarpets: '/professionals/tiles-and-carpets',
  generalContractors: '/professionals/general-contractors',
  cabinets: '/professionals/cabinets',
  furniture: '/professionals/furniture',
  electricalAndLighting: '/professionals/electrical-and-lighting',
  plumbing: '/professionals/plumbing',
  paintAndWallpapers: '/professionals/paint-and-wallpapers',
  flooringAndTile: '/professionals/flooring-and-tile',
  roofing: '/professionals/roofing',
  engineers: '/professionals/engineers',
  designers: '/professionals/designers',
  architects: '/professionals/architects',
} as const;

export type RouteKey = keyof typeof ROUTES;

