import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Gallery from './pages/Gallery';
import Downloads from './pages/Downloads';
import TeachersDay from './pages/TeachersDay';
import Admin from './pages/Admin';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="gallery" element={<Gallery />} />
        <Route path="downloads" element={<Downloads />} />
        <Route path="teachers-day" element={<TeachersDay />} />
        <Route path="admin" element={<Admin />} />
      </Route>
    </Routes>
  );
}
