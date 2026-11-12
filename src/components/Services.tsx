import Icon from './Icon';
import type { Doc } from '@/lib/content';

const GROUPS: [string, string][] = [
  ['Build', 'Build: the product and what runs behind it'],
  ['Run', 'Run: keep it fast, safe and moving'],
  ['Join', 'Join: engineers inside your team'],
];

export default function Services({ items }: { items: Doc[] }) {
  return (
    <>
      {GROUPS.map(([g, label]) => {
        const list = items.filter((s) => s.group === g);
        return (
          <div className="svc-group" key={g}>
            <h3>{label}</h3>
            <div className={'services' + (list.length !== 4 ? ' three' : '')}>
              {list.map((s) => (
                <article className="svc" key={s.slug}>
                  <Icon name={s.icon} />
                  <h3>{s.title}</h3>
                  <p>{s.summary}</p>
                  <p className="stack"><b>Stack:</b> {s.stack}</p>
                  <a className="btn primary" href={'/services/' + s.slug + '/'}>Explore →</a>
                </article>
              ))}
            </div>
          </div>
        );
      })}
    </>
  );
}
