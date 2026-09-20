// ─────────────────────────────────────────────────────────────
// cityPages.js — content for the /locations/<city> pages, rendered by
// src/pages/CityPage.jsx. Also imported by middleware.js (for crawler
// meta tags) and used to link cities from the /locations hub, so this
// is the one place a city page's facts live.
//
// RULES FOR EDITING THIS FILE:
// - Every fact here must be real. The DMV office addresses below were
//   researched from the California DMV's own field-office pages and
//   cross-checked against other listings. DMV offices open, close, and
//   change hours — re-verify before trusting them long-term (the pages
//   themselves tell visitors to confirm on the DMV website).
// - Keep each city's text genuinely different. Search engines penalize
//   near-duplicate pages, and visitors can tell.
// - Only add a city here once it's actually bookable (its ZIP codes
//   exist in src/data/locations.js and it has pricing in
//   src/pages/Packages.jsx), otherwise visitors land on a dead end.
// - DMV addresses/URLs below were checked against dmv.ca.gov's own
//   field-office pages. Cities WITHOUT a field office say so plainly and
//   point to the nearest one instead of inventing an office.
// - Keep this file plain data (no React, no import.meta.env) because
//   middleware.js imports it at the edge.
// ─────────────────────────────────────────────────────────────

// Link to the DMV's own directory, used when a city has no dedicated
// field-office page we can point to.
export const DMV_LOCATIONS_URL = "https://www.dmv.ca.gov/portal/locations/";

