// Builds responsive variants for every photo in public/images and a size manifest.
//   npm run images
// For each photo it writes <name>-160.webp (thumbnails) and <name>-800.webp (cards, phones)
// beside the original, and records { width, height, variants } in src/content/imageSizes.json
// so components can set width/height (no layout shift) and a srcset (right-sized downloads).
import { readdirSync, statSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";
import sharp from "sharp";

const ROOT = "public/images";
const WIDTHS = [160, 800];
const isVariant = (f) => /-(\d+)\.webp$/.test(f) && WIDTHS.includes(Number(f.match(/-(\d+)\.webp$/)[1]));

const files = [];
const walk = (dir) => {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) walk(p);
    else if (f.endsWith(".webp") && !isVariant(f)) files.push(p);
  }
};
walk(ROOT);

const manifest = {};
for (const file of files.sort()) {
  const { width, height } = await sharp(file).metadata();
  const url = "/" + relative("public", file).replace(/\\/g, "/");
  const variants = [];
  for (const w of WIDTHS) {
    if (w >= width) continue;
    const out = file.replace(/\.webp$/, `-${w}.webp`);
    await sharp(file).resize({ width: w }).webp({ quality: w <= 160 ? 70 : 78 }).toFile(out);
    variants.push(w);
  }
  manifest[url] = { width, height, variants };
}
writeFileSync("src/content/imageSizes.json", JSON.stringify(manifest, null, 2) + "\n");
console.log(`Processed ${files.length} images.`);
