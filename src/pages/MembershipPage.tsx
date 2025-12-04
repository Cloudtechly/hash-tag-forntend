import React from 'react';
import MembershipHeader from '../components/membership/MembershipHeader';
import MembershipCard from '../components/membership/MembershipCard';

const MembershipPage = () => {
  const memberships = [
    {
      level: 'Free',
      price: 0,
      features: ['Check products and make offers to sellers'],
    },
    {
      level: 'Gold',
      price: 150,
      features: [
        'Check products and make offers to sellers',
        'Add products to sell them',
        'track your performance with our analytics system',
      ],
      isCurrent: true,
    },
    {
      level: 'Diamond',
      price: 300,
      features: [
        'Check products and make offers to sellers',
        'Add products to sell them',
        'track your performance with our analytics system',
        'ads system to support your products',
        'push products to perform better, Start Auctions',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <MembershipHeader />
      <div className="p-4 space-y-6">
        {memberships.map((membership) => (
          <MembershipCard
            key={membership.level}
            level={membership.level as 'Free' | 'Gold' | 'Diamond'}
            price={membership.price}
            features={membership.features}
            isCurrent={membership.isCurrent}
          />
        ))}
      </div>
    </div>
  );
};

export default MembershipPage;
