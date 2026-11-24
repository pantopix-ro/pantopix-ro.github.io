// The current pantopix.ro (Wix) homepage, rebuilt as closely as possible, with one change:
// the hero video is replaced by the "Live event stream" v15 animation. Redesign pieces get added here one at a time.
// Text changes from the Wix page: GmbH-only topics (technical documentation, product data and catalogs) removed,
// and the "Book your free audi" typo fixed.
import './classic.css';
import EipStream from '@/components/EipStream';
import ClassicForm from '@/components/ClassicForm';
import { site } from '@/lib/content';

export const metadata = { title: { absolute: 'PANTOPIX RO' }, robots: { index: false } };

const SERVICES: [string, string, string[], string][][] = [
  [
    ['svc-product', 'Digital Product Development', ['Custom solutions that bring your business ideas to life.', 'We build scalable digital products tailored to your needs, whether you’re in e-commerce, manufacturing, or services. From backend systems to user-facing platforms, we ensure quality and performance.'], '🧩 Java, Spring Boot, React, Node.js, Kubernetes, AWS, GCP'],
    ['svc-branding', 'Branding & Graphic Design', ['Create a brand that connects.', 'From logos to launch campaigns, we deliver graphic systems that resonate and support growth.'], '🖼️ Assets: Logo packs, social kits, visual guidelines'],
    ['svc-mobile', 'Mobile Apps', ['Engage customers with seamless mobile experiences.', 'Cross-platform mobile apps built with React Native, supporting rich functionality like offline access, QR scanning, and push notifications.'], '📱 iOS, Android'],
  ],
  [
    ['svc-realtime', 'Real-Time Data & Analytics', ['We build analytics platforms that process 20K+ events per second, delivering actionable insights in seconds.'], '📊 Kafka, Elasticsearch, Redis, Spring Boot'],
    ['svc-uiux', 'UI/UX & Experience Design', ['We design intuitive, accessible, and elegant UI/UX using tools like Figma and Adobe Creative Suite, backed by experience designing for global markets.'], '🎨 Wireframes, Prototypes, Full UI Design'],
    ['svc-security', 'Cloud Security & Compliance', ['Modern infrastructure that grows with you.', 'We help businesses transition to cloud-native environments, improve CI/CD processes, and reduce operational costs.'], '☁️ Kubernetes, Terraform, Docker, GitLab CI/CD, GCP, AWS'],
  ],
  [
    ['svc-startup', 'Startup Acceleration', ['From MVP to market with a cross-functional team.', 'We support early-stage ventures with product development, UI/UX design, team building, and cloud architecture, reducing time-to-market and enabling efficient scaling.'], '🚀 Ideal for: Seed & Series A Startups'],
    ['svc-devops', 'Cloud & DevOps Development', ['Modern infrastructure that grows with you.', 'We help businesses transition to cloud-native environments, improve CI/CD processes, and reduce operational costs.'], '☁️ Kubernetes, Terraform, Docker, GitLab CI/CD, GCP, AWS'],
    ['svc-ecommerce', 'E-commerce Efficiency & Automation', ['Smarter retail through automation and tech.', 'We streamline inventory, document workflows, and backend logic for large-scale online retailers, improving responsiveness and reducing manual effort.'], '🛒 Results: 90% time savings, 100K+ emails/hour, 25% faster updates'],
  ],
];

const TEAM = ['Bogdan', 'Mihnea', 'Silviu', 'Anuța', 'Serena', 'Florin', 'Andrei'];
const photo = (n: string) => '/team/' + n.toLowerCase().replace('ț', 't') + '.jpg';

const STEPS: [string, string, string][] = [
  ['Discovery & Research', 'We dive deep into your goals, challenges, workflows, and user insights to build a strategic foundation.', 'A project brief outlining needs, success metrics, and initial scope.'],
  ['Strategy & Planning', 'We define the solution roadmap, including user flows, feature sets, tech stack, and visual style.', 'Wireframes, architecture blueprints, and a project timeline.'],
  ['Design & Implementation', 'A seamless blend: UI/UX design, followed by engineering: coding, integrations, backend & frontend.', 'A fully functional prototype or product, ready for testing.'],
  ['Monitoring & Optimization', 'Post-deployment, we monitor performance, usage, and system health, then iterate improvements.', 'Analytics dashboard, performance tweaks, and optimization roadmap.'],
  ['Delivery & Handoff', 'We finalize handover: documentation, team training, deployment packages, and maintenance guidelines.', 'A production-ready solution, ownership transfer, and optional future support plan.'],
];

