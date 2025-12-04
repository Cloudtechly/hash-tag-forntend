import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Home from './pages/public/Home'
import Login from './pages/auth/Login'
import Signup from './pages/auth/Signup'
import ForgotPassword from './pages/auth/ForgotPassword'
import Interests from './pages/Interests'
import Dashboard from './pages/admin/Dashboard'
import Layout from './components/Layout'

import InterestsNavPage from './pages/InterestsNavPage'
import AddPage from './pages/AddPage'
import OffersPage from './pages/OffersPage'
import ProfilePage from './pages/ProfilePage'
import WalletPage from './pages/WalletPage'
import SearchPage from './pages/SearchPage'
import MembershipPage from './pages/MembershipPage'
import ProductDetailPage from './pages/ProductDetailPage'
import AuctionFlow from './pages/auction/AuctionFlow'
import AdminLoginPage from './pages/admin/AdminLoginPage'
import AdminCurrenciesPage from './pages/admin/AdminCurrenciesPage';
import AdminSystemSettingsPage from './pages/admin/AdminSystemSettingsPage';
// ...existing imports...
import AdminDashboardPage, { AdminDashboardLayout } from './pages/admin/AdminDashboardPage'
import AdminProductsPage from './pages/admin/AdminProductsPage'
import AdminAdsPage from './pages/admin/AdminAdsPage'
import AdminCategoriesPage from './pages/admin/AdminCategoriesPage'
import AdminLanguagesPage from './pages/admin/AdminLanguagesPage'
import AdminCustomersPage from './pages/admin/AdminCustomersPage'
import AdminPackagesPage from './pages/admin/AdminPackagesPage'
import OtpPage from './pages/auth/OtpPage'

export default function App() {
  return (
    <div className="min-h-screen bg-white">
      <main>
        <Routes>
          <Route path="/*" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/otp" element={<OtpPage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/interests" element={<Interests />} />
          <Route path="/interests-nav" element={<InterestsNavPage />} />
          <Route path="/add" element={<AddPage />} />
          <Route path="/offers" element={<OffersPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/wallet" element={<WalletPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/membership" element={<MembershipPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/auction/*" element={<AuctionFlow />} />
          <Route path="/admin/*" element={
            <AdminDashboardLayout>
              <Routes>
                <Route index element={<AdminDashboardPage />} />
                <Route path="products" element={<AdminProductsPage />} />
                <Route path="ads" element={<AdminAdsPage />} />
                <Route path="categories" element={<AdminCategoriesPage />} />
                <Route path="languages" element={<AdminLanguagesPage />} />
                <Route path="customers" element={<AdminCustomersPage />} />
                <Route path="packages" element={<AdminPackagesPage />} /> 
                 <Route path="currencies" element={<AdminCurrenciesPage />} />
                 <Route path="system-settings" element={<AdminSystemSettingsPage />} />
              </Routes>
            </AdminDashboardLayout>
          } />
          <Route
            path="/admin/login"
            element={
            <AdminLoginPage />
            }
          />
        
        </Routes>
      </main>
    </div>
  )
}
