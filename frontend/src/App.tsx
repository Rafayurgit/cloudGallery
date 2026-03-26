import NavDock from "./components/NavDock";
import HeroSection from "./components/HeroSection";
import FeatureGrid from "./components/FeatureGrid";
import DeviceStrip from "./components/DeviceStrip";
import FlowPanel from "./components/FlowPanel";
import FooterBar from "./components/FooterBar";

const App = () => {
  return (
    <div className="app-shell">
      <NavDock />
      <main>
        <HeroSection />
        <FeatureGrid />
        <DeviceStrip />
        <FlowPanel />
      </main>
      <FooterBar />
    </div>
  );
};

export default App;
