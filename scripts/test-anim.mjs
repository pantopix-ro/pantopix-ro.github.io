// Runs the fake-canvas tests for the hand-written animations. Exits non-zero if any fails.
import { execFileSync } from 'node:child_process';
const dir = 'src/anim-src';
const runs = [['test-metro.js', 'metro.js', 'ok, all eggs reachable'], ['test-iso.js', 'iso.js', 'problems=0'], ['test-scrolltips.js', 'stream.js', 'ok, scroll tour passes']];
let failed = 0;
for (const [test, file, expect] of runs) {
  const out = execFileSync('node', [test, file], { cwd: dir, encoding: 'utf8' });
  const ok = out.includes(expect);
  console.log((ok ? 'pass ' : 'FAIL ') + test);
  if (!ok) { failed++; console.log(out); }
}
process.exit(failed ? 1 : 0);
