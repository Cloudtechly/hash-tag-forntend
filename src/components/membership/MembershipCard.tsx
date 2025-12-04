import React from 'react';

interface MembershipCardProps {
  level: 'Free' | 'Gold' | 'Diamond';
  price: number;
  features: string[];
  isCurrent?: boolean;
}

const cardStyles = {
  Free: {
    bg: 'bg-gray-100',
    text: 'text-gray-500',
    button: 'bg-gray-800 text-white',
    priceText: 'text-gray-800',
  },
  Gold: {
    bg: 'bg-orange-50',
    text: 'text-orange-500',
    button: 'bg-orange-400 text-white',
    priceText: 'text-orange-500',
  },
  Diamond: {
    bg: 'bg-red-50',
    text: 'text-red-500',
    button: 'bg-red-500 text-white',
    priceText: 'text-red-500',
  },
};

const MembershipCard: React.FC<MembershipCardProps> = ({ level, price, features, isCurrent }) => {
  const styles = cardStyles[level];

  return (
    <div className={`${styles.bg} p-6 rounded-2xl shadow-sm`}>
      <h3 className={`text-2xl font-bold ${styles.text}`}>{level} Membership</h3>
      <div className="mt-4 space-y-1">
        {features.map((feature, index) => (
          <p key={index} className="text-sm text-gray-600">{feature}</p>
        ))}
      </div>
      <div className="flex justify-between items-center mt-6">
        <button className={`${isCurrent ? 'bg-orange-400' : styles.button} font-bold py-3 px-8 rounded-full`}>
          {isCurrent ? 'Currently used' : 'Try now'}
        </button>
        <p className={`text-3xl font-bold ${styles.priceText}`}>
          LYD {price} <span className="text-sm font-normal text-gray-500">/Month</span>
        </p>
      </div>
    </div>
  );
};

export default MembershipCard;
