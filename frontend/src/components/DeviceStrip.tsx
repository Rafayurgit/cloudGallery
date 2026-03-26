const DeviceStrip = () => {
  return (
    <section id="devices" className="section-block">
      <div className="section-head">
        <p className="eyebrow">Responsive by default</p>
        <h2>Designed for every screen size.</h2>
      </div>
      <div className="device-strip">
        <div className="surface-card">
          <h3>Mobile</h3>
          <p>Quick actions, thumb-friendly spacing, and readable typography for compact screens.</p>
        </div>
        <div className="surface-card">
          <h3>Tablet</h3>
          <p>Balanced two-column composition for browsing files and viewing metadata side-by-side.</p>
        </div>
        <div className="surface-card">
          <h3>Desktop</h3>
          <p>Dense-yet-clean layout with stable navigation and keyboard-friendly interactions.</p>
        </div>
      </div>
    </section>
  );
};

export default DeviceStrip;
