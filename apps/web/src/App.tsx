import { Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { PlaceholderPage } from './pages/PlaceholderPage';
import { NotFoundPage } from './pages/NotFoundPage';

/**
 * Routes are stubbed with PlaceholderPage until their milestone lands:
 *  - /assistant  (M3)   - /schemes (M5)     - /cooperative (M5)
 *  - /pacs (M5)          - /pmfby (M5)       - /money (M5)
 *  - /grievance (M6)     - /track (M6)       - /admin (M7)
 */
export function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/assistant" element={<PlaceholderPage titleKey="nav.assistant" />} />
        <Route path="/schemes" element={<PlaceholderPage titleKey="nav.schemes" />} />
        <Route path="/cooperative" element={<PlaceholderPage titleKey="nav.cooperative" />} />
        <Route path="/pacs" element={<PlaceholderPage titleKey="nav.pacs" />} />
        <Route path="/pmfby" element={<PlaceholderPage titleKey="nav.pmfby" />} />
        <Route path="/money" element={<PlaceholderPage titleKey="nav.money" />} />
        <Route path="/grievance" element={<PlaceholderPage titleKey="nav.grievance" />} />
        <Route path="/track" element={<PlaceholderPage titleKey="nav.track" />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Layout>
  );
}
