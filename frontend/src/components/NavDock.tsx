import ThemeToggle from "./ThemeToggle";

const NavDock = () => {
  return (
    <header className="nav-dock">
      <div className="brand-mark">
        <span className="brand-mark__dot" />
        <span>CloudGallery</span>
      </div>
      <nav className="nav-dock__links" aria-label="Primary">
        <a href="#features">Features</a>
        <a href="#devices">Devices</a>
        <a href="#flow">Flow</a>
      </nav>
      <ThemeToggle />
    </header>
  );
};

export default NavDock;
