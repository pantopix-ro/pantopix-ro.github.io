// TinaCMS schema. Tina edits the same Markdown and JSON files the site reads at build time.
// Local editing: `npm run cms`, then open http://localhost:3000/admin/index.html
// Editing on the live site needs a Tina Cloud project: set NEXT_PUBLIC_TINA_CLIENT_ID and TINA_TOKEN.
import { defineConfig } from 'tinacms';

const str = (name: string, label = name, extra: object = {}) => ({ type: 'string' as const, name, label, ...extra });
const text = (name: string, label = name) => str(name, label, { ui: { component: 'textarea' } });
const list = (name: string, label: string, fields: any[]) => ({ type: 'object' as const, name, label, list: true, fields });
const block = (name: string, label: string, fields: any[]) => ({ type: 'object' as const, name, label, fields });

export default defineConfig({
  branch: process.env.GITHUB_BRANCH || 'main',
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID || null,
  token: process.env.TINA_TOKEN || null,
  build: { outputFolder: 'admin', publicFolder: 'public' },
  media: { tina: { mediaRoot: 'team', publicFolder: 'public' } },
  schema: {
    collections: [
      {
        name: 'services', label: 'Services', path: 'content/services', format: 'md',
        fields: [
          str('title', 'Title', { isTitle: true, required: true }),
          str('group', 'Group', { options: ['Build', 'Run', 'Join'] }),
          { type: 'number', name: 'order', label: 'Order' },
          str('icon', 'Icon', { options: ['product', 'platform', 'ai', 'design', 'cloud', 'rescue', 'team'] }),
          text('summary', 'Summary'),
          str('stack', 'Stack'),
          { type: 'rich-text', name: 'body', label: 'Body', isBody: true },
        ],
      },
      {
        name: 'insights', label: 'Insights', path: 'content/insights', format: 'md',
        fields: [
          str('title', 'Title', { isTitle: true, required: true }),
          str('category', 'Category'),
          str('badge', 'Badge'),
          text('summary', 'Summary'),
          str('author', 'Author'),
          { type: 'number', name: 'readTime', label: 'Minutes to read' },
          { type: 'number', name: 'order', label: 'Order' },
          { type: 'boolean', name: 'draft', label: 'Draft (shows as "coming soon", no page)' },
          text('review', 'Note for reviewers (not shown)'),
          { type: 'rich-text', name: 'body', label: 'Body', isBody: true },
        ],
      },
      {
        name: 'team', label: 'Team', path: 'content/team', format: 'json',
        ui: { allowedActions: { create: false, delete: false } },
        fields: [list('members', 'Members', [str('name', 'Name'), str('role', 'Role'), { type: 'image', name: 'photo', label: 'Photo' }, str('linkedin', 'LinkedIn URL')])],
      },
      {
        name: 'site', label: 'Site settings', path: 'content/site', format: 'json',
        ui: { allowedActions: { create: false, delete: false } },
        fields: [
          str('name', 'Name'), text('tagline', 'Footer tagline'), str('email', 'Email'), str('calendar', 'Calendar link'),
          str('calendarLabel', 'Calendar button'), str('address', 'Address'), str('linkedin', 'LinkedIn'), str('group', 'Group website'),
          list('nav', 'Navigation', [str('label', 'Label'), str('href', 'Link')]),
          block('legal', 'Legal', [str('company'), str('cui'), str('register'), str('euid'), str('incorporated'), str('seat')]),
        ],
      },
      {
        name: 'home', label: 'Homepage', path: 'content/pages', format: 'json', match: { include: 'home' },
        ui: { allowedActions: { create: false, delete: false } },
        fields: [
          block('hero', 'Hero', [str('parent', 'Parent badge'), str('title', 'Title'), str('titleAccent', 'Title, coral part'), text('lede', 'Lede'), text('canvasLabel', 'Animation description for screen readers'), list('facts', 'Facts', [str('value'), str('label')])]),
          block('services', 'Services intro', [str('eyebrow'), str('title'), text('intro')]),
          block('rules', 'EU rules', [str('eyebrow'), str('title'), text('intro'), list('items', 'Rules', [str('date', 'Date (YYYY-MM-DD)'), str('when', 'Shown date'), str('title'), text('text')])]),
          block('cases', 'Case studies', [str('eyebrow'), str('title'), list('items', 'Cases', [str('metric'), str('unit'), str('title'), str('built'), str('result'), str('stack'), str('by')])]),
          block('how', 'How we work', [str('eyebrow'), str('title'), text('intro'), list('packages', 'Packages', [str('name'), text('text')]), list('steps', 'Steps', [str('name'), str('when'), text('text')])]),
          block('products', 'Our products', [str('eyebrow'), str('title'), list('items', 'Products', [str('name'), text('text'), str('url'), str('linkLabel')])]),
          block('group', 'Group', [str('eyebrow'), str('title'), text('text')]),
          block('team', 'Team intro', [str('eyebrow'), str('title'), text('intro')]),
          block('contact', 'Contact', [str('eyebrow'), str('title'), text('text')]),
        ],
      },
      {
        name: 'audit', label: 'Free audit page', path: 'content/pages', format: 'json', match: { include: 'audit' },
        ui: { allowedActions: { create: false, delete: false } },
        fields: [
          str('eyebrow'), str('title'), text('lede'),
          list('gets', 'What you get', [str('n'), text('text')]), text('keep'),
          str('forWho', 'Is this for you?', { list: true }),
          list('areas', 'Areas', [str('name'), text('text'), str('you', 'You get')]),
          list('steps', 'Steps', [str('name'), text('text'), str('time')]), text('howText'),
          str('report', 'Report contents', { list: true }), text('reportText'),
        ],
      },
      {
        name: 'legalPages', label: 'Legal pages', path: 'content/pages', format: 'md', match: { include: 'privacy' },
        ui: { allowedActions: { create: false, delete: false } },
        fields: [str('title', 'Title', { isTitle: true, required: true }), str('updated', 'Last updated (YYYY-MM-DD)'), { type: 'rich-text', name: 'body', label: 'Body', isBody: true }],
      },
    ],
  },
});
