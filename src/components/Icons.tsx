import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement> & { size?: number };
const base = (size = 18): SVGProps<SVGSVGElement> => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
  focusable: false,
});

export const ArrowRight = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M4 12h15M13 6l6 6-6 6" />
  </svg>
);
export const ChevronDown = ({ size = 14, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M6 9l6 6 6-6" />
  </svg>
);
export const ChevronLeft = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M15 6l-6 6 6 6" />
  </svg>
);
export const ChevronRight = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M9 6l6 6-6 6" />
  </svg>
);
export const Close = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);
export const Menu = ({ size = 22, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M4 7h16M4 12h16M4 17h10" />
  </svg>
);
export const Check = ({ size = 14, ...p }: P) => (
  <svg {...base(size)} strokeWidth={2} {...p}>
    <path d="M5 12.5l4.5 4.5L19 7" />
  </svg>
);
export const Pin = ({ size = 28, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M12 21s7-6.1 7-11.5A7 7 0 0 0 5 9.5C5 14.9 12 21 12 21z" />
    <circle cx="12" cy="9.5" r="2.5" />
  </svg>
);
export const Play = ({ size = 22, ...p }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden focusable={false} {...p}>
    <path d="M8 5.5v13l11-6.5z" fill="currentColor" />
  </svg>
);
export const Alert = ({ size = 14, ...p }: P) => (
  <svg {...base(size)} strokeWidth={2} {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7.5v5.5M12 16.5v.01" />
  </svg>
);
export const Drag = ({ size = 22, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M9 7l-5 5 5 5M15 7l5 5-5 5" />
  </svg>
);

/* Social glyphs (simple monochrome marks) */
export const SocialIcon = ({ name, size = 18 }: { name: string; size?: number }) => {
  const p = { width: size, height: size, viewBox: "0 0 24 24", "aria-hidden": true, focusable: false, fill: "currentColor" } as const;
  switch (name) {
    case "Facebook":
      return (
        <svg {...p}>
          <path d="M13.5 21v-7.5H16l.4-3H13.5V8.6c0-.9.3-1.5 1.5-1.5h1.6V4.4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.8 1.4-3.8 3.9v2.3H8v3h2.5V21h3z" />
        </svg>
      );
    case "Instagram":
      return (
        <svg {...p} fill="none" stroke="currentColor" strokeWidth={1.6}>
          <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.3" cy="6.7" r="0.6" fill="currentColor" />
        </svg>
      );
    case "YouTube":
      return (
        <svg {...p}>
          <path d="M21.6 7.2a2.6 2.6 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.6 2.6 0 0 0 2.4 7.2 27 27 0 0 0 2 12a27 27 0 0 0 .4 4.8 2.6 2.6 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.6 2.6 0 0 0 1.8-1.8A27 27 0 0 0 22 12a27 27 0 0 0-.4-4.8zM10 15V9l5.2 3L10 15z" />
        </svg>
      );
    case "TikTok":
      return (
        <svg {...p}>
          <path d="M16.6 3h-3v12.2a2.6 2.6 0 1 1-2.6-2.6c.3 0 .5 0 .8.1V9.6a5.7 5.7 0 1 0 4.8 5.6V9.1a7.3 7.3 0 0 0 4.2 1.3V7.4A4.3 4.3 0 0 1 16.6 3z" />
        </svg>
      );
    case "Messenger":
      return (
        <svg {...p}>
          <path d="M12 2.5C6.6 2.5 2.5 6.4 2.5 11.5c0 2.7 1.1 5 3 6.6V21.5l2.9-1.6c1.1.3 2.3.5 3.6.5 5.4 0 9.5-3.9 9.5-9S17.4 2.5 12 2.5zm1 12l-2.4-2.6-4.7 2.6 5.2-5.5 2.5 2.6 4.6-2.6L13 14.5z" />
        </svg>
      );
    case "WhatsApp":
      return (
        <svg {...p}>
          <path d="M12 2.5a9.4 9.4 0 0 0-8.1 14.2L2.5 21.5l4.9-1.3A9.4 9.4 0 1 0 12 2.5zm5.5 13.3c-.2.6-1.3 1.2-1.8 1.3-.5 0-1 .2-3.3-.7-2.8-1.1-4.5-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.9s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .5l-.3.5-.4.4c-.1.1-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.4 2.4 1.5.3.1.5.1.7-.1l.9-1.1c.2-.3.4-.2.7-.1l1.9.9c.3.1.5.2.5.3.1.2.1.7-.1 1.1z" />
        </svg>
      );
    default:
      return null;
  }
};
