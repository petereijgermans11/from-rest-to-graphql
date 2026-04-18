import fs from "fs";
import path from "path";

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(e => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? walk(p) : [p];
  });
}

const slideFiles = walk("slides").filter(f => f.endsWith(".md"));
const missing = [];

for (const f of slideFiles) {
  const text = fs.readFileSync(f, "utf8");
  const diag = text.match(/\[DIAGRAM:\s*(diagrams\/[^\]]+)\]/);
  const img  = text.match(/\[IMAGE:\s*(diagram-assets\/[^\]]+)\]/);
  if (diag && img) {
    const imgPath = img[1];
    if (!fs.existsSync(imgPath)) {
      missing.push({ slide: f, diagram: diag[1], expected: imgPath });
    }
  }
}

if (missing.length) {
  console.error("❌ Missing rendered diagram assets:");
  for (const m of missing) {
    console.error(`- ${m.slide}\n  ${m.diagram}\n  -> ${m.expected}`);
  }
  process.exit(1);
} else {
  console.log("✅ All diagram assets present.");
}
