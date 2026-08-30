import { lazy, Suspense, useEffect, useRef } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { HomePage } from './pages/HomePage';
import { NotFoundPage } from './pages/NotFoundPage';

/* Split the bundle: the home page and chrome load eagerly; everything else
   (and the whole admin area) is fetched on demand. */
const AssistantPage = lazy(() => import('./pages/AssistantPage').then((m) => ({ default: m.AssistantPage })));
const SignInPage = lazy(() => import('./pages/SignInPage').then((m) => ({ default: m.SignInPage })));
const RegisterPage = lazy(() => import('./pages/RegisterPage').then((m) => ({ default: m.RegisterPage })));
const SchemesPage = lazy(() => import('./pages/SchemesPage').then((m) => ({ default: m.SchemesPage })));
const SchemeDetailPage = lazy(() => import('./pages/SchemeDetailPage').then((m) => ({ default: m.SchemeDetailPage })));
const ContentSectionPage = lazy(() => import('./pages/ContentSectionPage').then((m) => ({ default: m.ContentSectionPage })));
const GrievancePage = lazy(() => import('./pages/GrievancePage').then((m) => ({ default: m.GrievancePage })));
const TrackGrievancePage = lazy(() => import('./pages/TrackGrievancePage').then((m) => ({ default: m.TrackGrievancePage })));
const ServicesPage = lazy(() => import('./pages/ServicesPage').then((m) => ({ default: m.ServicesPage })));
const KnowledgePage = lazy(() => import('./pages/KnowledgePage').then((m) => ({ default: m.KnowledgePage })));
const AboutPage = lazy(() => import('./pages/AboutPage').then((m) => ({ default: m.AboutPage })));

const AdminLayout = lazy(() => import('./pages/admin/AdminLayout').then((m) => ({ default: m.AdminLayout })));
const AdminOverviewPage = lazy(() => import('./pages/admin/AdminOverviewPage').then((m) => ({ default: m.AdminOverviewPage })));
const AdminKnowledgePage = lazy(() => import('./pages/admin/AdminKnowledgePage').then((m) => ({ default: m.AdminKnowledgePage })));
const AdminSchemesPage = lazy(() => import('./pages/admin/AdminSchemesPage').then((m) => ({ default: m.AdminSchemesPage })));
const AdminSchemeEditPage = lazy(() => import('./pages/admin/AdminSchemeEditPage').then((m) => ({ default: m.AdminSchemeEditPage })));
const AdminGrievancesPage = lazy(() => import('./pages/admin/AdminGrievancesPage').then((m) => ({ default: m.AdminGrievancesPage })));
const AdminGrievanceDetailPage = lazy(() => import('./pages/admin/AdminGrievanceDetailPage').then((m) => ({ default: m.AdminGrievanceDetailPage })));

/** Move keyboard focus to the page heading on every route change. */
function useRouteFocus() {
  const location = useLocation();
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const target = document.getElementById('main');
    if (target) {
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: false });
    }
  }, [location.pathname]);
}

export function App() {
  const { t } = useTranslation();
  useRouteFocus();

  return (
    <Layout>
      <Suspense fallback={<p className="container-page py-8 text-ink-2">{t('common.loading')}</p>}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/knowledge" element={<KnowledgePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/assistant" element={<AssistantPage />} />
          <Route path="/schemes" element={<SchemesPage />} />
          <Route path="/schemes/:slug" element={<SchemeDetailPage />} />
          <Route path="/cooperative" element={<ContentSectionPage section="COOPERATIVE_LAW" />} />
          <Route path="/pacs" element={<ContentSectionPage section="PACS" />} />
          <Route path="/pmfby" element={<ContentSectionPage section="PMFBY" />} />
          <Route path="/money" element={<ContentSectionPage section="FINANCIAL_LITERACY" />} />
          <Route path="/grievance" element={<GrievancePage />} />
          <Route path="/track" element={<TrackGrievancePage />} />
          <Route path="/track/:trackingId" element={<TrackGrievancePage />} />

          <Route
            path="/admin"
            element={
              <ProtectedRoute roles={['ADMIN']}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminOverviewPage />} />
            <Route path="knowledge" element={<AdminKnowledgePage />} />
            <Route path="schemes" element={<AdminSchemesPage />} />
            <Route path="schemes/new" element={<AdminSchemeEditPage />} />
            <Route path="schemes/:slug" element={<AdminSchemeEditPage />} />
            <Route path="grievances" element={<AdminGrievancesPage />} />
            <Route path="grievances/:trackingId" element={<AdminGrievanceDetailPage />} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </Layout>
  );
}
