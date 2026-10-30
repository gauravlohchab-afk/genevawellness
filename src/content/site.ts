/**
 * Geneva Wellness Institute site content.
 *
 * Copy is taken from https://www.genevawellness.ph/ (home, about-us, testimonials,
 * gallery and contact pages, audited 29 Oct 2026). See AUDIT.md for the inventory and
 * for claims that were deliberately left out pending verification.
 */
import { legacyAsset, photo } from "@/lib/assets";

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.genevawellness.ph").replace(/\/$/, "");

export const brand = {
  name: "Geneva Wellness Institute",
  shortName: "Geneva Wellness",
  logo: { src: legacyAsset("/img/geneva-logo.svg"), alt: "Geneva Wellness Institute Logo" },
  tagline: "Transformative aesthetic and wellness treatments designed for your unique beauty and confidence.",
  taglineSecond: "We combine science, technology, and artistry to help you look and feel your very best.",
  trustBadges: ["Certified Practitioners", "Medical Grade Treatments"],
};

export const seo = {
  defaultTitle: "Aesthetic Clinic Alabang | Laser & Anti-Aging",
  titleTemplate: "%s | Geneva Wellness Institute",
  description:
    "Advanced aesthetic clinic in Alabang offering laser treatments, HIFU, anti-aging & body contouring. Book a consultation with Geneva Wellness Institute.",
};

export const contact = {
  whatsapp: {
    display: "+63 915 396 0593",
    href: "https://wa.me/639153960593?text=Hello%2C%20I%20came%20from%20the%20website",
  },
  messenger: { href: "https://m.me/genevawellnessinstitute?ref=website" },
  phone: { display: "0967 118 1938", tel: "+639671181938" },
  email: "genevaWellnessInstitute@gmail.com",
};

export const socials = [
  { name: "Facebook", href: "https://www.facebook.com/genevawellnessinstitute" },
  { name: "Instagram", href: "https://www.instagram.com/genevawellnessinstitute/" },
  { name: "YouTube", href: "https://www.youtube.com/@GenevaWellnessInstitute" },
  { name: "TikTok", href: "https://www.tiktok.com/@genevawellnessinstitute" },
];

/**
 * The legal pages have not been ported yet (their text must be copied word for word,
 * which the audit could not do). Until then the links point at the existing pages.
 */
export const legalLinks = [
  { label: "Privacy Policy", href: "https://www.genevawellness.ph/privacy-policy.php" },
  { label: "Terms of Service", href: "https://www.genevawellness.ph/terms.php" },
  { label: "Cookie Policy", href: "https://www.genevawellness.ph/cookie-policy.php" },
];
export const privacyPolicyHref = legalLinks[0].href;

export const hero = {
  eyebrow: "Alabang, Philippines",
  heading: "Transformative Wellness & Aesthetic Treatments",
  body: "Premium non-invasive treatments crafted for your unique skin and hair goals. Backed by 15+ years of expertise and cutting-edge technology.",
  primaryCta: "Book Free Consultation",
  secondaryCta: "Explore Treatments",
  image: { src: legacyAsset("/img/home-hero-updated-new.webp"), alt: "Relaxing scalp treatment at Geneva Wellness Institute" },
};

/** The three feature slides from the original homepage, shown as editorial panels. */
export const featureStories = [
  {
    eyebrow: "Laser Treatments",
    heading: "Reveal Radiant Skin with Advanced Laser Treatments",
    body: "State-of-the-art CO2, Carbon & Pico laser therapies designed to restore clarity, reduce pigmentation, and rejuvenate your skin from within.",
    cta: { label: "View Laser Treatments", href: "/treatments#face-skin" },
    image: { src: legacyAsset("/img/advanced-treatement-2.webp"), alt: "CO2 Laser treatment" },
  },
  {
    eyebrow: "Non-Surgical Solutions",
    heading: "Turn Back Time with Anti-Aging Solutions",
    body: "Experience the power of HIFU, bio-stimulation & regenerative therapies that lift, firm, and restore your youthful glow — naturally and safely.",
    cta: { label: "View Before & After", href: "/before-after" },
    image: photo.hifuDevice,
  },
  {
    eyebrow: "Body Transformation · Expert Care",
    heading: "Transform Body & Elevate Your Confidence",
    body: "Targeted body contouring & slimming treatments using Exilis and RF technology to sculpt the figure you've always desired — no surgery required.",
    cta: { label: "Body Treatments", href: "/treatments#body-contouring" },
    image: photo.rfBody,
  },
];

