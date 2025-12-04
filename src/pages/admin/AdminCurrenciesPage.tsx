import React, { useEffect, useState } from 'react';
import fetchData from '../../Api/FetchApi';
import AdminTable from '../../components/admin/AdminTable';

interface Currency {
  id: number;
  code: string;
  name: string;
  symbol: string;
  is_active: boolean;
  is_default: boolean;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

const AdminCurrenciesPage: React.FC = () => {
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [lastPage, setLastPage] = useState(1);

  // Add/Edit Modal State
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    symbol: '',
    is_active: true,
    is_default: false
  });
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);

  useEffect(() => {
    fetchCurrencies();
    // eslint-disable-next-line
  }, [page, perPage]);

  const fetchCurrencies = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchData(`admin/currencies?per_page=${perPage}&page=${page}`, 'GET') as any;
      let data: Currency[] = [];
      let meta;
      if (Array.isArray(res)) {
        data = res;
      } else if (Array.isArray(res.data)) {
        data = res.data;
        meta = res.meta;
      } else if (res.body && Array.isArray(res.body.data)) {
        data = res.body.data;
        meta = res.body.meta;
      } else if (Array.isArray(res.body)) {
        data = res.body;
      }
      setCurrencies(data);
      if (meta) {
        setTotal(meta.total || 0);
        setLastPage(meta.last_page || 1);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch currencies');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= lastPage) {
      setPage(newPage);
    }
  };
  const handlePerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPerPage(Number(e.target.value));
    setPage(1);
  };

  const handleAddClick = () => {
    setEditingId(null);
    setFormData({
      code: '',
      name: '',
      symbol: '',
      is_active: true,
      is_default: false
    });
    setAddModalOpen(true);
  };

  const handleEditClick = (currency: Currency) => {
    setEditingId(currency.id);
    setFormData({
      code: currency.code,
      name: currency.name,
      symbol: currency.symbol,
      is_active: currency.is_active,
      is_default: currency.is_default
    });
    setAddModalOpen(true);
  };

  const handleSaveCurrency = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddLoading(true);
    setAddError(null);
    try {
      if (editingId) {
        await fetchData(`admin/currencies/${editingId}`, 'PUT', formData);
      } else {
        await fetchData('admin/currencies', 'POST', formData);
      }
      setAddModalOpen(false);
      fetchCurrencies(); // Refresh list
    } catch (err: any) {
      setAddError(err.message || 'Failed to save currency');
    } finally {
      setAddLoading(false);
    }
  };

  const handleDeleteClick = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this currency?')) return;
    
    try {
      await fetchData(`admin/currencies/${id}`, 'DELETE');
      fetchCurrencies();
    } catch (err: any) {
      alert(err.message || 'Failed to delete currency');
    }
  };

  return (
    <div className="min-h-screen p-0">
      <div className="container mx-auto px-8 pt-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div className="space-y-1">
            <nav className="flex items-center gap-2 text-sm text-[#98A2B3]">
              <span>Home</span>
              <span className="mx-1">/</span>
              <span>Currencies</span>
            </nav>
            <h1 className="text-3xl font-bold text-[#101828]">Currencies</h1>
            <p className="text-[#667085] text-base">View and manage all currencies in the system</p>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <AdminTable
            searchQuery={''}
            setSearchQuery={() => {}}
            handleSearch={() => {}}
            setAddModalOpen={(val) => { if (val === true) handleAddClick(); else setAddModalOpen(val as boolean); }}
            title={currencies}
            columns={[
              { key: 'id', label: 'ID' },
              { key: 'code', label: 'Code' },
              { key: 'name', label: 'Name' },
              { key: 'symbol', label: 'Symbol' },
              { key: 'is_active', label: 'Active', render: (row: Currency) => row.is_active ? 'Yes' : 'No' },
              { key: 'is_default', label: 'Default', render: (row: Currency) => row.is_default ? 'Yes' : 'No' },
              { key: 'created_at', label: 'Created At', render: (row: Currency) => new Date(row.created_at).toLocaleDateString() },
              { key: 'updated_at', label: 'Updated At', render: (row: Currency) => new Date(row.updated_at).toLocaleDateString() },
              {
                key: 'actions',
                label: 'Actions',
                render: (row: Currency) => (
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleEditClick(row)}
                      className="text-primary hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(row.id)}
                      className="text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                )
              }
            ]}
            pagination={{
              page,
              perPage,
              total,
              lastPage,
              onPageChange: handlePageChange,
              onPerPageChange: handlePerPageChange,
            }}
            loading={loading}
            error={error}
          />
        </div>
      </div>

      {/* Add/Edit Currency Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">{editingId ? 'Edit Currency' : 'Add New Currency'}</h2>
              <button onClick={() => setAddModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {addError && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
                {addError}
              </div>
            )}

            <form onSubmit={handleSaveCurrency}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Code</label>
                  <input
                    type="text"
                    required
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="e.g. USD"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="e.g. US Dollar"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Symbol</label>
                  <input
                    type="text"
                    required
                    value={formData.symbol}
                    onChange={(e) => setFormData({ ...formData, symbol: e.target.value })}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="e.g. $"
                  />
                </div>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="text-sm text-gray-700">Active</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_default}
                      onChange={(e) => setFormData({ ...formData, is_default: e.target.checked })}
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="text-sm text-gray-700">Default</span>
                  </label>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addLoading}
                  className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-opacity-90 disabled:opacity-50"
                >
                  {addLoading ? 'Saving...' : (editingId ? 'Update Currency' : 'Save Currency')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCurrenciesPage;
