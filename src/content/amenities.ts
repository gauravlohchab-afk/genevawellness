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
  /** Photo of this space at the Alabang clinic, when there is one. */
  image?: { src: string; alt: string };
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
      { name: "Reception", image: { src: "/images/clinic/reception-desk.webp", alt: "The reception desk beneath the Geneva Wellness Institute sign" }, body: "Where every visit begins, “where comfort, care and wellness come together.”" },
      { name: "Lobby & Coffee Station", image: { src: "/images/clinic/lobby-arrival.webp", alt: "The bright arrival lobby, with reception and the treatment hallway beyond" }, body: "A calm arrival space with a coffee station for clients." },
      {
        name: "Consultation Room",
        image: { src: "/images/clinic/consultation-room.webp", alt: "Consultation Room sign beside a flower arrangement" },
        body: "A private room where clients consult with our trichologist (hair and scalp specialist) before treatment.",
      },
      { name: "Waiting Lounge", image: { src: "/images/clinic/waiting-lounge-lights.webp", alt: "The waiting lounge with velvet sofas and lit wall panels" }, body: "A very large lounge for clients to relax before and after their sessions." },
    ],
  },
  {
    id: "treatment-rooms",
    title: "Treatment rooms",
    items: [
      { name: "Head Spa Room", image: { src: "/images/clinic/head-spa-tray.webp", alt: "Brass bowls and tools prepared for a head spa treatment" }, body: "A relaxing deep cleanse for the hair and scalp. Come with friends, family or a partner." },
      { name: "Treatment Hallway", image: { src: "/images/clinic/treatment-hallway.webp", alt: "The treatment hallway lined with private rooms" }, body: "Nine treatment rooms, including three VIP rooms that each fit one or two people." },
      { name: "Scalp Room", body: "A dedicated room for scalp treatments." },
      { name: "First Class Room", body: "A hair and scalp room with a specialised machine for hair concerns." },
      {
        name: "VIP Treatment Room",
        image: { src: "/images/clinic/vip-treatment-room.webp", alt: "The VIP treatment room with two treatment beds" },
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
        image: { src: "/images/clinic/prestige-room.webp", alt: "The prestige room for VIP clients, with a living green wall" },
        body: "A private suite with its own amenities, a treatment bed and an exclusive cocoon reserved for VIP clients.",
      },
      { name: "Body Scrub & Bathtub Area", image: { src: "/images/clinic/bath-salts.webp", alt: "Bath salts and body care products laid out on a marble counter" }, body: "A bathtub with a sauna, so clients can unwind while bathing." },
    ],
  },
  {
    id: "heat-relaxation",
    title: "Heat & relaxation",
    items: [
      { name: "Steaming & Detox Room", body: "Four cocoons side by side, so clients can come together with family and friends." },
      { name: "Sauna", image: { src: "/images/clinic/sauna.webp", alt: "Inside the private wooden sauna" }, body: "A private sauna that fits one or two people, made for couples and loved ones." },
    ],
  },
];

export const amenitiesAlsoOnSite = "Private restrooms with showers.";

/** Running count across groups, so numbering matches the clinic guide (01–13). */
export const amenityCount = amenityGroups.reduce((n, g) => n + g.items.length, 0);

/** Photo strip for the amenities page and the homepage teaser. */
export const clinicPhotos = [
  { src: "/images/clinic/lounge-to-reception.webp", alt: "The waiting lounge looking towards reception" },
  { src: "/images/clinic/reception-sign.webp", alt: "The Geneva Wellness Institute sign at reception" },
  { src: "/images/clinic/waiting-lounge.webp", alt: "Waiting lounge with velvet sofas" },
  { src: "/images/clinic/treatment-hallway.webp", alt: "The treatment hallway" },
  { src: "/images/clinic/vip-suite-bed.webp", alt: "A VIP treatment bed in the prestige suite" },
  { src: "/images/clinic/prestige-suite-sign.webp", alt: "The Prestige Executive Suite door" },
  { src: "/images/clinic/vip-room-sign.webp", alt: "The VIP 2 treatment room door" },
  { src: "/images/clinic/head-spa-tray.webp", alt: "Head spa tools and brass bowls" },
  { src: "/images/clinic/geneva-towel.webp", alt: "A Geneva Wellness Institute embroidered towel" },
  { src: "/images/clinic/lounge-cushions.webp", alt: "Velvet sofa with gold-patterned cushions" },
  { src: "/images/clinic/sauna.webp", alt: "The private sauna" },
];
