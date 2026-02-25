import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '@/legacy-pages/Home';
import SearchPage from '@/legacy-pages/Search'; // your [id].tsx page
import NotFound from '@/legacy-pages/404';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Home page */}
        <Route path="/" element={<Home />} />

        {/* Dynamic search page */}
        <Route path="/search/:id" element={<SearchPage />} />

        {/* 404 fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