export const about = {
  eyebrow: "About Geneva Wellness Institute",
  heading: "Your journey to becoming the best version of yourself",
  paragraphs: [
    "At Geneva Wellness Institute, we provide exceptional beauty and wellness treatments in a serene and luxurious environment. Our highly skilled team of expert estheticians and certified therapists is dedicated to helping you achieve your beauty and wellness goals.",
    "Every treatment is personalized to your unique skin type and concerns, ensuring optimal results that look natural and feel transformative.",
  ],
  pillars: [
    { title: "Advanced Facial Therapies", body: "State-of-the-art facials tailored to every skin concern." },
    { title: "Body Contouring Treatments", body: "Non-invasive sculpting and rejuvenation for your body." },
    { title: "Certified Expert Team", body: "Licensed professionals with years of specialized training." },
  ],
  images: [
    { src: legacyAsset("/img/facial-treatment-clinic.webp"), alt: "Geneva Wellness Institute" },
    { src: legacyAsset("/img/wellness-treatment-new.webp"), alt: "Advanced skin care treatment" },
  ],
};

/** about-us.php */
export const aboutPage = {
  heading: "Welcome to Geneva Wellness Institute",
  intro: "Expert aesthetic doctors and specialists dedicated to advanced treatments and personalized care in Alabang.",
  paragraphs: [
    "At Geneva Wellness Institute, our mission is to empower you to achieve your beauty and wellness goals through personalized care and advanced treatments.",
    "We pride ourselves on offering a luxurious and supportive environment where cutting-edge technology meets expert knowledge. Our dedicated team is here to guide you through your journey, ensuring that each treatment is tailored to your unique needs for optimal results.",
    "Whether you're seeking to rejuvenate your skin, enhance your body contours, or restore your hair's vitality, Geneva Wellness Institute is committed to helping you look and feel your best.",
  ],
  values: [
    { title: "Personalized Care", body: "Tailored treatments designed to meet your unique beauty and wellness goals." },
    { title: "Advanced Technology", body: "State-of-the-art equipment and the latest innovations in aesthetic medicine." },
    { title: "Expert Team", body: "Highly skilled professionals dedicated to your safety and satisfaction." },
    { title: "Luxurious Environment", body: "Relax in a soothing, elegant space designed to enhance your experience." },
  ],
  image: { src: legacyAsset("/img/about-video.webp"), alt: "Inside Geneva Wellness Institute" },
  cta: {
    heading: "Ready to Transform Your Wellness Journey?",
    body: "Schedule a free consultation with our experts today. Let's discuss your goals and create a personalized treatment plan.",
  },
};

/**
 * Homepage stats. The about page publishes a different set (5000+, 10+, 25+, 98%);
 * the homepage figures are used because the homepage repeats them in its copy.
 * Flagged in AUDIT.md for confirmation.
 */
export const stats = [
  { value: 10000, suffix: "+", label: "Happy Clients" },
  { value: 15, suffix: "+", label: "Years Experience" },
  { value: 20, suffix: "+", label: "Treatments" },
  { value: 5, suffix: ".0", label: "Google Rating", note: "500+ Google Reviews" },
];

