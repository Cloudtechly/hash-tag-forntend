import React, { useEffect, useState } from 'react';
import MembershipHeader from '../components/membership/MembershipHeader';
import MembershipCard from '../components/membership/MembershipCard';
import fetchData from '../Api/FetchApi';

interface Package {
  id: number;
  name: string;
  description: string;
  display_name: string;
  display_description: string;
  prices: any[];
  features: any[];
}

const MembershipPage = () => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPackageId, setCurrentPackageId] = useState<number | null>(null);

  useEffect(() => {
    loadPackages();
    // In a real app, we would also fetch the user's current subscription status here
    // For now, we'll just load the packages
  }, []);

  const loadPackages = async () => {
    try {
      const response = await fetchData('customer/packages');
      // API returns an object with a `data` array (see example). Use response.data when present.
      if (response && (response as any).data) {
        setPackages((response as any).data);
      } else if (response) {
        // fallback: if API returned the array directly
        setPackages(response as any);
      }
    } catch (error) {
      console.error('Error loading packages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (packageId: number, priceId: number) => {
    try {
      const response = await fetchData('customer/me/package/subscribe', 'POST', {
        package_id: packageId,
        package_price_id: priceId
      });

    
        setCurrentPackageId(packageId);
   
    } catch (error) {
      console.error('Error subscribing:', error);
      alert('An error occurred while subscribing');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="pb-24 max-w-7xl mx-auto min-h-screen">
      <MembershipHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                Choose the right plan for you
            </h2>
            <p className="mt-4 text-xl text-gray-600">
                Unlock more features and grow your business with our premium packages.
            </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
            {packages.map((pkg) => (
            <MembershipCard
                key={pkg.id}
                pkg={pkg}
                isCurrent={currentPackageId === pkg.id}
                onSubscribe={handleSubscribe}
            />
            ))}
        </div>
      </div>
    </div>
  );
};

export default MembershipPage;
