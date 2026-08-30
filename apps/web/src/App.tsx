import { Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { HomePage } from './pages/HomePage';
import { NotFoundPage } from './pages/NotFoundPage';
import { SignInPage } from './pages/SignInPage';
import { RegisterPage } from './pages/RegisterPage';
import { AssistantPage } from './pages/AssistantPage';
import { SchemesPage } from './pages/SchemesPage';
import { SchemeDetailPage } from './pages/SchemeDetailPage';
import { ContentSectionPage } from './pages/ContentSectionPage';
import { GrievancePage } from './pages/GrievancePage';
import { TrackGrievancePage } from './pages/TrackGrievancePage';
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminOverviewPage } from './pages/admin/AdminOverviewPage';
import { AdminKnowledgePage } from './pages/admin/AdminKnowledgePage';
import { AdminSchemesPage } from './pages/admin/AdminSchemesPage';
import { AdminSchemeEditPage } from './pages/admin/AdminSchemeEditPage';
import { AdminGrievancesPage } from './pages/admin/AdminGrievancesPage';
import { AdminGrievanceDetailPage } from './pages/admin/AdminGrievanceDetailPage';

export function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
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
    </Layout>
  );
}
