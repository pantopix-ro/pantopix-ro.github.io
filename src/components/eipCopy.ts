// Short, plain tooltip copy for the "Live event stream" animation, with technology logos in place of the tech line.
// Passed to eip.js as the label option. Logos: Simple Icons 13.21.0 (CC0), recoloured, in public/eip/icons/.
const ic = (slug: string, name: string) => ({ src: '/eip/icons/' + slug + '.svg', name });
const KAFKA = ic('apachekafka', 'Apache Kafka');
const SPRING = ic('springboot', 'Spring Boot');
const MQTT = ic('mqtt', 'MQTT');
const REDIS = ic('redis', 'Redis');
const K8S = ic('kubernetes', 'Kubernetes');
const PG = ic('postgresql', 'PostgreSQL');
const NEO = ic('neo4j', 'Neo4j');

type Copy = { t?: string; s: string; icons: { src: string; name: string }[] };

const BOX: Record<string, Copy> = {
  ing: { s: 'Takes in every event. Drops duplicates and bot traffic, and sets broken events aside.', icons: [SPRING, KAFKA, MQTT] },
  enr: { s: 'Adds customer details to each shopper event, and stock levels to each scan.', icons: [REDIS, K8S] },
  mat: { s: 'Links each order to the shopping path that led to it.', icons: [KAFKA] },
  jny: { s: 'Follows one shopper across phone and laptop, and keeps each visit in order.', icons: [KAFKA] },
};
const SRC = [
  'Page views, searches and carts from the online shop.',
  'Visits and taps from the iOS and Android apps.',
  'Payments and refunds from the payment provider.',
  'Warehouse scans: goods in, pick, pack and dispatch.',
];

export function eipLabel(h: any, I: any) {
  let c: Copy | null = null;
  switch (h.kind) {
    case 'box': c = BOX[h.k]; break;
    case 'pips': c = { s: 'Several copies share the work. If one stops, a new one starts in seconds.', icons: [K8S] }; break;
    case 'bin': c = { t: 'Broken events', s: 'Events that failed the check wait here until they are fixed.', icons: [KAFKA] }; break;
    case 'tap': c = { t: 'Second reader', s: 'Journey reads the same events, without slowing the main line.', icons: [KAFKA] }; break;
    case 'rt': c = { s: 'Sends orders and stock to PostgreSQL, and shopper paths to the graph.', icons: [KAFKA] }; break;
    case 'pg': c = { s: 'Stores orders and stock. Each order shows the path that led to it.', icons: [PG] }; break;
    case 'gr': c = { s: 'Links visits, devices and customers, so you see how people reached checkout.', icons: [NEO] }; break;
    case 'src': c = { s: SRC[h.i] || I.s, icons: h.i === 3 ? [MQTT] : [] }; break;
    case 'srcs': c = { s: 'The shop, the apps, payments and the warehouse all send events.', icons: [] }; break;
    case 'edge': {
      const r: string = h.route;
      if (r === 'rpg') c = { t: 'To PostgreSQL', s: 'Writes orders and stock to the database.', icons: [KAFKA, PG] };
      else if (r === 'rgr' || r === 'jg') c = { t: 'To the graph', s: 'Writes customer, device and path links to the graph.', icons: [KAFKA, NEO] };
      else c = { t: 'Event queue', s: 'Carries events to the next step, and holds them when that step is slow.', icons: [KAFKA] };
      break;
    }
    case 'head': c = { t: 'Live load', s: 'Events per second, right now. Add more and watch the system scale.', icons: [] }; break;
  }
  if (!c) return I;
  // the live value, in plain words: no pods, no p95, no consumer lag
  const plain = (v: string) => v
    .replace(/ · lookup p95 \d+ ms/, '').replace(/ · lag [\d,.]+ ?\w*/, ' · catching up')
    .replace(/\b1 pods?\b/, '1 server').replace(/\bpods\b/g, 'servers').replace(/\bpod\b/g, 'server')
    .replace('events/s in', 'events/s');
  const v = I.v ? () => plain(I.v()) : undefined;
  return { ...I, t: c.t || I.t, p: '', sup: '', s: c.s, tech: '', icons: c.icons, v };
}
