// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PageLayout from './layout/PageLayout';
import Overview from './pages/Overview';
import MemeScanner from './pages/MemeScanner';
import BundleChecker from './pages/BundleChecker';
import About from './pages/About';
import CustomCursor from './components/CustomCursor';
function App() {
  return (
    <Router>
      <PageLayout>
        <Routes>
          <Route path="/" element={<Overview />} />
          <Route path="/meme-scanner" element={<MemeScanner />} />
          <Route path="/bundle-checker" element={<BundleChecker />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </PageLayout>
      <CustomCursor />
    </Router>
  );
}

export default App;