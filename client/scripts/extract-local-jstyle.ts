/**
 * @file extract-local-jstyle.ts
 * @description 사용 class 기반 Jstyle 로컬 CSS 생성
 * @author Jungho
 * @since 2026-07-04
 */

declare interface BunFileRef {
  text: () => Promise<string>;
}

declare interface BunGlobRef {
  scan: (options: { cwd: string; onlyFiles: boolean }) => AsyncIterable<string>;
}

declare const Bun: {
  Glob: new (pattern: string) => BunGlobRef;
  file: (path: string) => BunFileRef;
  write: (path: string, data: string) => Promise<number>;
};

const SRC_DIR: string = `${import.meta.dirname}/../src`;
const STYLE_DIR: string = `${SRC_DIR}/assets/styles`;
const JSTYLE_URL: string = `https://jungho-dev.github.io/dev-cdn/styles/Jstyle.min.css`;
const RESET_URL: string = `https://jungho-dev.github.io/dev-cdn/styles/Reset.min.css`;
const TEXT_EXT: Set<string> = new Set([`.ts`, `.tsx`, `.css`, `.html`]);
const SAFE_CLASSES: string[] = [
  `black`,
  `dark`,
  `light`,
  `white`,
  `primary`,
  `secondary`,
  `danger`,
  `warning`,
  `success`,
  `info`,
  `red`,
  `orange`,
  `yellow`,
  `green`,
  `blue`,
  `navy`,
  `purple`,
  `gray`,
  `burgundy`,
  `pointer-primary`,
  `pointer-secondary`,
  `pointer-danger`,
  `pointer-burgundy`,
  `pointer`,
  `hover`,
  `bg-primary`,
  `bg-secondary`,
  `bg-light`,
  `bg-white`,
  `bg-danger`,
  `bg-dark`,
];

const classTokens: Set<string> = new Set(SAFE_CLASSES);

// 1. class token 수집 -----------------------------------------------------------------------------
const collectClassTokens = async (): Promise<void> => {
  const files: string[] = await Array.fromAsync(
    new Bun.Glob(`**/*`).scan({ cwd: SRC_DIR, onlyFiles: true }),
  );
  for (const file of files) {
    const dotIndex: number = file.lastIndexOf(`.`);
    const ext: string = dotIndex >= 0 ? file.slice(dotIndex) : ``;
    if (!TEXT_EXT.has(ext)) {
      continue;
    }

    const body: string = await Bun.file(`${SRC_DIR}/${file}`).text();
    const matches: IterableIterator<RegExpMatchArray> = body.matchAll(
      /[A-Za-z][A-Za-z0-9_]*(?:-[A-Za-z0-9_]+)+|[A-Za-z]+/g,
    );
    for (const match of matches) {
      const value: string = match[0];
      if (value.length <= 40) {
        classTokens.add(value);
      }
    }
  }
};

// 2. css 다운로드 ----------------------------------------------------------------------------------
const fetchText = async (url: string): Promise<string> => {
  const response: Response = await fetch(url);
  if (!response.ok) {
    throw new Error(`fetch failed: ${response.status} ${url}`);
  }
  return response.text();
};

// 3. keyframes 분리 --------------------------------------------------------------------------------
const stripKeyframes = (css: string): { cssBody: string; keyframes: string[] } => {
  const keyframes: string[] = [];
  let cssBody: string = css;
  let searchStart: number = 0;

  while (true) {
    const atIndex: number = cssBody.indexOf(`@keyframes`, searchStart);
    if (atIndex < 0) {
      break;
    }

    const openIndex: number = cssBody.indexOf(`{`, atIndex);
    if (openIndex < 0) {
      break;
    }

    let depth: number = 0;
    let endIndex: number = -1;
    const chars: string[] = Array.from(cssBody.slice(openIndex));
    let offset: number = 0;
    for (const char of chars) {
      if (char === `{`) {
        depth += 1;
      } else if (char === `}`) {
        depth -= 1;
        if (depth === 0) {
          endIndex = openIndex + offset + 1;
          break;
        }
      }
      offset += 1;
    }

    if (endIndex < 0) {
      break;
    }

    keyframes.push(cssBody.slice(atIndex, endIndex));
    cssBody = `${cssBody.slice(0, atIndex)}${cssBody.slice(endIndex)}`;
    searchStart = atIndex;
  }

  return { cssBody, keyframes };
};

// 4. Jstyle rule 필터 ------------------------------------------------------------------------------
const extractJstyle = (css: string): string => {
  const { cssBody, keyframes } = stripKeyframes(css);
  const blocks: string[] = cssBody.split(`}`).map((block) => block.trim()).filter(Boolean);
  const keptRules: string[] = [];

  for (const block of blocks) {
    const rule: string = `${block}}`;
    const matches: IterableIterator<RegExpMatchArray> = rule.matchAll(/\.(-?[_a-zA-Z]+[_a-zA-Z0-9-]*)/g);
    for (const match of matches) {
      if (classTokens.has(match[1])) {
        keptRules.push(rule);
        break;
      }
    }
  }

  return `${keptRules.join(``)}${keyframes.join(``)}`;
};

// 5. 생성 실행 -------------------------------------------------------------------------------------
await collectClassTokens();

const jstyle: string = await fetchText(JSTYLE_URL);
const reset: string = await fetchText(RESET_URL);
const localJstyle: string = extractJstyle(jstyle);

await Bun.write(`${STYLE_DIR}/Reset.local.css`, reset);
await Bun.write(`${STYLE_DIR}/Jstyle.local.css`, localJstyle);

console.log(JSON.stringify({
  tokens: classTokens.size,
  sourceBytes: jstyle.length,
  keptBytes: localJstyle.length,
  resetBytes: reset.length,
}, null, 2));
