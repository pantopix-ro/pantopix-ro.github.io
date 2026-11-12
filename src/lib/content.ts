// Reads the content folder at build time. TinaCMS edits the same files, so marketing and code share one source.
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { marked } from 'marked';

const ROOT = path.join(process.cwd(), 'content');

export function json<T = any>(rel: string): T {
  return JSON.parse(fs.readFileSync(path.join(ROOT, rel), 'utf8'));
}

export type Doc = { slug: string; html: string; body: string; [k: string]: any };

function readDoc(dir: string, file: string): Doc {
  const raw = fs.readFileSync(path.join(ROOT, dir, file), 'utf8');
  const { data, content } = matter(raw);
  return { ...data, slug: file.replace(/\.mdx?$/, ''), body: content.trim(), html: marked.parse(content) as string };
}

export function collection(dir: string): Doc[] {
  return fs
    .readdirSync(path.join(ROOT, dir))
    .filter((f) => f.endsWith('.md'))
    .map((f) => readDoc(dir, f))
    .sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
}

export function doc(dir: string, slug: string): Doc {
  return readDoc(dir, slug + '.md');
}

export const site = () => json('site/site.json');