export default function Classic() {
  const s = site();
  return (
    <div className="wx">
      <section className="wx-hero">
        <header className="wx-head">
          <div className="wx-wrap">
            <a href="/classic/" className="wx-logo"><img src="/classic/logo.png" alt="PANTOPIX RO" width={190} height={36} /></a>
            <nav aria-label="Main">
              <a href="#services">Services</a><a href="#team">Team</a><a href="#process">Process</a><a href="#product">Our Product</a><a href="/insights/">Insights</a>
            </nav>
            <a className="wx-talk" href="#audit">Let&apos;s Talk</a>
          </div>
        </header>
        <div className="wx-wrap wx-hero-grid">
          <div className="wx-hero-text" id="wx-hero-text">
            <h1>Building <br className="r" /><em>Digital Products</em> <br />in the Service of <br className="r" /><em>Growing Businesses</em></h1>
          </div>
          <figure className="wx-graph">
            <EipStream bg="#051223" cal={s.calendar} stage={3} headBelow simple />
            <figcaption className="wx-note">A sample architecture, based on systems we have built for clients.</figcaption>
          </figure>
        </div>
      </section>

      <section id="services" className="wx-services">
        <div className="wx-wrap">
          <h2 className="wx-title center">Services we offer</h2>
          <div className="wx-cols">
            {SERVICES.map((col, i) => (
              <div className="wx-col" key={i}>
                {col.map(([icon, title, paras, tag]) => (
                  <article className="wx-card" key={title}>
                    <img src={'/classic/' + icon + '.svg'} alt="" width={64} height={64} />
                    <h3>{title}</h3>
                    {paras.map((p) => <p key={p}>{p}</p>)}
                    <p className="tag">{tag}</p>
                  </article>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="product" className="wx-dark wx-product">
        <div className="wx-wrap center">
          <h2 className="wx-title light">Our Product</h2>
          <h3>Kaisha</h3>
          <p className="q">Do you know how much time each customer spent this month?</p>
          <p>Kaisha helps companies that sell expertise see exactly how much time and profit each client generates, in real time, without Excel, without estimates.</p>
          <img src="/classic/kaisha.gif" alt="Kaisha overview" loading="lazy" />
          <a className="wx-btn" href="https://kaisha.to/" target="_blank" rel="noopener">See more</a>
        </div>
      </section>

      <section id="team" className="wx-dark wx-team">
        <div className="wx-wrap">
          <h2 className="wx-title light">Our Amazing Team</h2>
          <p>We’re PANTOPIX RO, a team of developers and designers building software that helps businesses grow in the digital age.</p>
          <p>Founded in January 2025, we’re the Romanian branch of PANTOPIX GmbH (est. 2010), a German pioneer in digital solutions. As part of the PANTOPIX group, we combine expertise in data and LLMs with our knowledge of software craftsmanship.</p>
          <p>Our team brings deep experience across backend, frontend, mobile, cloud, and design. We specialize in turning complex ideas into clean, powerful solutions, from data analytics to cloud-native apps and LLM-powered tools.</p>
          <p>Backed by years of experience across multiple industries, our team of experts delivers a robust suite of services, from data analytics to cloud-native development and LLM solutions, helping clients transform their operations and thrive in a fast-evolving digital world.</p>
          <ul className="wx-people">
            {TEAM.map((n) => <li key={n}><img src={photo(n)} alt={n} width={110} height={110} loading="lazy" /><span>{n}</span></li>)}
          </ul>
        </div>
      </section>
      <div className="wx-band" aria-hidden="true" />

      <section id="process" className="wx-process">
        <div className="wx-wrap wx-process-grid">
          <div className="wx-process-intro">
            <h2>How we grow <em>together</em></h2>
            <p>Whether you’re starting a new product from scratch or looking to improve an existing one that didn’t meet expectations, we’re here to help!</p>
            <p>Our team provides user-centered design, clear product strategy backed by analytics, and a reliable infrastructure supported by DevOps methodologies and cloud services.</p>
            <p>We enable long-term growth through attentive monitoring, proactive improvements, and seamless operation.</p>
          </div>
          <ol className="wx-steps" aria-label="How you'll grow">
            {STEPS.map(([t, what, get], i) => (
              <li key={t}>
                <div className="h"><img src={'/classic/step-' + (i + 1) + '.svg'} alt="" width={40} height={40} /><h3>{i + 1}. {t}</h3></div>
                <p>What happens: {what}</p>
                <p>You get: {get}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="audit" className="wx-dark wx-audit">
        <div className="wx-wrap"><ClassicForm email={s.email} /></div>
      </section>

      <footer className="wx-foot">
        <div className="wx-wrap">
          <span>© 2026 PANTOPIX RO</span>
          <a href="/privacy/">Privacy Policy</a>
          <span className="code">Company Code: {s.legal.cui}</span>
          <a href={s.linkedin} target="_blank" rel="noopener" aria-label="LinkedIn">in</a>
        </div>
      </footer>
    </div>
  );
}
