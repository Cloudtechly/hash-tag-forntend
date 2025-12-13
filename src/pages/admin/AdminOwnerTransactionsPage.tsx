import React, { useEffect, useState } from 'react';
import fetchData from '../../Api/FetchApi';
import AdminTable from '../../components/admin/AdminTable';

interface Transaction {
  id: number;
  customer_id: number;
  type: 'credit' | 'debit';
  category: string;
  amount: number;
  currency_code: string;
  description: string;
  created_at: string;
  updated_at: string;
  // Add other fields if available in the actual API response
}

interface Summary {
  total_credit_minor: number;
  total_credit: number;
  total_debit_minor: number;
  total_debit: number;
  net_minor: number;
  net: number;
}

const AdminOwnerTransactionsPage: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination State
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [lastPage, setLastPage] = useState(1);

  const fetchTransactions = async () => {
    setLoading(true);
    setError(null);
    try {
      const url = `admin/owner-transactions?page=${page}&per_page=${perPage}&search=${searchQuery}`;
      const res = await fetchData(url) as any;
      
      let data: Transaction[] = [];
      let meta: any = {};
      
      if (res.data && Array.isArray(res.data)) {
        data = res.data;
        meta = res.meta;
        if (res.summary) {
          setSummary(res.summary);
        }
      }
      
      setTransactions(data);
      if (meta) {
        setTotal(meta.total || 0);
        setLastPage(meta.last_page || 1);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [page, perPage]);

  const handleSearch = () => {
    setPage(1);
    fetchTransactions();
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= lastPage) {
      setPage(newPage);
    }
  };

  const handlePerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPerPage(parseInt(e.target.value));
    setPage(1);
  };

  const columns = [
    { key: 'id', label: 'ID' },
    { 
      key: 'type', 
      label: 'Type',
      render: (row: Transaction) => (
        <span className={`px-2 py-1 rounded text-xs font-medium ${
          row.type === 'credit' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {row.type.toUpperCase()}
        </span>
      )
    },
    { 
      key: 'amount', 
      label: 'Amount',
      render: (row: Transaction) => (
        <span className={`font-medium ${
          row.type === 'credit' ? 'text-green-600' : 'text-red-600'
        }`}>
          {row.type === 'credit' ? '+' : '-'}{row.amount} {row.currency_code}
        </span>
      )
    },
    { 
      key: 'category', 
      label: 'Category',
      render: (row: Transaction) => (
        <span className="capitalize">{row.category.replace(/_/g, ' ')}</span>
      )
    },
    { key: 'description', label: 'Description' },
    { 
      key: 'created_at', 
      label: 'Date',
      render: (row: Transaction) => new Date(row.created_at).toLocaleDateString() + ' ' + new Date(row.created_at).toLocaleTimeString()
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Owner Transactions</h1>
      
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
            <h3 className="text-sm font-medium text-gray-500">Total Credit</h3>
            <p className="text-2xl font-bold text-green-600">{summary.total_credit}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
            <h3 className="text-sm font-medium text-gray-500">Total Debit</h3>
            <p className="text-2xl font-bold text-red-600">{summary.total_debit}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
            <h3 className="text-sm font-medium text-gray-500">Net</h3>
            <p className={`text-2xl font-bold ${summary.net >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
              {summary.net}
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <AdminTable
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleSearch={handleSearch}
        title={transactions}
        total={total}
        columns={columns}
        pagination={{
          page,
          perPage,
          total,
          lastPage,
          onPageChange: handlePageChange,
          onPerPageChange: handlePerPageChange
        }}
        loading={loading}
        error={error}
      />
    </div>
  );
};

export default AdminOwnerTransactionsPage;
