import { Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { PlaceholderPage } from './pages/PlaceholderPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { SignInPage } from './pages/SignInPage';
import { RegisterPage } from './pages/RegisterPage';
import { AssistantPage } from './pages/AssistantPage';
import { SchemesPage } from './pages/SchemesPage';
import { SchemeDetailPage } from './pages/SchemeDetailPage';
import { ContentSectionPage } from './pages/ContentSectionPage';

/**
 * Remaining stubs: /grievance (M6), /track (M6), /admin (M7).
 */
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
        <Route path="/grievance" element={<PlaceholderPage titleKey="nav.grievance" />} />
        <Route path="/track" element={<PlaceholderPage titleKey="nav.track" />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Layout>
  );
}