export const testimonials = [
  {
    name: "Gerryl Peñaflor",
    role: "Advanced Facial Client",
    quote:
      "Geneva Wellness Institute is my go-to place for all my skincare needs. Their advanced facial therapies have transformed my skin, making it smoother and more radiant. The team is knowledgeable and always makes me feel comfortable. I can't imagine going anywhere else!",
  },
  {
    name: "Madelle Ocenar",
    role: "Body Contouring Client",
    quote:
      "The body contouring treatments at Geneva Wellness Institute are amazing. I saw noticeable results after just a few sessions. The staff is incredibly supportive and guided me through the entire process. I feel more confident and happy with my body now.",
  },
  {
    name: "Benedict Aydalla",
    role: "Hair Restoration Client",
    quote:
      "I had been struggling with hair loss for years until I discovered Geneva Wellness Institute. Their hair and scalp treatments have made a huge difference. My hair feels thicker and healthier, and I couldn't be happier with the results.",
  },
];

/** testimonials.php: nine YouTube video testimonials. */
export const videoTestimonials = [
  { id: "ww-OefRLgiQ", title: "Client Testimonial - Facial Treatment Results" },
  { id: "xMq9w8a81bo", title: "Client Testimonial - Skin Rejuvenation" },
  { id: "8ER__ofvhEQ", title: "Client Testimonial - Anti-Aging Treatment" },
  { id: "PYHIzG4w2HY", title: "Client Testimonial - Body Contouring" },
  { id: "sUaxQuCmmXg", title: "Client Testimonial - Laser Treatment" },
  { id: "BN-SkkUI7jE", title: "Client Testimonial - Hair Restoration" },
  { id: "A-0R_S9fliw", title: "Client Testimonial - Beauty Transformation" },
  { id: "w-dkEQi-LTE", title: "Client Testimonial - Wellness Results" },
  { id: "PXNpnWjP3DM", title: "Client Testimonial - Aesthetic Results" },
];

export const storyVideo = {
  id: "bD7H1rx4nOw",
  title: "Geneva Wellness Institute — Our Story Full Tour",
  heading: "Experience Geneva Wellness in action",
  body: "See how we transform lives through science-backed beauty and wellness treatments.",
};

/** about-us.php: the clinic video that plays from the storefront photo. */
export const aboutVideo = {
  id: "GpgTzxevaNQ",
  title: "Inside Geneva Wellness Institute",
};

export const bookingSteps = [
  {
    title: "Get in Touch",
    subtitle: "Reach out to us",
    body: "Send us a message through our contact number, email, or social media channels. Let us know the treatment you're interested in and any preferred dates and times.",
  },
  {
    title: "Choose Your Treatment",
    subtitle: "Select the service that suits your needs",
    body: "Browse our range of treatments and let our experts guide you toward the best option for your skin type, concerns, and goals.",
  },
  {
    title: "Confirm Your Appointment",
    subtitle: "Settle on a date and time",
    body: "Our team will help you find a convenient slot for your appointment. Confirm the date and time that works best for you, and we will reserve your spot.",
  },
  {
    title: "Visit Us",
    subtitle: "Enjoy your treatment at Geneva Wellness",
    body: "Arrive at our state-of-the-art facility at the scheduled time. Our team will be ready to provide you with an exceptional beauty and wellness experience.",
  },
];

/** gallery.php: 17 images with no captions or pairing on the original site. */
const galleryAlts: Record<number, string> = {
  1: "Client before and after: clearer skin after three sessions",
  2: "Client before and after: underarm skin brightening",
  3: "Client before and after: acne marks fading over treatment",
  4: "Client before and after: calmer, clearer skin",
};

export const clinicGallery = Array.from({ length: 17 }, (_, i) => ({
  src: legacyAsset(`/img/gallery-img-${i + 1}.webp`),
  alt: galleryAlts[i + 1] ?? `Geneva Wellness Institute gallery image ${i + 1}`,
}));

/** The before/after result photos from the gallery (gallery images 1–4). */
export const clientResults = clinicGallery.slice(0, 4);

export const mainNav = [
  { label: "Treatments", href: "/treatments", hasMenu: true },
  { label: "About", href: "/about" },
  { label: "Amenities", href: "/amenities" },
  { label: "Gallery", href: "/gallery" },
  { label: "Blog", href: "/blog" },
  { label: "Testimonials", href: "/testimonials", mobileOnly: true },
  { label: "Clinic Locator", href: "/clinic-locator" },
];