// Shared DMV office records, so an office appearing on more than one
// city's page (e.g. Concord, used by both Concord and Walnut Creek)
// only has its address written once.
const OFFICES = {
  sanFrancisco: {
    name: "San Francisco DMV field office",
    address: "1377 Fell Street, San Francisco, CA 94117",
    url: "https://www.dmv.ca.gov/portal/field-office/san-francisco/",
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
  novato: {
    name: "Novato DMV field office",
    address: "936 7th Street A, Novato, CA 94947",
    url: "https://www.dmv.ca.gov/portal/field-office/novato/",
  },
  pittsburg: {
    name: "Pittsburg DMV field office",
    address: "1399 Buchanan Road, Pittsburg, CA 94565",
    url: "https://www.dmv.ca.gov/portal/field-office/pittsburg/",
  },
};

export const CITY_PAGES = [
  // ── San Francisco ──
  {
    slug: "san-francisco",
    name: "San Francisco",
    title: "Driving Lessons in San Francisco, CA | Best Driving School",
    description:
      "Behind-the-wheel driving lessons and DMV road test preparation for San Francisco drivers, with pick-up and drop-off included. See pricing by ZIP code.",
    summary: "Behind-the-wheel lessons for San Francisco drivers, with pick-up and drop-off included.",
    paragraphs: [
      "Learning to drive in San Francisco comes with challenges you won't find in most other Bay Area cities: steep hills, heavy pedestrian and bike traffic, and a lot of one-way streets. Many students want to practice exactly those situations before their road test, and that's where time with an instructor helps most.",
      "Your instructor picks you up at your address in the city, so there's no need to arrange your own transportation to a meeting point. Sessions can start somewhere calm to build confidence and then move on to the kind of streets you'll actually be tested on.",
    ],
    dmv: {
      body: "Road tests for San Francisco drivers take place at a California DMV field office. The San Francisco field office is on Fell Street.",
      offices: [OFFICES.sanFrancisco],
    },
    nearby: ["Daly City", "Oakland"],
    faqs: [
      {
        q: "Do you offer pick-up in San Francisco?",
        a: "Yes. Pick-up and drop-off are included with every session. Enter your San Francisco ZIP code on the Packages page to see exact pricing.",
      },
      {
        q: "Can I use your car for my DMV road test in San Francisco?",
        a: "Yes. Our DMV package includes a 50-minute warm-up practice before your test and the use of our DMV-approved vehicle for the test itself. You book your test appointment directly with the DMV.",
      },
    ],
  },

  // ── Concord ──
  {
    slug: "concord",
    name: "Concord",
    title: "Driving Lessons in Concord, CA | Best Driving School",
    description:
      "Driving lessons and DMV road test preparation in Concord, CA. Certified instructors, pick-up and drop-off included, with pricing by ZIP code.",
    summary: "Driving lessons and DMV road test preparation for Concord drivers.",
    paragraphs: [
      "Concord sits in the middle of central Contra Costa County, and we serve students throughout the city as well as nearby Pleasant Hill, Walnut Creek, and Pittsburg. Whether you're a teen working toward a license or an adult learning to drive for the first time, lessons are scheduled around your availability.",
      "Every session includes pick-up and drop-off, so your instructor meets you at your home, school, or work in Concord rather than at a set meeting point.",
    ],
    dmv: {
      body: "Concord has its own California DMV field office on Diamond Boulevard. If you're taking your road test there, our DMV package pairs a 50-minute warm-up drive with the use of our DMV-approved vehicle on test day.",
      offices: [OFFICES.concord],
    },
    nearby: ["Pleasant Hill", "Walnut Creek", "Pittsburg"],
    faqs: [
      {
        q: "Where do I take my DMV road test near Concord?",
        a: "The DMV field office in Concord is at 2070 Diamond Boulevard. Road test availability varies, so check the DMV's website when you book your appointment.",
      },
      {
        q: "Do you also serve Pleasant Hill and Walnut Creek?",
        a: "Yes. We serve both, along with Pittsburg. Pricing is set by city, so enter your ZIP code on the Packages page to see what applies to you.",
      },
    ],
  },

  // ── San Ramon ──
  {
    slug: "san-ramon",
    name: "San Ramon",
    title: "Driving Lessons in San Ramon, CA | Best Driving School",
    description:
      "Driving lessons and DMV road test preparation in San Ramon, CA, with pick-up and drop-off included and pricing by ZIP code.",
    summary: "Behind-the-wheel lessons for San Ramon drivers, with pick-up and drop-off included.",
    paragraphs: [
      "We serve San Ramon along with neighboring Danville, Alamo, and Dublin, so students across the San Ramon Valley and Tri-Valley area can book lessons without traveling far.",
      "Your instructor picks you up at your address in San Ramon, and sessions are scheduled around your availability, which makes it easier to fit practice around school, work, or family commitments.",
    ],
    dmv: {
      body: "San Ramon doesn't have its own DMV field office. Drivers here typically test at a field office in a nearby city, such as Pleasanton or Concord. Check the DMV website for current hours and road test availability before you book.",
      offices: [OFFICES.pleasanton, OFFICES.concord],
    },
    nearby: ["Danville", "Alamo", "Dublin"],
    faqs: [
      {
        q: "Is there a DMV office in San Ramon?",
        a: "Not a full field office, to our knowledge. Nearby options include the field offices in Pleasanton and Concord. Confirm current locations on the DMV's website before you book.",
      },
      {
        q: "Do you serve Danville and Alamo as well?",
        a: "Yes. We serve Danville and Alamo along with San Ramon and Dublin. Enter your ZIP code on the Packages page to see pricing for your city.",
      },
    ],
  },

  // ── Dublin ──
  {
    slug: "dublin",
    name: "Dublin",
    title: "Driving Lessons in Dublin, CA | Best Driving School",
    description:
      "Behind-the-wheel driving lessons and DMV road test preparation in Dublin, CA. Pick-up and drop-off included, with pricing by ZIP code.",
    summary: "Driving lessons for Dublin drivers, with pick-up and drop-off included.",
    paragraphs: [
      "Dublin students can book lessons with an instructor who picks them up at home or school. We also serve neighboring Pleasanton, San Ramon, and Livermore, so the same booking process works no matter which of those cities you live in.",
      "Each session includes a certified instructor and the use of our training vehicle, so you don't need access to a car of your own to practice or to take your test.",
    ],
    dmv: {
      body: "Dublin doesn't have its own full DMV field office. Pleasanton, right next door, has two. Check the DMV website for current hours and which office handles road tests when you book.",
      offices: [OFFICES.pleasanton, OFFICES.pleasantonStoneridge],
    },
    nearby: ["Pleasanton", "San Ramon", "Livermore"],
    faqs: [
      {
        q: "Where's the closest DMV to Dublin?",
        a: "Pleasanton has two DMV field offices: one at 6300 W Las Positas Blvd and one at Stoneridge Mall (2621 Stoneridge Mall, Unit G225B). Road test availability can differ between offices, so confirm with the DMV.",
      },
      {
        q: "What's included in a lesson in Dublin?",
        a: "Pick-up and drop-off, a certified instructor, and the use of our training vehicle. See the Packages page for hours and pricing in your ZIP code.",
      },
    ],
  },

  // ── Pleasanton ──
  {
    slug: "pleasanton",
    name: "Pleasanton",
    title: "Driving Lessons in Pleasanton, CA | Best Driving School",
    description:
      "Driving lessons and DMV road test preparation in Pleasanton, CA, where there are two DMV field offices. Pick-up and drop-off included.",
    summary: "Behind-the-wheel lessons and DMV test prep for Pleasanton drivers.",
    paragraphs: [
      "Pleasanton has two California DMV field offices within the city, which makes it convenient to take your road test close to home. We serve Pleasanton students along with neighboring Dublin, Livermore, and San Ramon.",
      "Your instructor picks you up at your Pleasanton address, and our DMV package includes a 50-minute warm-up drive before your test so you're not going in cold.",
    ],
    dmv: {
      body: "Both Pleasanton field offices are listed below. Services and road test availability can differ between them, so check the DMV's website when you book your appointment.",
      offices: [OFFICES.pleasanton, OFFICES.pleasantonStoneridge],
    },
    nearby: ["Dublin", "Livermore", "San Ramon"],
    faqs: [
      {
        q: "Which Pleasanton DMV office should I use for my road test?",
        a: "Availability can differ between the two offices, so check the DMV's website for current road test availability when you book. Our DMV package covers a warm-up drive and the use of our vehicle whichever office you choose.",
      },
      {
        q: "Do you offer lessons in Livermore too?",
        a: "Yes, we serve Livermore along with Pleasanton, Dublin, and San Ramon. Enter your ZIP code on the Packages page to see pricing.",
      },
    ],
  },

  // ── Pittsburg ──
  {
    slug: "pittsburg",
    name: "Pittsburg",
    title: "Driving Lessons in Pittsburg, CA | Best Driving School",
    description:
      "Driving lessons and DMV road test preparation in Pittsburg, CA, with pick-up and drop-off included and pricing by ZIP code.",
    summary: "Driving lessons and DMV road test preparation for Pittsburg drivers.",
    paragraphs: [
      "We serve Pittsburg alongside nearby Antioch, Concord, and Brentwood, so students across East Contra Costa County can book lessons without leaving their part of the county.",
      "Sessions include pick-up and drop-off at your address, and your instructor can adapt each lesson to where you are, whether that's a first time behind the wheel or brushing up before your road test.",
    ],
    dmv: {
      body: "Pittsburg has its own California DMV field office. If you're testing there, our DMV package includes a 50-minute warm-up drive and the use of our DMV-approved vehicle.",
      offices: [OFFICES.pittsburg],
    },
    nearby: ["Antioch", "Concord", "Brentwood"],
    faqs: [
      {
        q: "Where is the Pittsburg DMV?",
        a: "The DMV field office in Pittsburg is at 1399 Buchanan Road. Check the DMV's website for current hours and road test availability before you book.",
      },
      {
        q: "Do you serve Antioch and Brentwood?",
        a: "Yes, we serve both, along with Pittsburg and Concord. Enter your ZIP code on the Packages page to see pricing for your city.",
      },
    ],
  },

  // ── Walnut Creek ──
  {
    slug: "walnut-creek",
    name: "Walnut Creek",
    title: "Driving Lessons in Walnut Creek, CA | Best Driving School",
    description:
      "Driving lessons and DMV road test preparation in Walnut Creek, CA. Pick-up, a warm-up drive, and a DMV-approved vehicle for test day.",
    summary: "Driving lessons and DMV test preparation for Walnut Creek drivers.",
    paragraphs: [
      "We serve Walnut Creek along with neighboring Pleasant Hill, Concord, Alamo, and Danville, so students across the area can book with the same instructors and the same process.",
      "Your instructor picks you up at your Walnut Creek address. If you're preparing for your road test, our DMV package also covers the drive to your test location, a warm-up practice, and the use of our vehicle.",
    ],
    dmv: {
      body: "Walnut Creek's DMV field office on N. Broadway closed in 2020, so road tests for Walnut Creek drivers happen at field offices in other cities, such as Concord or Pleasanton. Confirm current details on the DMV's website before you book.",
      offices: [OFFICES.concord, OFFICES.pleasanton],
    },
    nearby: ["Pleasant Hill", "Concord", "Alamo", "Danville"],
    faqs: [
      {
        q: "Is there a DMV office in Walnut Creek?",
        a: "The Walnut Creek field office closed in 2020. The nearest offices for Walnut Creek drivers are in cities like Concord (2070 Diamond Boulevard) and Pleasanton. Check the DMV's website for current information.",
      },
      {
        q: "Can you drive me to my DMV road test from Walnut Creek?",
        a: "Yes. Our DMV package includes pick-up at your address, a 50-minute warm-up practice drive, and the use of our DMV-approved vehicle for the test.",
      },
    ],
  },

  // ═════════════ East Bay (Alameda & Contra Costa counties) ═════════════

  // ── Hayward ── (our home base — 966 W Winton Ave)
  {
    slug: "hayward",
    name: "Hayward",
    title: "Driving Lessons in Hayward, CA | Best Driving School",
    description:
      "Driving lessons and DMV road test preparation in Hayward, CA, where Best Driving School is based. Pick-up and drop-off included.",
    summary: "Driving lessons from a school based right here in Hayward, with pick-up and drop-off included.",
    paragraphs: [
      "Hayward is home for us: our office is at 966 W Winton Ave, so lessons here start from our own backyard rather than a long drive across the Bay. Teens working toward a permit, adults learning for the first time, and drivers getting ready for a road test all book through the same simple process.",
      "Your instructor picks you up at your Hayward address and drops you back when the session ends. If you're getting ready for the DMV road test, the Hayward field office is close by, and our DMV package gives you a warm-up drive first plus a DMV-approved car for the test itself.",
    ],
    dmv: {
      body: "Hayward has its own California DMV field office on Jackson Street, which offers testing. Book your appointment through the DMV website and confirm current hours before you go.",
      offices: [OFFICES.hayward],
    },
    nearby: ["Fremont", "Oakland", "Pleasanton"],
    faqs: [
      {
        q: "Is Best Driving School located in Hayward?",
        a: "Yes. Our office is at 966 W Winton Ave, Suite B, Hayward, CA 94545. Lessons are pick-up and drop-off, so you don't need to come to us.",
      },
      {
        q: "Where do I take my road test near Hayward?",
        a: "The Hayward DMV field office is at 150 Jackson Street. You schedule your test appointment with the DMV, and our DMV package covers the warm-up drive and the test vehicle.",
      },
    ],
  },

  // ── Fremont ──
  {
    slug: "fremont",
    name: "Fremont",
    title: "Driving Lessons in Fremont, CA | Best Driving School",
    description:
      "Behind-the-wheel driving lessons and DMV road test preparation in Fremont, CA. Certified instructors, with pick-up and drop-off included.",
    summary: "Driving lessons and DMV road test preparation for Fremont drivers.",
    paragraphs: [
      "Fremont is a large, spread-out city, which is exactly why pick-up and drop-off matters: your instructor comes to your home, school, or workplace instead of asking you to get somewhere first. You choose the session times when you book.",
      "Lessons work for every starting point, from a first time behind the wheel to a licensed driver from another state or country who wants to feel comfortable on California roads before taking the DMV road test.",
    ],
    dmv: {
      body: "Fremont has its own California DMV field office on Central Avenue, which offers testing. Our DMV package includes a warm-up drive and a DMV-approved vehicle for your test.",
      offices: [OFFICES.fremont],
    },
    nearby: ["Hayward", "Pleasanton", "Oakland"],
    faqs: [
      {
        q: "Where is the Fremont DMV?",
        a: "The Fremont field office is at 4287 Central Avenue. Check the DMV website for current hours and appointment availability before you book your road test.",
      },
      {
        q: "I'm new to California. Can you help me prepare for the road test?",
        a: "Yes. Our adult lessons cover California road rules and what the DMV examiner looks for, and the DMV package adds a warm-up drive and our test vehicle.",
      },
    ],
  },

  // ── Oakland ── (two DMV offices)
  {
    slug: "oakland",
    name: "Oakland",
    title: "Driving Lessons in Oakland, CA | Best Driving School",
    description:
      "Driving lessons and DMV road test preparation in Oakland, CA, which has two DMV field offices. Pick-up and drop-off included.",
    summary: "Driving lessons and DMV test preparation for Oakland drivers, with pick-up and drop-off included.",
    paragraphs: [
      "Oakland has a mix of hilly residential streets, busy commercial corridors, and freeway access in every direction, so a good lesson plan spends time on all three. Your instructor meets you at your Oakland address and builds each session around what you need most.",
      "Because Oakland has two DMV field offices, one of the useful decisions is where to take your road test. Practicing near the office you choose helps you get familiar with the streets around it before test day.",
    ],
    dmv: {
      body: "Oakland has two California DMV field offices that offer testing. Availability can differ between them, so check the DMV website when you book your appointment.",
      offices: [OFFICES.oakland, OFFICES.oaklandColiseum],
    },
    nearby: ["Hayward", "Walnut Creek", "San Francisco"],
    faqs: [
      {
        q: "Which Oakland DMV office should I take my road test at?",
        a: "Oakland has offices at 5300 Claremont Avenue and 501 85th Avenue (Oakland Coliseum). Check the DMV's website for appointment availability at each, then tell your instructor which one you booked so you can practice nearby.",
      },
      {
        q: "Can I use your car for the Oakland DMV road test?",
        a: "Yes. Our DMV package includes a warm-up practice drive and the use of our DMV-approved vehicle for the test. Your instructor drives you to the DMV.",
      },
    ],
  },

  // ── Livermore ──
  {
    slug: "livermore",
    name: "Livermore",
    title: "Driving Lessons in Livermore, CA | Best Driving School",
    description:
      "Behind-the-wheel driving lessons and DMV road test preparation in Livermore, CA. Pick-up and drop-off included, with pricing by ZIP code.",
    summary: "Behind-the-wheel driving lessons for Livermore drivers, with pick-up and drop-off included.",
    paragraphs: [
      "Livermore students can book lessons without driving anywhere: your instructor picks you up in Livermore and brings you back when the session ends. Lessons are a good fit for teens working through their permit hours and adults who need a patient start.",
      "Tri-Valley roads give you plenty of variety to practice on, from quiet neighborhoods to busier stretches, so your instructor can move you along as your confidence grows.",
    ],
    dmv: {
      body: "Livermore has DMV-authorized partner businesses for some registration services, but not a full field office. For testing, the closest options are in Pleasanton. Confirm what's available on the DMV website when you book.",
      offices: [OFFICES.pleasanton, OFFICES.pleasantonStoneridge],
    },
    nearby: ["Pleasanton", "Dublin", "San Ramon"],
    faqs: [
      {
        q: "Is there a DMV field office in Livermore?",
        a: "The DMV lists partner businesses in Livermore for some registration services, but the nearest full field offices are in Pleasanton.",
      },
      {
        q: "Do you pick up in Livermore?",
        a: "Yes. Pick-up and drop-off are included. Enter your Livermore ZIP code on the Packages page to see pricing.",
      },
    ],
  },

  // ── Pleasant Hill ──
  {
    slug: "pleasant-hill",
    name: "Pleasant Hill",
    title: "Driving Lessons in Pleasant Hill, CA | Best Driving School",
    description:
      "Driving lessons and DMV road test preparation in Pleasant Hill, CA, with pick-up and drop-off included and pricing by ZIP code.",
    summary: "Driving lessons and DMV road test preparation for Pleasant Hill drivers.",
    paragraphs: [
      "Pleasant Hill sits between Concord and Walnut Creek, so lessons here can practice on both quiet residential streets and the busier roads that connect the neighboring cities. Your instructor picks you up from your Pleasant Hill address.",
      "If you're a parent booking for a teen, you choose the session times when you book, and our 6-hour package includes the certificate California requires for teens.",
    ],
    dmv: {
      body: "Pleasant Hill doesn't have its own DMV field office. The closest is in neighboring Concord, on Diamond Boulevard. Confirm hours and testing availability on the DMV website when you book.",
      offices: [OFFICES.concord],
    },
    nearby: ["Concord", "Walnut Creek"],
    faqs: [
      {
        q: "Where do Pleasant Hill drivers take the DMV road test?",
        a: "The nearest field office is in Concord at 2070 Diamond Boulevard. Check the DMV website for current availability.",
      },
      {
        q: "Does the 6-hour package work for teens?",
        a: "Yes. Our 6-hour behind-the-wheel package includes the DMV-required certificate for teens. Check the Teen Driving Lessons page for California's requirements.",
      },
    ],
  },

  // ── Danville ──
  {
    slug: "danville",
    name: "Danville",
    title: "Driving Lessons in Danville, CA | Best Driving School",
    description:
      "Driving lessons and DMV road test preparation in Danville, CA. Pick-up and drop-off included, with pricing by ZIP code.",
    summary: "Behind-the-wheel driving lessons for Danville drivers, with pick-up and drop-off included.",
    paragraphs: [
      "We serve Danville along with San Ramon, Alamo, and Walnut Creek, so students across the San Ramon Valley book the same way. Your instructor picks you up in Danville and schedules around your week.",
      "Sessions can start on quieter residential roads and move to busier ones as your confidence builds, and our 6-hour package includes a 15-minute freeway practice.",
    ],
    dmv: {
      body: "Danville doesn't have a DMV field office of its own. Drivers here usually test at an office in a nearby city such as Pleasanton or Concord. Confirm hours and testing availability on the DMV website.",
      offices: [OFFICES.pleasanton, OFFICES.concord],
    },
    nearby: ["San Ramon", "Alamo", "Walnut Creek"],
    faqs: [
      {
        q: "What is the nearest DMV to Danville?",
        a: "Danville doesn't have its own field office. The nearby options are in Pleasanton (6300 W Las Positas Blvd) and Concord (2070 Diamond Boulevard).",
      },
      {
        q: "Do you also cover Alamo and San Ramon?",
        a: "Yes. Enter your ZIP code on the Packages page to see pricing for your city.",
      },
    ],
  },

  // ── Alamo ──
  {
    slug: "alamo",
    name: "Alamo",
    title: "Driving Lessons in Alamo, CA | Best Driving School",
    description:
      "Driving lessons and DMV road test preparation in Alamo, CA. Pick-up and drop-off included, with pricing by ZIP code.",
    summary: "Driving lessons for Alamo drivers, with pick-up and drop-off included.",
    paragraphs: [
      "Alamo is a small community, so lessons here are all about convenience: your instructor picks you up at home and you don't have to arrange a ride to a driving school office. We also serve neighboring Danville, Walnut Creek, and San Ramon.",
      "Whether you're a teen logging your first behind-the-wheel hours or an adult who needs a refresher, you choose the session times when you book.",
    ],
    dmv: {
      body: "Alamo doesn't have a DMV field office. The nearest options are in Concord and Pleasanton. Confirm hours and testing availability on the DMV website.",
      offices: [OFFICES.concord, OFFICES.pleasanton],
    },
    nearby: ["Danville", "Walnut Creek", "San Ramon"],
    faqs: [
      {
        q: "Is there a DMV in Alamo?",
        a: "No field office. The nearest are in Concord and Pleasanton, listed above. Check the DMV website for availability.",
      },
      {
        q: "How do I see pricing for Alamo?",
        a: "Enter your Alamo ZIP code on the Packages page and it will show the price of every package for your area.",
      },
    ],
  },

  // ── Antioch ──
  {
    slug: "antioch",
    name: "Antioch",
    title: "Driving Lessons in Antioch, CA | Best Driving School",
    description:
      "Driving lessons and DMV road test preparation in Antioch, CA, with pick-up and drop-off included and pricing by ZIP code.",
    summary: "Behind-the-wheel driving lessons for Antioch drivers, with pick-up and drop-off included.",
    paragraphs: [
      "Antioch is in East Contra Costa County, and we serve it along with Pittsburg, Brentwood, and Concord. Your instructor picks you up at your Antioch address, so you can practice without arranging a ride.",
      "Lessons work for teens completing their required behind-the-wheel training as well as adults learning to drive, and you pick the session times when you book.",
    ],
    dmv: {
      body: "Antioch has DMV partner businesses for some services, but not a full field office. The closest field office is in Pittsburg. Confirm hours and testing availability on the DMV website.",
      offices: [OFFICES.pittsburg],
    },
    nearby: ["Pittsburg", "Brentwood", "Concord"],
    faqs: [
      {
        q: "Where do Antioch drivers take the road test?",
        a: "The nearest DMV field office is in Pittsburg at 1399 Buchanan Road. Check the DMV website for current availability.",
      },
      {
        q: "Can you pick me up in Antioch?",
        a: "Yes. Pick-up and drop-off are included with every session.",
      },
    ],
  },

  // ── Brentwood ──
  {
    slug: "brentwood",
    name: "Brentwood",
    title: "Driving Lessons in Brentwood, CA | Best Driving School",
    description:
      "Driving lessons and DMV road test preparation in Brentwood, CA, with pick-up and drop-off included and pricing by ZIP code.",
    summary: "Driving lessons for Brentwood drivers, with pick-up and drop-off included.",
    paragraphs: [
      "Brentwood sits at the eastern edge of the Bay Area, and we serve it along with Antioch and Pittsburg. Because it's a bit farther out, pick-up at your door saves you a real trip.",
      "Your instructor plans each session around your level, so you can start in a quiet area and build up to busier roads as you become more comfortable behind the wheel.",
    ],
    dmv: {
      body: "Brentwood doesn't have its own DMV field office that we're aware of. The closest is in Pittsburg. Confirm hours and testing availability on the DMV website.",
      offices: [OFFICES.pittsburg],
    },
    nearby: ["Antioch", "Pittsburg", "Concord"],
    faqs: [
      {
        q: "What is the nearest DMV to Brentwood?",
        a: "The Pittsburg field office at 1399 Buchanan Road is the closest one we know of. Check the DMV website for the latest information.",
      },
      {
        q: "Is pricing different in Brentwood?",
        a: "Pricing is set by city. Enter your Brentwood ZIP code on the Packages page to see the exact price for each package.",
      },
    ],
  },

  // ═════════════ Alameda & Berkeley corridor ═════════════

  // ── San Leandro ──
  {
    slug: "san-leandro",
    name: "San Leandro",
    title: "Driving Lessons in San Leandro, CA | Best Driving School",
    description:
      "Driving lessons and DMV road test preparation in San Leandro, CA, with pick-up and drop-off included and pricing by ZIP code.",
    summary: "Driving lessons for San Leandro drivers, with pick-up and drop-off included.",
    paragraphs: [
      "San Leandro sits between Oakland and Hayward along the I-880 corridor, which makes it easy for your instructor to reach you from either direction. Lessons start at your San Leandro address, and you choose the session times when you book.",
      "The city's mix of residential streets and busy shopping corridors gives you a realistic range of driving situations to practice, whether you're a teen logging hours or an adult new to driving.",
    ],
    dmv: {
      body: "San Leandro doesn't have its own DMV field office that we're aware of. The closest offices are Hayward and the Oakland Coliseum. Confirm hours and testing availability on the DMV website.",
      offices: [OFFICES.hayward, OFFICES.oaklandColiseum],
    },
    nearby: ["Oakland", "Hayward", "Castro Valley"],
    faqs: [
      {
        q: "Where do San Leandro drivers take the DMV road test?",
        a: "The nearest field offices are in Hayward (150 Jackson Street) and Oakland (501 85th Avenue, near the Coliseum). Availability varies, so check the DMV website when you book.",
      },
      {
        q: "Do I need to meet the instructor somewhere?",
        a: "No. Pick-up and drop-off at your San Leandro address are included in every session.",
      },
    ],
  },

  // ── Castro Valley ──
  {
    slug: "castro-valley",
    name: "Castro Valley",
    title: "Driving Lessons in Castro Valley, CA | Best Driving School",
    description:
      "Driving lessons and DMV road test preparation in Castro Valley, CA. Pick-up and drop-off included, with pricing by ZIP code.",
    summary: "Behind-the-wheel driving lessons for Castro Valley drivers.",
    paragraphs: [
      "Castro Valley is an unincorporated community in Alameda County, tucked between Hayward and the Tri-Valley along the I-580 corridor. We pick you up at your address here, so you don't have to travel to a driving school office.",
      "Hills and winding residential streets are part of everyday driving in Castro Valley, and a lesson is a good place to practice them with an instructor beside you rather than learning alone.",
    ],
    dmv: {
      body: "Castro Valley doesn't have its own DMV field office. The closest are in Hayward and Pleasanton. Confirm hours and testing availability on the DMV website.",
      offices: [OFFICES.hayward, OFFICES.pleasanton],
    },
    nearby: ["Hayward", "San Leandro", "Pleasanton", "Dublin"],
    faqs: [
      {
        q: "What's the nearest DMV to Castro Valley?",
        a: "Hayward's field office at 150 Jackson Street is the closest we know of; Pleasanton is another option. Check the DMV website for availability.",
      },
      {
        q: "How do I see Castro Valley pricing?",
        a: "Enter your Castro Valley ZIP code on the Packages page to see the price of each package.",
      },
    ],
  },

  // ── Union City ──
  {
    slug: "union-city",
    name: "Union City",
    title: "Driving Lessons in Union City, CA | Best Driving School",
    description:
      "Behind-the-wheel driving lessons and DMV road test preparation in Union City, CA, with pick-up and drop-off included.",
    summary: "Driving lessons and DMV road test preparation for Union City drivers.",
    paragraphs: [
      "Union City lies between Hayward and Fremont, and we serve it alongside both. Your instructor picks you up at home, school, or work in Union City and you choose the session times when you book.",
      "Lessons suit new drivers of any age, and if you're heading to the DMV road test, our DMV package includes a warm-up drive and a DMV-approved vehicle for the test.",
    ],
    dmv: {
      body: "Union City doesn't have its own DMV field office that we're aware of. The closest offices are in Fremont and Hayward. Confirm hours and testing availability on the DMV website.",
      offices: [OFFICES.fremont, OFFICES.hayward],
    },
    nearby: ["Fremont", "Hayward", "Newark"],
    faqs: [
      {
        q: "Where's the closest DMV to Union City?",
        a: "Fremont (4287 Central Avenue) and Hayward (150 Jackson Street) are the nearest field offices we know of.",
      },
      {
        q: "Can I use your vehicle for my road test?",
        a: "Yes. The DMV package includes the use of our DMV-approved vehicle, and your instructor drives you to the test.",
      },
    ],
  },

  // ── Newark ──
  {
    slug: "newark",
    name: "Newark",
    title: "Driving Lessons in Newark, CA | Best Driving School",
    description:
      "Driving lessons and DMV road test preparation in Newark, CA, with pick-up and drop-off included and pricing by ZIP code.",
    summary: "Driving lessons for Newark drivers, with pick-up and drop-off included.",
    paragraphs: [
      "Newark is a compact city bordered by Fremont, and we serve both. Your instructor meets you at your Newark address.",
      "If you already have a permit and want to build confidence before the road test, a mock test session simulates the DMV test and gives you feedback afterward.",
    ],
    dmv: {
      body: "Newark doesn't have its own DMV field office that we're aware of. The closest one is in Fremont. Confirm hours and testing availability on the DMV website.",
      offices: [OFFICES.fremont],
    },
    nearby: ["Fremont", "Union City", "Hayward"],
    faqs: [
      {
        q: "Where do Newark drivers take the DMV road test?",
        a: "The Fremont field office at 4287 Central Avenue is the closest one we know of. Confirm availability on the DMV website.",
      },
      {
        q: "What is a mock test?",
        a: "It's a 2-hour session that simulates DMV road test conditions and ends with detailed feedback. See the Packages page for pricing.",
      },
    ],
  },

  // ── Alameda ──
  {
    slug: "alameda",
    name: "Alameda",
    title: "Driving Lessons in Alameda, CA | Best Driving School",
    description:
      "Driving lessons and DMV road test preparation in Alameda, CA. Pick-up and drop-off included, with pricing by ZIP code.",
    summary: "Driving lessons for Alameda drivers, with pick-up and drop-off included.",
    paragraphs: [
      "Alameda is an island city, so getting anywhere off the island means using a bridge or tunnel to Oakland. That's a real part of driving here, and a lesson is a good way to get comfortable with those approaches before you face them alone.",
      "Your instructor picks you up at your Alameda address, and the flat, grid-like streets on the island are a friendly place for a first lesson.",
    ],
    dmv: {
      body: "Alameda doesn't have its own DMV field office that we're aware of. The closest are in Oakland. Confirm hours and testing availability on the DMV website.",
      offices: [OFFICES.oakland, OFFICES.oaklandColiseum],
    },
    nearby: ["Oakland", "San Leandro", "San Francisco"],
    faqs: [
      {
        q: "Where do Alameda drivers take the DMV road test?",
        a: "Oakland has two field offices, at 5300 Claremont Avenue and 501 85th Avenue. Check the DMV website for appointment availability.",
      },
      {
        q: "Can you pick me up on the island?",
        a: "Yes. Pick-up and drop-off at your Alameda address are included in every session.",
      },
    ],
  },

  // ── Berkeley ──
  {
    slug: "berkeley",
    name: "Berkeley",
    title: "Driving Lessons in Berkeley, CA | Best Driving School",
    description:
      "Driving lessons and DMV road test preparation in Berkeley, CA, with pick-up and drop-off included and pricing by ZIP code.",
    summary: "Driving lessons and DMV test preparation for Berkeley drivers.",
    paragraphs: [
      "Driving in Berkeley means sharing narrow streets with cyclists and pedestrians, plenty of stop signs, and steep hill streets. It's a good place to practice the awareness and patience that the DMV examiner is looking for.",
      "Your instructor picks you up at your Berkeley address, whether that's a house, apartment, or campus area, so you can practice without needing a car of your own.",
    ],
    dmv: {
      body: "Berkeley doesn't have its own DMV field office that we're aware of. The Oakland Claremont office is right across the city line. Confirm hours and testing availability on the DMV website.",
      offices: [OFFICES.oakland, OFFICES.oaklandColiseum],
    },
    nearby: ["Oakland", "Emeryville", "El Cerrito"],
    faqs: [
      {
        q: "Where do Berkeley drivers take the road test?",
        a: "The closest field office is the Oakland office at 5300 Claremont Avenue, with a second at 501 85th Avenue. Check the DMV website for availability.",
      },
      {
        q: "Do I need my own car to take lessons?",
        a: "No. Lessons use our training vehicle, and our DMV package includes a DMV-approved vehicle for the road test.",
      },
    ],
  },

  // ── Emeryville ──
  {
    slug: "emeryville",
    name: "Emeryville",
    title: "Driving Lessons in Emeryville, CA | Best Driving School",
    description:
      "Driving lessons and DMV road test preparation in Emeryville, CA, with pick-up and drop-off included.",
    summary: "Driving lessons for Emeryville drivers, with pick-up and drop-off included.",
    paragraphs: [
      "Emeryville is a small city between Oakland and Berkeley, close to the Bay Bridge approach. Busy freeway interchanges are part of everyday driving here, so freeway practice is worth building into your lessons.",
      "Your instructor picks you up at your Emeryville address, and our 6-hour package includes a 15-minute freeway practice.",
    ],
    dmv: {
      body: "Emeryville doesn't have its own DMV field office. The closest are in Oakland. Confirm hours and testing availability on the DMV website.",
      offices: [OFFICES.oakland, OFFICES.oaklandColiseum],
    },
    nearby: ["Oakland", "Berkeley", "San Francisco"],
    faqs: [
      {
        q: "What's the nearest DMV to Emeryville?",
        a: "Oakland's Claremont office (5300 Claremont Avenue) is the closest one we know of, and Oakland Coliseum (501 85th Avenue) is another option.",
      },
      {
        q: "Is freeway practice included?",
        a: "The 6-hour package includes a 15-minute freeway practice. See the Packages page for details.",
      },
    ],
  },

  // ═════════════ West Contra Costa ═════════════

  // ── Richmond ──
  {
    slug: "richmond",
    name: "Richmond",
    title: "Driving Lessons in Richmond, CA | Best Driving School",
    description:
      "Driving lessons and DMV road test preparation in Richmond, CA, with pick-up and drop-off included and pricing by ZIP code.",
    summary: "Driving lessons for Richmond drivers, with pick-up and drop-off included.",
    paragraphs: [
      "Richmond stretches along the bay in West Contra Costa County, with major routes like I-80 and I-580 running through it. We serve Richmond alongside El Cerrito and Berkeley, so instructors are already working in the area.",
      "Your instructor picks you up at your Richmond address, and you choose the session times when you book.",
    ],
    dmv: {
      body: "We're not aware of a full DMV field office in Richmond; DMV-authorized partner businesses handle some services here. The closest field offices are in Oakland. Confirm hours and testing availability on the DMV website.",
      offices: [OFFICES.oakland, OFFICES.oaklandColiseum],
    },
    nearby: ["El Cerrito", "Berkeley", "Martinez"],
    faqs: [
      {
        q: "Is there a DMV office in Richmond?",
        a: "The DMV lists partner businesses in Richmond for some registration services, but the closest field offices we know of are in Oakland.",
      },
      {
        q: "Do you pick up in Richmond?",
        a: "Yes. Pick-up and drop-off are included with every session.",
      },
    ],
  },

  // ── El Cerrito ──
  {
    slug: "el-cerrito",
    name: "El Cerrito",
    title: "Driving Lessons in El Cerrito, CA | Best Driving School",
    description:
      "Driving lessons and DMV road test preparation in El Cerrito, CA, with pick-up and drop-off included and pricing by ZIP code.",
    summary: "Driving lessons for El Cerrito drivers, with pick-up and drop-off included.",
    paragraphs: [
      "El Cerrito is a hillside city between Richmond and Berkeley, so steep residential streets are common. Practicing hill starts and parking on grades with an instructor beside you is worth the time before a road test.",
      "Lessons begin at your El Cerrito address. Book a single 2-hour session to try it out or a longer package if you're starting from scratch.",
    ],
    dmv: {
      body: "El Cerrito doesn't have its own DMV field office that we're aware of. The closest are in Oakland. Confirm hours and testing availability on the DMV website.",
      offices: [OFFICES.oakland],
    },
    nearby: ["Richmond", "Berkeley"],
    faqs: [
      {
        q: "Where do El Cerrito drivers take the road test?",
        a: "The Oakland office at 5300 Claremont Avenue is the closest we know of. Check the DMV website for availability.",
      },
      {
        q: "Can I book just one lesson?",
        a: "Yes. The 2-hour package is a single session. See the Packages page for pricing in your city.",
      },
    ],
  },

  // ── Martinez ──
  {
    slug: "martinez",
    name: "Martinez",
    title: "Driving Lessons in Martinez, CA | Best Driving School",
    description:
      "Driving lessons and DMV road test preparation in Martinez, CA, with pick-up and drop-off included and pricing by ZIP code.",
    summary: "Driving lessons and DMV road test preparation for Martinez drivers.",
    paragraphs: [
      "Martinez is the Contra Costa County seat and sits close to Concord, Pleasant Hill, and Pittsburg, all of which we serve. Your instructor picks you up at your Martinez address.",
      "Whether you're preparing for a first license or a road test, you can choose a package that matches how much practice you need.",
    ],
    dmv: {
      body: "Martinez doesn't have its own DMV field office that we're aware of. The closest is in Concord. Confirm hours and testing availability on the DMV website.",
      offices: [OFFICES.concord],
    },
    nearby: ["Concord", "Pleasant Hill", "Pittsburg"],
    faqs: [
      {
        q: "What's the closest DMV to Martinez?",
        a: "The Concord field office at 2070 Diamond Boulevard is the closest we know of.",
      },
      {
        q: "How do I see pricing for Martinez?",
        a: "Enter your Martinez ZIP code on the Packages page to see all package prices.",
      },
    ],
  },

  // ── Lafayette ──
  {
    slug: "lafayette",
    name: "Lafayette",
    title: "Driving Lessons in Lafayette, CA | Best Driving School",
    description:
      "Driving lessons and DMV road test preparation in Lafayette, CA, with pick-up and drop-off included and pricing by ZIP code.",
    summary: "Driving lessons for Lafayette drivers, with pick-up and drop-off included.",
    paragraphs: [
      "Lafayette runs along Highway 24 and is close to Walnut Creek and Orinda. Your instructor picks you up in Lafayette, so parents of teens don't have to arrange transportation to a lesson.",
      "Windy residential roads are common here, which makes it a good place to practice steady speed control and careful mirror checks.",
    ],
    dmv: {
      body: "Lafayette doesn't have its own DMV field office. The closest are in Concord and Oakland. Confirm hours and testing availability on the DMV website.",
      offices: [OFFICES.concord, OFFICES.oakland],
    },
    nearby: ["Walnut Creek", "Orinda", "Pleasant Hill"],
    faqs: [
      {
        q: "Where do Lafayette drivers take the road test?",
        a: "Concord (2070 Diamond Boulevard) and Oakland (5300 Claremont Avenue) are the closest field offices we know of. Check availability on the DMV website.",
      },
      {
        q: "Do you also serve Orinda?",
        a: "Yes. We serve Orinda, Walnut Creek, and other nearby cities.",
      },
    ],
  },

  // ── Orinda ──
  {
    slug: "orinda",
    name: "Orinda",
    title: "Driving Lessons in Orinda, CA | Best Driving School",
    description:
      "Driving lessons and DMV road test preparation in Orinda, CA, with pick-up and drop-off included and pricing by ZIP code.",
    summary: "Driving lessons for Orinda drivers, with pick-up and drop-off included.",
    paragraphs: [
      "Orinda is a hilly, wooded community between Lafayette and Berkeley, where narrow roads and tight curves are normal. Practicing with an instructor in this kind of terrain builds control that carries over to the road test.",
      "Your instructor picks you up at your Orinda address, and you choose the session times when you book.",
    ],
    dmv: {
      body: "Orinda doesn't have its own DMV field office. The closest are in Oakland and Concord. Confirm hours and testing availability on the DMV website.",
      offices: [OFFICES.oakland, OFFICES.concord],
    },
    nearby: ["Lafayette", "Berkeley", "Walnut Creek"],
    faqs: [
      {
        q: "What's the nearest DMV to Orinda?",
        a: "Oakland's Claremont office (5300 Claremont Avenue) and the Concord office (2070 Diamond Boulevard) are the closest we know of.",
      },
      {
        q: "Can adults take lessons too?",
        a: "Yes. We offer lessons for adult first-time drivers, returning drivers, and people new to California.",
      },
    ],
  },

  // ── Oakley ──
  {
    slug: "oakley",
    name: "Oakley",
    title: "Driving Lessons in Oakley, CA | Best Driving School",
    description:
      "Driving lessons and DMV road test preparation in Oakley, CA, with pick-up and drop-off included and pricing by ZIP code.",
    summary: "Driving lessons for Oakley drivers, with pick-up and drop-off included.",
    paragraphs: [
      "Oakley is in East Contra Costa County, near Antioch and Brentwood. Because it's farther out, having your instructor come to you saves you a real trip.",
      "Lessons are built around your level: start somewhere quiet if you're new, or spend your time on the situations you find hardest.",
    ],
    dmv: {
      body: "Oakley doesn't have its own DMV field office that we're aware of. The closest is in Pittsburg. Confirm hours and testing availability on the DMV website.",
      offices: [OFFICES.pittsburg],
    },
    nearby: ["Antioch", "Brentwood", "Pittsburg"],
    faqs: [
      {
        q: "Where do Oakley drivers take the road test?",
        a: "The Pittsburg field office at 1399 Buchanan Road is the closest we know of.",
      },
      {
        q: "Do you serve Oakley?",
        a: "Yes. Pick-up and drop-off in Oakley are included with every session.",
      },
    ],
  },

  // ═════════════ North Bay ═════════════

  // ── Corte Madera ──
  {
    slug: "corte-madera",
    name: "Corte Madera",
    title: "Driving Lessons in Corte Madera, CA | Best Driving School",
    description:
      "Driving lessons and DMV road test preparation in Corte Madera, CA, with pick-up and drop-off included and pricing by ZIP code.",
    summary: "Driving lessons for Corte Madera drivers, with pick-up and drop-off included.",
    paragraphs: [
      "Corte Madera is in southern Marin County, just north of the Golden Gate Bridge, and we serve it along with the rest of our Bay Area service area. Your instructor picks you up at your Corte Madera address.",
      "Highway 101 runs right past town, so freeway practice is a useful part of a lesson plan here. Our 6-hour package includes a 15-minute freeway practice.",
    ],
    dmv: {
      body: "Corte Madera doesn't have its own DMV field office that we're aware of. Novato is the Marin County field office we know of; San Francisco is another option across the bridge. Confirm hours and testing availability on the DMV website.",
      offices: [OFFICES.novato, OFFICES.sanFrancisco],
    },
    nearby: ["San Francisco", "Vallejo"],
    faqs: [
      {
        q: "Where do Corte Madera drivers take the road test?",
        a: "Novato (936 7th Street A) is the Marin office we know of; San Francisco (1377 Fell Street) is another option. Check the DMV website for availability.",
      },
      {
        q: "Do you pick up in Marin?",
        a: "Yes. We serve Corte Madera with pick-up and drop-off included.",
      },
    ],
  },

  // ── Vallejo ──
  {
    slug: "vallejo",
    name: "Vallejo",
    title: "Driving Lessons in Vallejo, CA | Best Driving School",
    description:
      "Driving lessons and DMV road test preparation in Vallejo, CA, which has its own DMV field office. Pick-up and drop-off included.",
    summary: "Driving lessons and DMV road test preparation for Vallejo drivers.",
    paragraphs: [
      "Vallejo is a waterfront city in Solano County, connected to the rest of the Bay Area by I-80 and I-780. Your instructor picks you up at your Vallejo address and you choose the session times when you book.",
      "Because Vallejo has its own DMV field office, you can practice near the place where you'll be tested and get familiar with the surrounding streets.",
    ],
    dmv: {
      body: "Vallejo has its own California DMV field office on Couch Street, which offers testing. Confirm hours and appointment availability on the DMV website.",
      offices: [OFFICES.vallejo],
    },
    nearby: ["Fairfield", "Martinez", "Corte Madera"],
    faqs: [
      {
        q: "Where is the Vallejo DMV?",
        a: "The Vallejo field office is at 200 Couch Street, Vallejo, CA 94590. Check the DMV website for current hours.",
      },
      {
        q: "Can I use your car for the Vallejo road test?",
        a: "Yes. Our DMV package includes the use of our DMV-approved vehicle for the test.",
      },
    ],
  },

  // ── Fairfield ──
  {
    slug: "fairfield",
    name: "Fairfield",
    title: "Driving Lessons in Fairfield, CA | Best Driving School",
    description:
      "Driving lessons and DMV road test preparation in Fairfield, CA, which has its own DMV field office. Pick-up and drop-off included.",
    summary: "Driving lessons and DMV road test preparation for Fairfield drivers.",
    paragraphs: [
      "Fairfield is the county seat of Solano County, at the junction of I-80 and I-680. That junction makes freeway driving a real part of daily life here, so freeway practice is worth building into your lessons.",
      "Your instructor picks you up at your Fairfield address. If you're heading to the DMV, the Fairfield field office is in town.",
    ],
    dmv: {
      body: "Fairfield has its own California DMV field office on Serrano Drive, which offers testing. Confirm hours and appointment availability on the DMV website.",
      offices: [OFFICES.fairfield],
    },
    nearby: ["Vallejo", "Martinez", "Concord"],
    faqs: [
      {
        q: "Where is the Fairfield DMV?",
        a: "The Fairfield field office is at 160 Serrano Drive, Fairfield, CA 94533. Check the DMV website for current hours.",
      },
      {
        q: "Does my package include freeway practice?",
        a: "The 6-hour package includes a 15-minute freeway practice, and the 8-hour package includes extended freeway and highway practice.",
      },
    ],
  },
];

// Looks up a city page by its URL slug (used by CityPage.jsx).
export function getCityPage(slug) {
  return CITY_PAGES.find((city) => city.slug === slug);
}

// Looks up a city page by display name, so nearby-city mentions and the
// /locations hub can link to a page only when one actually exists.
export function getCityPageByName(name) {
  return CITY_PAGES.find((city) => city.name === name);
}
