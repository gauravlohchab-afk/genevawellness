import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import sharp from "sharp";

/**
 * Branded 1200×630 share image used by every route's opengraph-image file: a deep panel
 * with the page's eyebrow, title and line on the left, and the page's photo in the
 * homepage's arch on the right. Lavee pages use the Lavee palette and wordmark, never
 * Geneva red.
 */
export const OG_SIZE = { width: 1200, height: 630 };

interface OgInput {
  eyebrow: string;
  title: string;
  subtitle?: string;
  /** Photo URL for the arch. Skipped quietly if it can't be fetched or decoded. */
  photo?: string;
  brand?: "geneva" | "lavee";
}

const palettes = {
  geneva: { deep: "#560216", glow: "#800000", accent: "#f3d7cd", panel: "#f0e5d9", ring: "#c21807", name: "Geneva Wellness Institute" },
  lavee: { deep: "#3b2147", glow: "#5e3a6e", accent: "#e4d6ec", panel: "#f1eaf3", ring: "#9874a5", name: "Lavee by Geneva Wellness" },
};

const font = (pkg: string, file: string) => readFile(join(process.cwd(), "node_modules/@fontsource", pkg, "files", file));

/**
 * Loads a photo (a local /public path or a URL) and returns it as a JPEG data URI, since
 * the renderer can't decode WebP. Returns undefined if it can't be read.
 */
async function photoData(url: string) {
  try {
    let input: Buffer;
    if (url.startsWith("/")) {
      input = await readFile(join(process.cwd(), "public", url));
    } else {
      const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
      if (!res.ok) return undefined;
      input = Buffer.from(await res.arrayBuffer());
    }
    const jpeg = await sharp(input).resize(784, 1080, { fit: "cover" }).jpeg({ quality: 80 }).toBuffer();
    return `data:image/jpeg;base64,${jpeg.toString("base64")}`;
  } catch {
    return undefined;
  }
}

async function laveeLogo() {
  const png = await readFile(join(process.cwd(), "public/brand/lavee-aubergine.png"));
  return `data:image/png;base64,${png.toString("base64")}`;
}

export async function renderOg({ eyebrow, title, subtitle, photo, brand = "geneva" }: OgInput) {
  const c = palettes[brand];
  const [cinzel, arimo, arimoBold, img, logo] = await Promise.all([
    font("cinzel", "cinzel-latin-600-normal.woff"),
    font("arimo", "arimo-latin-400-normal.woff"),
    font("arimo", "arimo-latin-700-normal.woff"),
    photo ? photoData(photo) : Promise.resolve(undefined),
    brand === "lavee" ? laveeLogo() : Promise.resolve(undefined),
  ]);
  const titleSize = title.length <= 24 ? 68 : title.length <= 44 ? 56 : 46;

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#fefaed", fontFamily: "Arimo" }}>
        {/* Copy panel */}
        <div
          style={{
            width: 720,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "56px 64px",
            color: "#fefaed",
            backgroundColor: c.deep,
            backgroundImage: `radial-gradient(circle at 0% 0%, ${c.glow} 0%, ${c.deep} 70%)`,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ width: 40, height: 1, background: c.accent }} />
            <div style={{ fontFamily: "Cinzel", fontSize: 22, letterSpacing: 4, textTransform: "uppercase" }}>{c.name}</div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ fontWeight: 700, fontSize: 18, letterSpacing: 5, textTransform: "uppercase", color: c.accent }}>{eyebrow}</div>
            <div style={{ fontFamily: "Cinzel", fontSize: titleSize, lineHeight: 1.08, display: "flex" }}>{title}</div>
            {subtitle && <div style={{ fontSize: 24, lineHeight: 1.45, color: "rgba(254,250,237,0.82)", display: "flex" }}>{subtitle}</div>}
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 18, color: "rgba(254,250,237,0.75)" }}>
            <div style={{ display: "flex" }}>genevawellness.ph · Alabang</div>
            <div
              style={{
                display: "flex",
                padding: "10px 20px",
                border: `1px solid ${c.accent}`,
                borderRadius: 999,
                color: c.accent,
                fontWeight: 700,
                fontSize: 15,
                letterSpacing: 2,
                textTransform: "uppercase",
              }}
            >
              Book a consultation
            </div>
          </div>
        </div>

        {/* Visual panel */}
        <div style={{ flex: 1, display: "flex", alignItems: "flex-end", justifyContent: "center", background: c.panel, padding: "48px 44px 0" }}>
          <div
            style={{
              position: "relative",
              width: 392,
              height: 540,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "196px 196px 0 0",
              overflow: "hidden",
              background: brand === "lavee" ? "#fefaed" : c.accent,
              border: `1px solid ${c.ring}`,
            }}
          >
            {img ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={img} width={392} height={540} style={{ width: 392, height: 540, objectFit: "cover" }} alt="" />
            ) : logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logo} width={300} height={178} style={{ width: 300, height: 178 }} alt="" />
            ) : (
              <div style={{ fontFamily: "Cinzel", fontSize: 120, color: c.deep, opacity: 0.25, display: "flex" }}>G</div>
            )}
          </div>
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        { name: "Cinzel", data: cinzel, weight: 600, style: "normal" },
        { name: "Arimo", data: arimo, weight: 400, style: "normal" },
        { name: "Arimo", data: arimoBold, weight: 700, style: "normal" },
      ],
    }
  );
}
