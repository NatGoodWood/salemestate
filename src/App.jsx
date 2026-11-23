import { lazy, Suspense } from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Properties from './pages/Properties';
import ListingDetail from './pages/ListingDetail';
import Contact from './pages/Contact';
import About from './pages/About';
import NowSelling from './pages/NowSelling';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import FAQ from './pages/FAQ';
import Gallery from './pages/Gallery';

// Admin code is a separate download that regular visitors never receive.
const AdminApp = lazy(() => import('./admin/AdminApp'));

const NotFound = () => (
  <div className="container narrow section"><h1>Page not found</h1><p className="muted">That page does not exist.</p><Link className="btn btn-primary" to="/">Back to home</Link></div>
);

export default function App() {
  return (
    <Routes>
      <Route path="admin/*" element={<Suspense fallback={<p className="container section muted">Loading…</p>}><AdminApp /></Suspense>} />
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="properties" element={<Properties />} />
        <Route path="properties/:id" element={<ListingDetail />} />
        <Route path="about-us" element={<About />} />
        <Route path="about" element={<Navigate to="/about-us" replace />} />
        <Route path="now-selling" element={<NowSelling />} />
        <Route path="projects" element={<Projects />} />
        <Route path="projects/:slug" element={<ProjectDetail />} />
        <Route path="faq" element={<FAQ />} />
        <Route path="gallery" element={<Gallery />} />
        <Route path="contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
