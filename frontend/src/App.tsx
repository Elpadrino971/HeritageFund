import { Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout'
import { HomePage } from './pages/HomePage'
import { CalculatorPage } from './pages/CalculatorPage'
import { CampaignsPage } from './pages/CampaignsPage'
import { CampaignDetailPage } from './pages/CampaignDetailPage'
import { CreateCampaignPage } from './pages/CreateCampaignPage'
import { InvestorDashboardPage } from './pages/InvestorDashboardPage'
import { HeirDashboardPage } from './pages/HeirDashboardPage'
import { NotaryDashboardPage } from './pages/NotaryDashboardPage'
import { LoginPage } from './pages/LoginPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="calculator" element={<CalculatorPage />} />
        <Route path="campaigns" element={<CampaignsPage />} />
        <Route path="campaigns/:id" element={<CampaignDetailPage />} />
        <Route path="campaigns/new" element={<CreateCampaignPage />} />
        <Route path="dashboard/investor" element={<InvestorDashboardPage />} />
        <Route path="dashboard/heir" element={<HeirDashboardPage />} />
        <Route path="dashboard/notary" element={<NotaryDashboardPage />} />
        <Route path="login" element={<LoginPage />} />
      </Route>
    </Routes>
  )
}

export default App
