import React, { useEffect, useState } from 'react';
import ProfileHeader from '../components/profile/ProfileHeader';
import MyListings from '../components/profile/MyListings';
import Overview from '../components/profile/Overview';
import Performance from '../components/profile/Performance';
import TopViewProducts from '../components/profile/TopViewProducts';
import CustomerEngagement from '../components/profile/CustomerEngagement';
import BottomNav from '../components/home/BottomNav';
import fetchData from '../Api/FetchApi';

interface ProfileData {
  id: number;
  name: string;
  email: string;
  phone_number: string | null;
  default_language_id: number;
  avatar: string | null;
  visitor_count: number;
  followers_count: number;
  approved_products_count: number;
  draft_products_count: number;
  closed_products_count: number;
  products_views_count: number;
  top_view_products: any[];
  views_last_30_days: number;
  created_at: string;
  updated_at: string;
}

const ProfilePage = () => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await fetchData('customer/profile');
        if (response && response.data) {
          setProfile(response.data);
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 pb-24 max-w-7xl mx-auto min-h-screen">
      <ProfileHeader user={profile} />
      <div className="p-4">
        <MyListings stats={profile} />
        <Overview stats={profile} />
        <Performance />
        <TopViewProducts products={profile?.top_view_products || []} />
        <CustomerEngagement stats={profile} />
      </div>
      <BottomNav />
    </div>
  );
};

export default ProfilePage;
