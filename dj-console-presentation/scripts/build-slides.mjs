#!/usr/bin/env node
// build-slides.mjs
// Aggregates slide markdown into reveal/slides.md
// Structure: acts separated by --- (horizontal), slides within an act by -- (vertical)

import fs from 'fs';
import path from 'path';

const SLIDES_DIR  = 'slides';
const OUTLINE     = path.join(SLIDES_DIR, '00-outline.md');
const OUTPUT_FILE = path.join('reveal', 'slides.md');
const ACT_SEP     = '\n\n---\n\n';   // between acts       → columns (left/right = prev/next act)
const SLIDE_SEP   = '\n\n--\n\n';    // between slides in act → rows   (up/down = prev/next slide)

// act-02-first-demo  →  "Act 2 — First Demo"
// Words in this set are always rendered in their canonical form (e.g. BFF, not Bff)
const WORD_OVERRIDES = { 'bff': 'BFF', 'graphql': 'GraphQL', 'rest': 'REST', 'question': '?' };

// Explicit title overrides for act directories whose name alone doesn't produce the right title.
// Key = directory name (without trailing slash), value = title string after "Act N — ".
const ACT_TITLE_OVERRIDES = {
  'act-01-why-graphql': 'Why GraphQL?',
};

function actTitle(dirName) {
  const m = dirName.match(/^act-(\d+)-(.+)$/);
  if (!m) return dirName;
  const num = parseInt(m[1], 10);
  if (ACT_TITLE_OVERRIDES[dirName]) return `Act ${num} — ${ACT_TITLE_OVERRIDES[dirName]}`;
  const words = m[2].split('-').map(w => WORD_OVERRIDES[w.toLowerCase()] || (w.charAt(0).toUpperCase() + w.slice(1))).join(' ')
    .replace(/ \?/g, '?');   // "Why GraphQL ?" → "Why GraphQL?"
  return `Act ${num} — ${words}`;
}

// Parse 00-outline.md to build a map of  slideFile → presenterAcronym
// Line format:  act-NN-foo/NN-name.md | Title | template | ACRONYM
function loadPresenterMap(outlinePath) {
  const map = {};
  if (!fs.existsSync(outlinePath)) return map;
  for (const line of fs.readFileSync(outlinePath, 'utf8').split('\n')) {
    const m = line.match(/^\s*(act-\d{2}-[^/]+\/[^\s|]+)\s*\|[^|]+\|[^|]+\|\s*(\S+)/);
    if (m) map[m[1].trim()] = m[2].trim();
  }
  return map;
}

const PRESENTER_MAP = loadPresenterMap(OUTLINE);

// Inject presenter tag into slide content after the opening <!-- .slide: --> directive if present.
function injectPresenterTag(slideText, presenter) {
  if (!presenter) return slideText;
  const tag = `<div class="presenter-tag">${presenter}</div>\n\n`;
  // Insert after the opening <!-- .slide: ... --> directive if present, otherwise prepend
  if (/^<!-- \.slide:/.test(slideText)) {
    return slideText.replace(/^(<!-- \.slide:[\s\S]*?-->\n?)/, `$1${tag}`);
  }
  return tag + slideText;
}

// Slides that must never receive a presenter tag — title/opening cards, thank-you slides.
const NO_PRESENTER_TAG = new Set([
  'act-00-opening/01-title.md',
  'act-00-opening/02-about-us.md',
  'act-07-thank-you/01-questions.md',
  'act-07-thank-you/02-thank-you-word-cloud.md',
  'act-07-thank-you/03-thank-you.md',
]);

function transformSlide(text, presenterKey) {
  const presenter = (presenterKey && !NO_PRESENTER_TAG.has(presenterKey))
      ? PRESENTER_MAP[presenterKey]
      : undefined;

  let result = text
      .replace(/\[IMAGE:\s*(diagram-assets\/[^\]]+\.svg)\]/g, (_, p) => `![](${p})`)
      .replace(/\[DIAGRAM:[^\]]+\]\n?/g, '')
      .replace(
          /## Speaker notes\s*<!--([\s\S]*?)-->/g,
          (_, body) => `Note:\n${presenter ? `🎤 ${presenter}\n\n` : ''}${body.trim()}`
      );

  if (presenter) result = injectPresenterTag(result, presenter);
  return result;
}

function collectActs(slidesDir) {
  const entries = fs.readdirSync(slidesDir, { withFileTypes: true });

  const actDirs = entries
      .filter(e => e.isDirectory() && /^act-\d{2}-/.test(e.name))
      .sort((a, b) => a.name.localeCompare(b.name));

  return actDirs.map(actDir => {
    const actPath  = path.join(slidesDir, actDir.name);
    const title    = actTitle(actDir.name);
    const actNum   = parseInt(actDir.name.match(/^act-(\d+)/)[1], 10);

    const slideFiles = fs.readdirSync(actPath)
        .filter(f => f.endsWith('.md'))
        .sort();

    const slides = slideFiles
        .map(f => {
          const presenterKey = `${actDir.name}/${f}`;
          return transformSlide(fs.readFileSync(path.join(actPath, f), 'utf8').trim(), presenterKey);
        })
        .filter(t => t.length > 0);

    return { title, actNum, dirName: actDir.name, slides };
  }).filter(act => act.slides.length > 0);
}

