export function LogoSymbol() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
      <defs>
        <symbol id="px-bars" viewBox="0 0 44 40">
          <rect x="0" y="0" width="3.6" height="13" fill="#f1b96a" />
          <rect x="6" y="0" width="3.6" height="17" fill="#f1b96a" />
          <rect x="12" y="0" width="3.6" height="21" fill="#f1ad66" />
          <rect x="18" y="0" width="3.6" height="25" fill="#f0a061" />
          <rect x="24" y="0" width="3.6" height="29" fill="#ee8b59" />
          <rect x="30" y="0" width="3.6" height="34" fill="#ec7450" />
          <rect x="36" y="0" width="6" height="40" fill="#ea5a47" />
        </symbol>
      </defs>
    </svg>
  );
}

export function Mark() {
  return (
    <a className="mark" href="/" aria-label="PANTOPIX Romania home">
      <svg aria-hidden="true"><use href="#px-bars" /></svg>
      <span className="word"><b>PANTOPIX</b><small>ROMANIA</small></span>
    </a>
  );
}
