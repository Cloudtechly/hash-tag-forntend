import React from 'react';
import ProfileHeader from '../components/profile/ProfileHeader';
import MyListings from '../components/profile/MyListings';
import Overview from '../components/profile/Overview';
import Performance from '../components/profile/Performance';
import TopViewProducts from '../components/profile/TopViewProducts';
import CustomerEngagement from '../components/profile/CustomerEngagement';
import BottomNav from '../components/home/BottomNav';


const ProfilePage = () => {
  return (
    <div className="bg-gray-100 min-h-screen pb-24">
      <ProfileHeader />
      <div className="p-4">
        <MyListings />
        <Overview />
        <Performance />
        <TopViewProducts />
        <CustomerEngagement />
      </div>
      <BottomNav />
    </div>
  );
};

export default ProfilePage;
