import React from 'react';
import { FiArrowLeft, FiEye, FiStar, FiPlus, FiCreditCard } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import fetchData from '../../Api/FetchApi';

const WalletHeader = () => {
        const navigate = useNavigate();
  return (
    <div className="flex justify-between items-center p-6 bg-white shadow-sm sticky top-0 z-10">
      <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
        <FiArrowLeft size={24} onClick={()=>{
            navigate(-1);
        }} />
      </button>
      <h1 className="text-xl font-bold text-gray-800">My Wallet</h1>
      <div className="w-10"></div>
    </div>
  );
};

const Balance = () => {
  const [data, setData] = React.useState<{
    wallets: Array<{ id: number; currency: string; balance: number }>;
    subscribed_package: any;
  } | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    setLoading(true);
    setError(null);
    const fetchWalletData = async () => {
      try {
        const response = await fetchData('customer/me/wallet');
        setData({
            wallets: response.data?.wallets || [],
            subscribed_package: response.subscribed_package
        });
      } catch (err: any) {
        setError(err.message || 'Failed to fetch wallet info');
      } finally {
        setLoading(false);
      }
    };
    fetchWalletData();
  }, []);

  if (loading) return (
    <div className="p-6 bg-white animate-pulse">
        <div className="h-32 bg-gray-200 rounded-2xl mb-4"></div>
    </div>
  );
  
  if (error) return <div className="p-6 bg-white text-red-500 text-center">{error}</div>;
  if (!data) return null;

  return (
    <div className="p-6 bg-white">
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-6 text-white shadow-xl mb-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-10 rounded-full blur-xl"></div>
        <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-20 h-20 bg-orange-500 opacity-20 rounded-full blur-xl"></div>
        
        <h2 className="text-gray-400 text-sm font-medium mb-1">Total Balance</h2>
        
        {data.wallets.length > 0 ? (
          data.wallets.map((wallet) => (
            <div key={wallet.id} className="mb-4 last:mb-0">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold tracking-tight">{wallet.balance?.toLocaleString()}</span>
                <span className="text-xl text-gray-400 font-medium">{wallet.currency}</span>
              </div>
            </div>
          ))
        ) : (
           <div className="text-2xl font-bold text-gray-300">0.00</div>
        )}

        <div className="mt-6 pt-4 border-t border-gray-700 flex justify-between items-center">
            <div className="flex items-center gap-2">
                <div className="p-1.5 bg-orange-500/20 rounded-lg">
                    <FiStar className="text-orange-500" size={16} />
                </div>
                <div>
                    <p className="text-xs text-gray-400">Current Plan</p>
                    <p className="text-sm font-bold text-white capitalize">
                        {data.subscribed_package?.name || data.subscribed_package || 'Free Plan'}
                    </p>
                </div>
            </div>
            <button className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-colors">
                Upgrade
            </button>
        </div>
      </div>
    </div>
  );
};


const WalletActions = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = React.useState(false);
  const [currencies, setCurrencies] = React.useState<Array<{ id: number; name: string }>>([]);
  const [selectedCurrency, setSelectedCurrency] = React.useState<number | null>(null);
  const [amount, setAmount] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (showModal) {
      // fetchData('customer/currencies')
      //   .then((data) => {
      //     setCurrencies(data?.data || data);
      //   })
      //   .catch((err: any) => setError(err.message || 'Failed to fetch currencies'));
      setCurrencies([{ id: 1, name: 'LYD' }, { id: 2, name: 'USD' }]);
    }
  }, [showModal]);

  const handleAddFunds = async () => {
    setLoading(true);
    setError(null);
    try {
      await fetchData('customer/me/wallet/add-funds', 'POST', {
        currency_id: selectedCurrency,
        amount: Number(amount),
      });
      setShowModal(false);
      setAmount('');
      setSelectedCurrency(null);
      window.location.reload();
    } catch (err: any) {
      setError(err.message || 'Failed to add funds');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-6 pb-4 bg-white">
      <div className="grid grid-cols-2 gap-4">
        <button 
            onClick={() => setShowModal(true)}
            className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors group"
        >
            <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <FiPlus className="text-gray-900" size={24} />
            </div>
            <span className="font-semibold text-gray-900">Top Up</span>
        </button>
        
        <button 
            onClick={() => navigate('/membership')}
            className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors group"
        >
            <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <FiCreditCard className="text-gray-900" size={24} />
            </div>
            <span className="font-semibold text-gray-900">Membership</span>
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-3xl w-full max-w-sm shadow-2xl transform transition-all">
            <h3 className="text-xl font-bold mb-6 text-center">Top Up Wallet</h3>
            
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Select Currency</label>
                    <div className="grid grid-cols-2 gap-2">
                        {currencies.map((c) => (
                        <button
                            key={c.id}
                            onClick={() => setSelectedCurrency(c.id)}
                            className={`p-3 rounded-xl border-2 font-medium transition-all ${
                            selectedCurrency === c.id 
                                ? 'border-gray-900 bg-gray-900 text-white' 
                                : 'border-gray-200 text-gray-600 hover:border-gray-300'
                            }`}
                        >
                            {c.name}
                        </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                    <input
                        type="number"
                        className="w-full p-3 bg-gray-50 border-none rounded-xl text-lg font-semibold focus:ring-2 focus:ring-gray-900"
                        placeholder="0.00"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                    />
                </div>
            </div>

            {error && <p className="text-red-500 text-sm mt-4 text-center bg-red-50 p-2 rounded-lg">{error}</p>}
            
            <div className="flex gap-3 mt-8">
              <button 
                onClick={() => setShowModal(false)}
                className="flex-1 py-3 px-4 rounded-xl font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleAddFunds}
                disabled={loading || !selectedCurrency || !amount}
                className="flex-1 py-3 px-4 rounded-xl font-bold text-white bg-gray-900 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-gray-900/20"
              >
                {loading ? 'Processing...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export { WalletHeader, Balance, WalletActions };