// Presenter tag per act interstitial — shown in the top-right corner of the interstitial slide.
// Derived from the dominant presenter of the act (matches 00-outline.md).
const ACT_PRESENTERS = {
  1: 'PE',
  2: 'FS',
  3: 'FS',
  4: 'PE',
  5: 'PE',
  6: 'FS',
};

// Optional background images for act interstitial slides.
// Key = act number (integer), value = path relative to the reveal/ folder.
// Leave an act out to get no background on its interstitial.
// act-00-opening has no interstitial — its slides carry their own backgrounds.
const ACT_BACKGROUNDS = {
  1: { image: 'theme/background-images/01-title-background.jpg', opacity: 0.35 },
  2: { image: 'theme/background-images/01-title-background.jpg', opacity: 0.35 },
  3: { image: 'theme/background-images/01-title-background.jpg', opacity: 0.35 },
  4: { image: 'theme/background-images/01-title-background.jpg', opacity: 0.35 },
  5: { image: 'theme/background-images/01-title-background.jpg', opacity: 0.35 },
  6: { image: 'theme/background-images/01-title-background.jpg', opacity: 0.35 },
  // act-07-thank-you has no interstitial — no entry needed
};

// Optional mini context diagram per act interstitial (acts 1..6).
// Paths are relative to reveal/.
const ACT_CONTEXT_MINI = {
  3: 'diagram-assets/spring-graphql/context-mini-act3.svg',
  4: 'diagram-assets/spring-graphql/context-mini-act4.svg',
  5: 'diagram-assets/spring-graphql/context-mini-act5.svg',
  6: 'diagram-assets/spring-graphql/context-mini-act5.svg',
};

// Build the markdown output.
// Each act opens with a special interstitial slide carrying act metadata.
// Reveal.js data-* attributes are injected via <!-- reveal-section ... -->
// comments that the markdown plugin passes through as HTML.
function buildOutput(acts) {
  const actBlocks = acts.map(({ title, actNum, slides }) => {
    // Act 0 is the pre-show opening (title + about-us) — no interstitial.
    // Act 7 is the thank-you placeholder — no interstitial either.
    if (actNum === 0 || actNum === 7) {
      return slides.join(SLIDE_SEP);
    }

    const totalSlides = slides.length;
    const bg = ACT_BACKGROUNDS[actNum];

    // Interstitial: act title card — no slide number shown, just the act name
    // The <!-- .slide: --> comment is the Reveal.js markdown plugin convention
    // for hoisting data-* attributes onto the <section> element.
    const slideDirective = bg
        ? `<!-- .slide: data-background-image="${bg.image}" data-background-size="cover" data-background-opacity="${bg.opacity}" -->\n`
        : '';
    const mini = ACT_CONTEXT_MINI[actNum]
        ? `\n\n<div style="width:78%; max-width:680px; margin:0.7em auto 0; opacity:0.92;">` +
          `\n<img src="${ACT_CONTEXT_MINI[actNum]}" alt="Act ${actNum} context map" style="width:100%; height:auto;" />\n</div>`
        : '';
    const presenterTag = ACT_PRESENTERS[actNum]
        ? `<div class="presenter-tag">${ACT_PRESENTERS[actNum]}</div>\n\n`
        : '';
    const interstitial =
        `<!-- data-act="${actNum}" data-act-title="${title}" data-interstitial="true" -->\n` +
        slideDirective +
        `# ${title}\n\n${presenterTag}${mini}`.replace(/\n\n\n+/g, '\n\n').trimEnd();

    // Content slides: each carries act metadata + 1-based position within act
    const contentSlides = slides.map((slide, i) =>
        `<!-- data-act="${actNum}" data-act-title="${title}" ` +
        `data-act-slide="${i + 1}" data-act-total="${totalSlides}" -->\n` +
        slide
    );

    return [interstitial, ...contentSlides].join(SLIDE_SEP);
  });

  return actBlocks.join(ACT_SEP) + '\n';
}

const acts   = collectActs(SLIDES_DIR);
const output = buildOutput(acts);
const total  = acts.reduce((s, a) => s + a.slides.length, 0);

fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
fs.writeFileSync(OUTPUT_FILE, output, 'utf8');

console.log(`✅ Generated ${OUTPUT_FILE} (${acts.length} acts, ${total} slides)`);
