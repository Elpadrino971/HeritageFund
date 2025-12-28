import React from "react";
import "@/App.css";
import "./i18n"; // Initialize i18n
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "./components/ui/sonner";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";

// Layout
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

// Pages
import Landing from "./pages/Landing";
import AuthCallback from "./pages/AuthCallback";
import Campaigns from "./pages/Campaigns";
import CampaignDetail from "./pages/CampaignDetail";
import CalculatorPage from "./pages/CalculatorPage";
import HeirDashboard from "./pages/HeirDashboard";
import CreateCampaign from "./pages/CreateCampaign";
import InvestorDashboard from "./pages/InvestorDashboard";
import NotaryDashboard from "./pages/NotaryDashboard";
import PaymentSuccess from "./pages/PaymentSuccess";
import ProtectedRoute from "./components/auth/ProtectedRoute";

function AppContent() {
    const location = useLocation();

    // Check for session_id in URL fragment (OAuth callback)
    if (location.hash?.includes('session_id=')) {
        return <AuthCallback />;
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">
                <Routes>
                    {/* Public routes */}
                    <Route path="/" element={<Landing />} />
                    <Route path="/auth/callback" element={<AuthCallback />} />
                    <Route path="/calculator" element={<CalculatorPage />} />
                    <Route path="/campaigns" element={<Campaigns />} />
                    <Route path="/campaigns/:id" element={<CampaignDetail />} />
                    <Route path="/payment/success" element={<PaymentSuccess />} />

                    {/* Protected routes - Heir */}
                    <Route
                        path="/dashboard/heir"
                        element={
                            <ProtectedRoute>
                                <HeirDashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/dashboard/heir/create"
                        element={
                            <ProtectedRoute>
                                <CreateCampaign />
                            </ProtectedRoute>
                        }
                    />

                    {/* Protected routes - Investor */}
                    <Route
                        path="/dashboard/investor"
                        element={
                            <ProtectedRoute>
                                <InvestorDashboard />
                            </ProtectedRoute>
                        }
                    />

                    {/* Protected routes - Notary */}
                    <Route
                        path="/dashboard/notary"
                        element={
                            <ProtectedRoute>
                                <NotaryDashboard />
                            </ProtectedRoute>
                        }
                    />

                    {/* Fallback */}
                    <Route path="*" element={<Landing />} />
                </Routes>
            </main>
            <Footer />
            <Toaster position="top-right" richColors />
        </div>
    );
}

function App() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <BrowserRouter>
                    <AppContent />
                </BrowserRouter>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;
