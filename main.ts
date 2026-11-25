// Fridge Roast: One Line, Biggest Laugh — entry program.
// Writes one line roasting a smart fridge to /output/entry.txt.
// Sealed gate: UTF-8 text of 1 to 200 characters, one line, not only whitespace.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const LINE =
  'My smart fridge just pushed a firmware update to "optimize snack access," which is a corporate way of saying it locked the cheese drawer until I log a 5-star review.';

const MAX_CHARS = 200;

function fail(message: string): never {
  console.error(`error: ${message}`);
  process.exit(1);
}

// Guard: one line, 1-200 characters, not only whitespace.
const chars = [...LINE].length;
if (chars < 1 || chars > MAX_CHARS) {
  fail(`entry is ${chars} chars, outside the 1-${MAX_CHARS} limit`);
}
if (LINE.trim().length === 0) {
  fail("entry is only whitespace");
}
if (LINE.includes("\n") || LINE.includes("\r")) {
  fail("entry must be a single line");
}
// Reject control characters (a stray control byte would corrupt the entry
// text the judge sees) and leading/trailing whitespace on the line itself.
if (/[\u0000-\u001f\u007f]/.test(LINE)) {
  fail("entry contains a control character");
}
if (LINE !== LINE.trim()) {
  fail("entry has leading or trailing whitespace");
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, LINE + "\n", "utf8");

// Read-back check: what landed on disk must be exactly the line.
const written = readFileSync(outPath, "utf8");
if (written !== LINE + "\n") {
  fail("read-back mismatch: file on disk differs from the entry line");
}
console.log(`wrote ${chars} chars to ${outPath}`);
