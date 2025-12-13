import React, { useState } from 'react';
import { FiCheck } from 'react-icons/fi';

interface Price {
  id: number;
  amount: number;
  type: string;
  type_label: string;
  duration_days: number;
  currency: {
    code: string;
    name: string;
    symbol: string;
  } | null;
}

interface Feature {
  id: number;
  key: string;
  value: string;
  label: string;
}

interface Package {
  id: number;
  name: string;
  description: string;
  display_name: string;
  display_description: string;
  prices: Price[];
  features: Feature[];
}

interface MembershipCardProps {
  pkg: Package;
  isCurrent?: boolean;
  onSubscribe: (packageId: number, priceId: number) => void;
}

const MembershipCard: React.FC<MembershipCardProps> = ({ pkg, isCurrent, onSubscribe }) => {
  // price id may be undefined if no prices provided; allow undefined in state
  const [selectedPriceId, setSelectedPriceId] = useState<number | undefined>(
    pkg.prices && pkg.prices.length > 0 ? pkg.prices[0].id : undefined
  );
  const [error, setError] = useState<string | null>(null);

  const getCardTheme = (name: string) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('free') || lowerName.includes('starter')) {
      return {
        borderColor: 'border-gray-200',
        headerBg: 'bg-gray-50',
        accentColor: 'text-gray-700',
        buttonBg: 'bg-gray-900 hover:bg-gray-800',
        iconColor: 'text-gray-400'
      };
    } else if (lowerName.includes('gold') || lowerName.includes('business')) {
      return {
        borderColor: 'border-orange-200',
        headerBg: 'bg-orange-50',
        accentColor: 'text-orange-600',
        buttonBg: 'bg-orange-500 hover:bg-orange-600',
        iconColor: 'text-orange-500'
      };
    } else {
      return {
        borderColor: 'border-purple-200',
        headerBg: 'bg-purple-50',
        accentColor: 'text-purple-600',
        buttonBg: 'bg-purple-600 hover:bg-purple-700',
        iconColor: 'text-purple-500'
      };
    }
  };

  const theme = getCardTheme(pkg.name);
  const selectedPrice = pkg.prices.find(p => p.id === Number(selectedPriceId));

  return (
    <div className={`relative flex flex-col bg-white rounded-2xl border-2 ${theme.borderColor} shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1`}>
      {/* Header */}
      <div className={`p-6 ${theme.headerBg} border-b ${theme.borderColor}`}>
        <h3 className={`text-2xl font-bold ${theme.accentColor}`}>{pkg.display_name}</h3>
        <p className="text-sm text-gray-600 mt-2 min-h-[40px]">{pkg.display_description}</p>
        
        {selectedPrice ? (
            <div className="mt-4 flex items-baseline">
                <span className={`text-4xl font-extrabold ${theme.accentColor}`}>
                    {selectedPrice.currency?.symbol || ''}{selectedPrice.amount}
                </span>
                <span className="ml-1 text-gray-500 font-medium">/{selectedPrice.type_label}</span>
            </div>
        ) : (
            <div className="mt-4 flex items-baseline">
                 <span className="text-2xl font-bold text-gray-400">--</span>
            </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col">
        
        {/* Plan Selection */}
        <div className="mb-6">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Billing Cycle
            </label>
            <div className="relative">
                <select
                className="block w-full pl-3 pr-10 py-2 text-sm border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 rounded-lg bg-gray-50 border transition-shadow"
                value={selectedPriceId ?? ''}
                onChange={(e) => setSelectedPriceId(e.target.value ? Number(e.target.value) : undefined)}
                >
                {pkg.prices.map(price => (
                    <option key={price.id} value={price.id}>
                    {price.type_label} ({price.amount} {price.currency?.code || 'LYD'})
                    </option>
                ))}
                </select>
            </div>
        </div>

        {/* Features */}
        <div className="flex-1 space-y-3 mb-8">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                What's included
            </p>
            {pkg.features.map((feature) => (
            <div key={feature.id} className="flex items-start">
                <FiCheck className={`flex-shrink-0 h-5 w-5 ${theme.iconColor} mt-0.5`} />
                <div className="ml-3 text-sm text-gray-700">
                    <span className="font-medium text-gray-900">{feature.label}:</span> {feature.value}
                </div>
            </div>
            ))}
        </div>

        {/* Action Button */}
        <button
          onClick={() => {
            if (!selectedPriceId) {
              setError('Please select a plan before subscribing.');
              return;
            }
            setError(null);
            onSubscribe(pkg.id, selectedPriceId);
          }}
          disabled={isCurrent || !selectedPriceId}
          className={`w-full py-3 px-4 rounded-xl font-bold text-white shadow-md transition-all transform active:scale-95 
            ${isCurrent 
                ? 'bg-green-500 cursor-default' 
                : !selectedPriceId 
                    ? 'bg-gray-300 cursor-not-allowed' 
                    : theme.buttonBg
            }`}
        >
          {isCurrent ? 'Current Plan' : 'Subscribe Now'}
        </button>
        {error && (
          <div className="mt-2 text-sm text-red-500 text-center">{error}</div>
        )}
      </div>
    </div>
  );
};

export default MembershipCard;
