import React from 'react';
import fetchData from '../../Api/FetchApi';
import { FiArrowDownLeft, FiArrowUpRight, FiClock } from 'react-icons/fi';

interface Transaction {
  id: number;
  customer_wallet_id: number;
  type: 'debit' | 'credit';
  amount: number;
  reference: string;
  notes: string;
  created_at: string;
  updated_at: string;
  customer_wallet: {
    id: number;
    currency: {
      code: string;
      symbol: string;
    };
  };
}

const TransactionHistory = () => {
  const [transactions, setTransactions] = React.useState<Transaction[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetchData('customer/me/wallet/transactions');
        // Handle both array directly or { data: [...] }
        const txData = Array.isArray(response) ? response : response?.data || [];
        setTransactions(txData);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch transactions');
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTransactionIcon = (type: string) => {
    if (type === 'credit') {
      return <div className="p-2 bg-green-100 rounded-full"><FiArrowDownLeft className="text-green-600" size={20} /></div>;
    }
    return <div className="p-2 bg-red-100 rounded-full"><FiArrowUpRight className="text-red-600" size={20} /></div>;
  };

  return (
    <div className="p-4 mt-4  rounded-t-3xl shadow-sm min-h-[50vh]">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800">Transaction History</h2>
        <FiClock className="text-gray-400" />
      </div>

      {loading && (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        </div>
      )}
      
      {error && <div className="text-red-500 text-center py-4">{error}</div>}
      
      {!loading && transactions.length === 0 && (
        <div className="text-center text-gray-500 py-8">No transactions found</div>
      )}

      <div className="space-y-4">
        {transactions.map((tx) => (
          <div key={tx.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors">
            <div className="flex items-center gap-3">
              {getTransactionIcon(tx.type)}
              <div>
                <p className="font-semibold text-gray-800 capitalize">
                  {tx.reference.replace(/_/g, ' ')}
                </p>
                <p className="text-xs text-gray-500">{formatDate(tx.created_at)}</p>
                {tx.notes && <p className="text-xs text-gray-400 mt-0.5">{tx.notes}</p>}
              </div>
            </div>
            <div className="text-right">
              <p className={`font-bold ${tx.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                {tx.type === 'credit' ? '+' : '-'}{tx.amount.toLocaleString()} {tx.customer_wallet?.currency?.symbol}
              </p>
              <p className="text-xs text-gray-400">{tx.customer_wallet?.currency?.code}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionHistory;
