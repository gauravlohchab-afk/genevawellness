/**
 * Clinic locations: the single place to edit names, addresses, contacts, hours and maps.
 *
 * Alabang has full details from the current website; Makati and Lavee (Pasig) have their
 * addresses and maps, with contact numbers and hours still to come.
 * A field left `null` renders as "to be confirmed" and never as an invented value.
 */
export type ClinicBrand = "geneva" | "lavee";

export interface Clinic {
  id: string;
  brand: ClinicBrand;
  /** Official display name. */
  name: string;
  /** Short label for selects and chips. */
  shortName: string;
  primary?: boolean;
  /** Placeholder entries are shown with a visible "details coming soon" state. */
  placeholder?: boolean;
  addressLines: string[] | null;
  /** Shown when the address has a known inconsistency that the clinic must resolve. */
  addressNote?: string;
  phones: { label?: string; display: string; tel: string }[];
  email: string | null;
  hours: { days: string; time: string }[] | null;
  /** Verified Google Maps share link for "Get Directions". */
  directionsUrl: string | null;
  /** Query for the Google Maps embed, used when there is no official embed link. */
  mapQuery: string | null;
  /** Official Google Maps embed URL (Share → Embed a map), pinned to the clinic's place. */
  mapEmbedUrl?: string;
}

export const clinics: Clinic[] = [
  {
    id: "alabang",
    brand: "geneva",
    name: "Geneva Wellness Institute — Alabang",
    shortName: "Geneva Wellness Institute, Alabang",
    primary: true,
    addressLines: [
      "Ground Floor, Entrata Urban Complex, Civic Dr.",
      "Filinvest City, Alabang, Muntinlupa 1781",
      "Metro Manila, Philippines",
    ],
    addressNote: "Located in Vivere Hotel, near the entrance of Quest Plus (formerly Crimson Hotel).",
    phones: [
      { label: "Clinic", display: "+63 967 118 1938", tel: "+639671181938" },
      { label: "Anne", display: "+63 915 396 0593", tel: "+639153960593" },
      { label: "Claire", display: "+63 966 764 2452", tel: "+639667642452" },
      { label: "Geraldine", display: "+63 954 159 5764", tel: "+639541595764" },
    ],
    email: "geneva.institute23@gmail.com",
    hours: [
      { days: "Monday – Friday", time: "9:00 AM – 6:00 PM" },
      { days: "Saturday", time: "10:00 AM – 4:00 PM" },
      { days: "Sunday", time: "Closed" },
    ],
    directionsUrl: "https://maps.app.goo.gl/neNdyjEWcqyL7R2aA",
    mapQuery: "Geneva Wellness Institute, Entrata Urban Complex, Civic Dr, Filinvest City, Alabang, Muntinlupa",
    // The embed used on the original contact-us.php, pinned to the "Geneva Wellness Institute" place.
    mapEmbedUrl:
      "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d30912.77981367029!2d121.03887000000002!3d14.421544!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397d1375df3e83f%3A0x787de966c90cfaae!2sGeneva%20Wellness%20Institute!5e0!3m2!1sen!2sph",
  },
  {
    id: "makati",
    brand: "geneva",
    name: "Geneva Wellness Institute — Makati",
    shortName: "Geneva Wellness Institute, Makati",
    // Located at A.I Skin Revolution (Google Maps place, Plus Code H23C+HXM).
    addressLines: ["A.I Skin Revolution, Legazpi St., Legazpi Village", "Makati City, Metro Manila"],
    phones: [{ display: "0967 118 1938", tel: "+639671181938" }],
    email: "genevaWellnessInstitute@gmail.com",
    hours: null,
    directionsUrl: "https://share.google/CFSk5RNlBJ1cjz3Rb",
    mapQuery: "A.I Skin Revolution, Legazpi St, Legazpi Village, Makati City, Metro Manila",
  },
  {
    id: "lavee",
    brand: "lavee",
    name: "Lavee by Geneva Wellness",
    shortName: "Lavee by Geneva Wellness",
    addressLines: ["2L-05 Estancia East Wing, Capitol Commons", "Meralco Ave., Oranbo, Pasig City 1600"],
    phones: [{ display: "0967 118 1938", tel: "+639671181938" }],
    email: "genevaWellnessInstitute@gmail.com",
    hours: null,
    directionsUrl:
      "https://www.google.com/maps/search/?api=1&query=Estancia+East+Wing%2C+Capitol+Commons%2C+Meralco+Ave%2C+Pasig+City",
    mapQuery: "Estancia East Wing, Capitol Commons, Meralco Ave, Oranbo, Pasig City",
  },
];

export const getClinic = (id: string) => clinics.find((c) => c.id === id);
export const primaryClinic = clinics.find((c) => c.primary)!;
