interface HeaderProps {
  onToggleMobileMenu: () => void;
}

export default function Header({ onToggleMobileMenu }: HeaderProps) {
  return (
    <div id="header">
      <button className="hamburger" onClick={onToggleMobileMenu} aria-label="Menu">
        &#9776;
      </button>
      <svg className="header-seal" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="48" fill="#002868" stroke="#BF0A30" strokeWidth="3" />
        <circle cx="50" cy="50" r="36" fill="#ffffff" opacity="0.12" />
        <text x="50" y="46" textAnchor="middle" fontSize="28" fill="white" fontWeight="900">OH</text>
        <text x="50" y="64" textAnchor="middle" fontSize="10" fill="#f0c040" fontWeight="700" letterSpacing="1">OHIO</text>
        <text x="50" y="76" textAnchor="middle" fontSize="7.5" fill="white" fontWeight="500">Est. 1803</text>
      </svg>
      <div id="header-center">
        <h1>Ohio Learning Institutions</h1>
        <div className="meta">
          By Mike Costarella &nbsp;|&nbsp; Data: Fall 2024
        </div>
      </div>
      <svg className="header-seal" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="48" fill="#BF0A30" stroke="#002868" strokeWidth="3" />
        <text x="50" y="42" textAnchor="middle" fontSize="11" fill="white" fontWeight="700">OHIO</text>
        <text x="50" y="56" textAnchor="middle" fontSize="10" fill="#f0c040" fontWeight="700">LEARNING</text>
        <text x="50" y="70" textAnchor="middle" fontSize="9" fill="white" fontWeight="500">INSTITUTIONS</text>
      </svg>
    </div>
  );
}
