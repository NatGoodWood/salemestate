import { lazy, Suspense } from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
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
import Login from './pages/admin/Login';

// Admin code is split out so public visitors never download it.
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const ListingForm = lazy(() => import('./pages/admin/ListingForm'));

const NotFound = () => (
  <div className="container narrow section"><h1>Page not found</h1><p className="muted">That page does not exist.</p><Link className="btn btn-primary" to="/">Back to home</Link></div>
);

export default function App() {
  return (
    <Suspense fallback={<div className="container section"><p className="muted">Loading…</p></div>}>
      <Routes>
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
          <Route path="admin/login" element={<Login />} />
          <Route path="admin" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="admin/listings/new" element={<ProtectedRoute><ListingForm /></ProtectedRoute>} />
          <Route path="admin/listings/:id" element={<ProtectedRoute><ListingForm /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
