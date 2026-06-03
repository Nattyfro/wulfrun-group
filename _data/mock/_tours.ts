import { add } from 'date-fns';
//
import _mock from './_mock';

// ----------------------------------------------------------------------

const CONTINENTS = [
  'Asia',
  'Europe',
  'Africa',
  'Australia',
  'North America',
  'South America',
  'Antarctica',
  'Asia',
  'Europe',
  'Africa',
  'Australia',
  'North America',
  'South America',
  'Antarctica',
  'South America',
  'Antarctica',
];

export const _tours = [...Array(12)].map((_, index) => ({
  id: _mock.id(index),
  coverImg: _mock.image.travel(index),
  heroImg: _mock.image.travelLarge(index),
  slug: _mock.text.tourName(index),
  availableStart: add(new Date(), { days: 2 }),
  availableEnd: add(new Date(), { months: 4 }),
  location: _mock.address.country(index),
  continent: CONTINENTS[index],
  duration: '3 days 2 nights',
  priceSale: (index === 2 && 89.99) || (index === 5 && 69.99) || 0,
  reviews: 345,
  favorited: index === 2 || index == 4 || false,
  ratings: 3.5 + index / 10,
  tourGuide: {
    name: _mock.name.fullName(index),
    picture: _mock.image.avatar(index),
    quotes: 'Member since Mar 15, 2021',
    verified: true,
    ratings: 5,
    reviews: 345,
    about:
      'Integer tincidunt. Nullam dictum felis eu pede mollis pretium. Maecenas ullamcorper, dui et placerat feugiat, eros pede varius nisi, condimentum viverra felis nunc et lorem.',
    shareLinks: _mock.shareLinks,
  },
  includes: [
    { label: 'Natural Slates', enabled: true },
    { label: 'Breathable Felt', enabled: true },
    { label: 'Wet Verges', enabled: true },
    { label: 'Clay Ridges', enabled: true },
    { label: 'Lead Valleys', enabled: true },
    { label: 'Leaded Sadles', enabled: true },
    // { label: 'Private tour', enabled: false },
    // { label: 'Professional guide', enabled: false },
    // { label: 'Special activities', enabled: false },
    // { label: 'Transport by air-conditioned', enabled: false },
  ],
  languages: ['Russian', 'Spanish'],
  tags: ['Lamp', 'A man', 'Human', 'Lantern', 'Festival'],
  gallery: [...Array(6)].map((_, index) => _mock.image.travel(index + 1)),
  description: _mock.text.description(index),
  highlights: [...Array(6)].map((_, index) => _mock.text.sentence(index)),
  program: [...Array(3)].map((_, index) => ({
    label: `Day ${index + 1}`,
    text: _mock.text.description(index),
  })),
  shareLinks: _mock.shareLinks,
}));
