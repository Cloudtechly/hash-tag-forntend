import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Home from './pages/public/Home'
import Login from './pages/auth/Login'
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
import MyProductsPage from './pages/MyProductsPage'
import MyProductDetailPage from './pages/MyProductDetailPage'
import CustomerPage from './pages/CustomerPage'
import AuctionFlow from './pages/auction/AuctionFlow'
import AdminLoginPage from './pages/admin/AdminLoginPage'
import AdminCurrenciesPage from './pages/admin/AdminCurrenciesPage';
import AdminCountriesPage from './pages/admin/AdminCountriesPage';
import AdminCitiesPage from './pages/admin/AdminCitiesPage';
import AdminOwnerTransactionsPage from './pages/admin/AdminOwnerTransactionsPage';
import AdminAuctionsPage from './pages/admin/AdminAuctionsPage';
import AdminSystemSettingsPage from './pages/admin/AdminSystemSettingsPage';
import AdminAnalyticsPage from './pages/admin/AdminAnalyticsPage';
import AdminDashboardPage, { AdminDashboardLayout } from './pages/admin/AdminDashboardPage'
import AdminProductsPage from './pages/admin/AdminProductsPage'
import AdminAdsPage from './pages/admin/AdminAdsPage'
import AdminCategoriesPage from './pages/admin/AdminCategoriesPage'
import AdminLanguagesPage from './pages/admin/AdminLanguagesPage'
import AdminCustomersPage from './pages/admin/AdminCustomersPage'
import AdminPackagesPage from './pages/admin/AdminPackagesPage'
import OtpPage from './pages/auth/OtpPage'
import AuctionHomePage from './pages/auction/AuctionHomePage'
import SettingsPage from './pages/SettingsPage'
import InterestsFollowingPage from './pages/InterestsFollowingPage'
import CategoryProductsPage from './pages/CategoryProductsPage'

export default function App() {
  return (
    <div className="min-h-screen bg-white" dir={localStorage.getItem('lang')==='ar'?'rtl':'ltr'}>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/otp" element={<OtpPage />} />
          <Route path="/interests" element={<Interests />} />
          <Route path="/interests-nav" element={<InterestsNavPage />} />
          <Route path="/CategoryProductsPage/:categoryId" element={<CategoryProductsPage />} />
          <Route path="/add" element={<AddPage />} />
          <Route path="/offers" element={<OffersPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/wallet" element={<WalletPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/membership" element={<MembershipPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/customer/my-products" element={<MyProductsPage />} />
          <Route path="/customer/my-products/:id" element={<MyProductDetailPage />} />
          <Route path="/customer/:id" element={<CustomerPage />} />
          <Route path="/auction/*" element={<AuctionFlow />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/interests-following" element={<InterestsFollowingPage />} />
          <Route path="/auction-home" element={<AuctionHomePage />} />
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
                 <Route path="countries" element={<AdminCountriesPage />} />
                 <Route path="cities" element={<AdminCitiesPage />} />
                 <Route path="owner-transactions" element={<AdminOwnerTransactionsPage />} />
                 <Route path="auctions" element={<AdminAuctionsPage />} />
                 <Route path="system-settings" element={<AdminSystemSettingsPage />} />
                 <Route path="analytics" element={<AdminAnalyticsPage />} />
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
