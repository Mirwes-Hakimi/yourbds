// ─────────────────────────────────────────────────────────────
// dmvOffices.js — real California DMV field offices, shared by:
//   - src/data/cityPages.js  (the "DMV Offices Near <city>" sections)
//   - src/pages/BookingPage.jsx (the "which DMV are you testing at" hints)
//
// Every address/URL below was checked against the office's own page on
// dmv.ca.gov. Offices open, close and change hours, so re-verify from time
// to time. Keep this file plain data (no React, no import.meta.env):
// middleware.js imports it at the edge through cityPages.js.
// ─────────────────────────────────────────────────────────────

// Link to the DMV's own directory, used when a city has no dedicated
// field-office page we can point to.
export const DMV_LOCATIONS_URL = "https://www.dmv.ca.gov/portal/locations/";

// Office records, so an office that appears on more than one city's page
// (e.g. Concord, used by Concord, Walnut Creek and others) has its address
// written only once.
export const OFFICES = {
  sanFrancisco: {
    name: "San Francisco DMV field office",
    address: "1377 Fell Street, San Francisco, CA 94117",
    url: "https://www.dmv.ca.gov/portal/field-office/san-francisco/",
  },
  dalyCity: {
    name: "Daly City DMV field office",
    address: "1500 Sullivan Avenue, Daly City, CA 94015",
    url: "https://www.dmv.ca.gov/portal/field-office/daly-city/",
  },
  concord: {
    name: "Concord DMV field office",
    address: "2070 Diamond Boulevard, Concord, CA 94520",
    url: "https://www.dmv.ca.gov/portal/field-office/concord/",
  },
  pleasanton: {
    name: "Pleasanton DMV field office",
    address: "6300 W Las Positas Blvd, Pleasanton, CA 94588",
    url: "https://www.dmv.ca.gov/portal/field-office/pleasanton/",
  },
  pleasantonStoneridge: {
    name: "Pleasanton Stoneridge DMV field office",
    address: "2621 Stoneridge Mall, Unit G225B, Pleasanton, CA 94588",
    url: "https://www.dmv.ca.gov/portal/field-office/pleasanton-stoneridge/",
  },
  hayward: {
    name: "Hayward DMV field office",
    address: "150 Jackson Street, Hayward, CA 94544",
    url: "https://www.dmv.ca.gov/portal/field-office/hayward/",
  },
  fremont: {
    name: "Fremont DMV field office",
    address: "4287 Central Avenue, Fremont, CA 94536",
    url: "https://www.dmv.ca.gov/portal/field-office/fremont/",
  },
  oakland: {
    name: "Oakland DMV field office (Claremont)",
    address: "5300 Claremont Avenue, Oakland, CA 94618",
    url: "https://www.dmv.ca.gov/portal/field-office/oakland/",
  },
  oaklandColiseum: {
    name: "Oakland Coliseum DMV field office",
    address: "501 85th Avenue, Oakland, CA 94621",
    url: "https://www.dmv.ca.gov/portal/field-office/oakland-coliseum/",
  },
  elCerrito: {
    name: "El Cerrito DMV field office",
    address: "6400 Manila Avenue, El Cerrito, CA 94530",
    url: "https://www.dmv.ca.gov/portal/field-office/el-cerrito/",
  },
  corteMadera: {
    name: "Corte Madera DMV field office",
    address: "75 Tamal Vista Boulevard, Corte Madera, CA 94925",
    url: "https://www.dmv.ca.gov/portal/field-office/corte-madera/",
  },
  novato: {
    name: "Novato DMV field office",
    address: "936 7th Street A, Novato, CA 94947",
    url: "https://www.dmv.ca.gov/portal/field-office/novato/",
  },
  fairfield: {
    name: "Fairfield DMV field office",
    address: "160 Serrano Drive, Fairfield, CA 94533",
    url: "https://www.dmv.ca.gov/portal/field-office/fairfield/",
  },
  vallejo: {
    name: "Vallejo DMV field office",
    address: "200 Couch Street, Vallejo, CA 94590",
    url: "https://www.dmv.ca.gov/portal/field-office/vallejo/",
  },
  pittsburg: {
    name: "Pittsburg DMV field office",
    address: "1399 Buchanan Road, Pittsburg, CA 94565",
    url: "https://www.dmv.ca.gov/portal/field-office/pittsburg/",
  },
};

// Suggestions for the booking form's "which DMV are you taking your road
// test at?" box. Students can also type any other office, so this list only
// needs to cover the common ones — add names here as customers use new ones.
// Named like the calendar titles: "<City> DMV".
export const DMV_TEST_LOCATION_SUGGESTIONS = [
  "Hayward DMV",
  "Fremont DMV",
  "Oakland DMV (Claremont)",
  "Oakland Coliseum DMV",
  "El Cerrito DMV",
  "Concord DMV",
  "Pittsburg DMV",
  "Pleasanton DMV",
  "Pleasanton Stoneridge DMV",
  "San Francisco DMV",
  "Daly City DMV",
  "Corte Madera DMV",
  "Novato DMV",
  "Petaluma DMV",
  "Santa Rosa DMV",
  "Redwood City DMV",
  "Vallejo DMV",
  "Fairfield DMV",
  "Sacramento DMV",
  "Sacramento La Mancha DMV",
  "Roseville DMV",
  "Folsom DMV",
  "Rocklin DMV",
  "Carmichael DMV",
];
