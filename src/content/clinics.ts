/**
 * Clinic locations: the single place to edit names, addresses, contacts, hours and maps.
 *
 * Only Alabang has details on the current website. Locations 2 and 3 are placeholders
 * until the clinic supplies their details. A field left `null` renders as
 * "to be confirmed" and never as an invented value.
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
  /** Query used for the click-to-load Google Maps embed. */
  mapQuery: string | null;
}

export const clinics: Clinic[] = [
  {
    id: "alabang",
    brand: "geneva",
    name: "Geneva Wellness Institute — Alabang",
    shortName: "Geneva Wellness Institute, Alabang",
    primary: true,
    addressLines: ["5102 Bridgeway Ave., Filinvest Corporate City", "Alabang, Muntinlupa City 1780"],
    addressNote:
      "The current website also lists 5012 Bridgeway Avenue (1781). The clinic is confirming the correct street number.",
    phones: [
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
    mapQuery: "Geneva Wellness Institute, Bridgeway Ave, Filinvest Corporate City, Alabang, Muntinlupa",
  },
  {
    id: "geneva-second",
    brand: "geneva",
    name: "Geneva Wellness Institute — Second Location",
    shortName: "Geneva Wellness Institute, second location",
    placeholder: true,
    addressLines: null,
    phones: [],
    email: null,
    hours: null,
    directionsUrl: null,
    mapQuery: null,
  },
  {
    id: "lavee",
    brand: "lavee",
    name: "Lavee by Geneva Wellness",
    shortName: "Lavee by Geneva Wellness",
    placeholder: true,
    addressLines: null,
    phones: [],
    email: null,
    hours: null,
    directionsUrl: null,
    mapQuery: null,
  },
];

export const getClinic = (id: string) => clinics.find((c) => c.id === id);
export const primaryClinic = clinics.find((c) => c.primary)!;
