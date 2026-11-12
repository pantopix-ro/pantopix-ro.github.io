// Copies the animation sources into /public/anim. Run after editing anything in src/anim-src.
import fs from 'node:fs';
const d = 'src/anim-src/';
fs.writeFileSync('public/anim/metro.js', ['journeys.js', 'iso.js', 'metro.js'].map((f) => fs.readFileSync(d + f, 'utf8')).join('\n'));
fs.copyFileSync(d + 'stream.js', 'public/anim/stream.js');
console.log('bundled public/anim/metro.js and public/anim/stream.js');
