// src/App.jsx
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PageLayout from './layout/PageLayout';
import Overview from './pages/Overview';
import MemeScanner from './pages/MemeScanner';
import BundleChecker from './pages/BundleChecker';
import About from './pages/About';
import CustomCursor from './components/CustomCursor';
import LoadingScreen from './components/LoadingScreen';
import WorldMap from './pages/Server';  // Add this import

function App() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <Router>
      {isLoading && <LoadingScreen onLoadingComplete={() => setIsLoading(false)} />}
      <PageLayout>
        <Routes>
          <Route path="/" element={<Overview />} />
          <Route path="/meme-scanner" element={<MemeScanner />} />
          <Route path="/bundle-checker" element={<BundleChecker />} />
          <Route path="/about" element={<About />} />
          <Route path="/servers" element={<WorldMap />} />  {/* Add this new route */}
        </Routes>
      </PageLayout>
      <CustomCursor />
    </Router>
  );
}

export default App;