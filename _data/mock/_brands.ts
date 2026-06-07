import _mock from './_mock';

// ----------------------------------------------------------------------

const CONSTRUCTION_BRANDS = [
  { name: 'Barratt Developments', file: 'barratt.svg' },
  { name: 'Persimmon Homes', file: 'persimmon.svg' },
  { name: 'Taylor Wimpey', file: 'taylor-wimpey.svg' },
  { name: 'Bellway Homes', file: 'bellway.svg' },
  { name: 'Redrow', file: 'redrow.svg' },
  { name: 'Berkeley Group', file: 'berkeley.svg' },
  { name: 'Vistry Group', file: 'vistry.svg' },
  { name: 'Willmott Dixon', file: 'willmott-dixon.svg' },
  { name: 'Kier', file: 'kier.svg' },
  { name: 'Morgan Sindall', file: 'morgan-sindall.svg' },
];

export const _brands = CONSTRUCTION_BRANDS.map((brand, index) => ({
  id: _mock.id(index),
  name: brand.name,
  image: `/assets/logos/${brand.file}`,
}));

export const _brandsColor = CONSTRUCTION_BRANDS.map((brand, index) => ({
  id: _mock.id(index),
  name: brand.name,
  image: `/assets/logos/${brand.file}`,
}));
