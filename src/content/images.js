// New project renders are stored in /public/images.
// Older project photos are still loaded from salemestate.com; download them into /public/images to self-host.
const base = 'https://i0.wp.com/salemestate.com/wp-content/uploads';
export const photo = (file, w = 1200) => `${base}/${file}?w=${w}&ssl=1`;

export const IMG = {
  aerial1: '2023/02/DJI_0339-copy.jpg',
  aerial2: '2023/02/DJI_0333-copy.jpg',
  room: '2020/08/room.jpg',
  adji: '2020/08/Adjiringanor2.jpg',
  fourBed: '2020/08/pix_4bed_img.jpg',
  threeEnsuite: '2020/08/3-BEDROOM-ENSUITE.jpeg',
  twoBed: '2020/08/Two-Bedroom-Detached-House.jpg',
  sitePlan: '2020/08/plan-e1597760607415.png',
};

// Salem Estate, Adenta–Oyibi Road (full size and small versions)
export const NEW = {
  villa: { src: '/images/villa-front.jpg', sm: '/images/villa-front-sm.jpg', alt: 'Front view of a Salem Estate home' },
  dusk: { src: '/images/dusk-street.jpg', sm: '/images/dusk-street-sm.jpg', alt: 'Salem Estate street at dusk' },
  day: { src: '/images/aerial-day.jpg', sm: '/images/aerial-day-sm.jpg', alt: 'Aerial view of Salem Estate by day' },
  night: { src: '/images/aerial-night.jpg', sm: '/images/aerial-night-sm.jpg', alt: 'Aerial view of Salem Estate at night' },
  dayRows: { src: '/images/aerial-day-rows.jpg', sm: '/images/aerial-day-rows-sm.jpg', alt: 'Rows of Salem Estate homes from above' },
  nightRows: { src: '/images/aerial-night-rows.jpg', sm: '/images/aerial-night-rows-sm.jpg', alt: 'Salem Estate homes lit up at night' },
};

const art = (n, label, pos) => ({ src: n.src, thumb: n.sm, alt: `${n.alt} (artist\u2019s impression)`, label, pos });
const old = (file, alt, label, pos) => ({ src: photo(file, 1400), thumb: photo(file, 700), alt, label, pos });

// First photo is shown large. Order matters: this is the order of the grid.
export const newPhotos = [
  art(NEW.villa, 'Salem Estate', '50% 55%'),
  art(NEW.dusk, 'Salem Estate', '50% 62%'),
  art(NEW.day, 'Salem Estate'),
  art(NEW.night, 'Salem Estate'),
  art(NEW.dayRows, 'Salem Estate', '50% 45%'),
  art(NEW.nightRows, 'Salem Estate', '50% 45%'),
];
export const oldPhotos = [
  old(IMG.aerial1, 'Aerial view of the City of David community', 'City of David'),
  old(IMG.aerial2, 'City of David from above, showing the estate layout', 'City of David'),
  old(IMG.threeEnsuite, 'Three bedroom ensuite home', 'City of David'),
  old(IMG.room, 'Interior of a three bedroom detached house', 'City of David'),
  old(IMG.twoBed, 'Two bedroom detached expandable house', 'City of David'),
  old(IMG.adji, 'Homes at Adjiringanor', 'Adjiringanor'),
  old(IMG.fourBed, 'Four bedroom home at Adjiringanor', 'Adjiringanor'),
];
export const galleryPhotos = [...newPhotos, ...oldPhotos];
