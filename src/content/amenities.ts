/**
 * Amenities at the Alabang clinic, from the clinic guide "Geneva Amenities" (October 2026).
 *
 * Content rules from the guide:
 * - Describe the First Class machine as "for hair concerns" (no regrowth claims).
 * - Never say the steaming & detox room removes toxins.
 * - Whether the sauna, bathtub and steam cocoons are booked separately or included with
 *   treatments is not confirmed, so the site does not say either way.
 */
export interface Amenity {
  name: string;
  body: string;
}

export interface AmenityGroup {
  id: string;
  title: string;
  /** Short qualifier shown beside the group title. */
  note?: string;
  items: Amenity[];
}

export const amenitiesIntro = {
  eyebrow: "Clinic Guide · Alabang",
  title: "Amenities",
  lede: "Every space inside Geneva, room by room — thirteen spaces from arrival to the sauna.",
  location: "Alabang, Muntinlupa",
};

export const amenityGroups: AmenityGroup[] = [
  {
    id: "arrival",
    title: "Arrival & common areas",
    items: [
      { name: "Reception", body: "Where every visit begins, “where comfort, care and wellness come together.”" },
      { name: "Lobby & Coffee Station", body: "A calm arrival space with a coffee station for clients." },
      {
        name: "Consultation Room",
        body: "A private room where clients consult with our trichologist (hair and scalp specialist) before treatment.",
      },
      { name: "Waiting Lounge", body: "A very large lounge for clients to relax before and after their sessions." },
    ],
  },
  {
    id: "treatment-rooms",
    title: "Treatment rooms",
    items: [
      { name: "Head Spa Room", body: "A relaxing deep cleanse for the hair and scalp. Come with friends, family or a partner." },
      { name: "Treatment Hallway", body: "Nine treatment rooms, including three VIP rooms that each fit one or two people." },
      { name: "Scalp Room", body: "A dedicated room for scalp treatments." },
      { name: "First Class Room", body: "A hair and scalp room with a specialised machine for hair concerns." },
      {
        name: "VIP Treatment Room",
        body: "Two beds for couples or family visits. Our facial room, also used for diode hair removal and body sculpting.",
      },
    ],
  },
  {
    id: "prestige",
    title: "Prestige area",
    note: "For VIP clients",
    items: [
      {
        name: "VIP Suite",
        body: "A private suite with its own amenities, a treatment bed and an exclusive cocoon reserved for VIP clients.",
      },
      { name: "Body Scrub & Bathtub Area", body: "A bathtub with a sauna, so clients can unwind while bathing." },
    ],
  },
  {
    id: "heat-relaxation",
    title: "Heat & relaxation",
    items: [
      { name: "Steaming & Detox Room", body: "Four cocoons side by side, so clients can come together with family and friends." },
      { name: "Sauna", body: "A private sauna that fits one or two people, made for couples and loved ones." },
    ],
  },
];

export const amenitiesAlsoOnSite = "Private restrooms with showers.";

/** Running count across groups, so numbering matches the clinic guide (01–13). */
export const amenityCount = amenityGroups.reduce((n, g) => n + g.items.length, 0);
