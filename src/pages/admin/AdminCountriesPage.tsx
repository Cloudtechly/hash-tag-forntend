import React, { useEffect, useState } from 'react';
import fetchData from '../../Api/FetchApi';
import AdminTable from '../../components/admin/AdminTable';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

interface Country {
  id: number;
  name: string;
  code: string;
  phone_code: string;
  is_active: number;
  created_at: string;
  updated_at: string;
}

const AdminCountriesPage: React.FC = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editingCountryId, setEditingCountryId] = useState<number | null>(null);

  // Pagination State
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [lastPage, setLastPage] = useState(1);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    phone_code: '',
    is_active: true
  });

  const fetchCountries = async () => {
    setLoading(true);
    setError(null);
    try {
      const url = `admin/countries?page=${page}&per_page=${perPage}`;
      const res = await fetchData(url) as any;
      let data: Country[] = [];
      let meta: any = {};
      if (res.data && Array.isArray(res.data)) {
        data = res.data;
        meta = res.meta;
      }
      setCountries(data);
      if (meta) {
        setTotal(meta.total || 0);
        setLastPage(meta.last_page || 1);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch countries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCountries();
  }, [page, perPage]);

  const handleSearch = () => {
    // Implement search logic if API supports it, or filter locally
    // For now, just refetching
    fetchCountries();
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleToggleActive = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      is_active: e.target.checked
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formData,
        is_active: formData.is_active ? 1 : 0
      };

      if (editingCountryId) {
        await fetchData(`admin/countries/${editingCountryId}`, 'PUT', payload);
      } else {
        await fetchData('admin/countries', 'POST', payload);
      }
      setAddModalOpen(false);
      setEditingCountryId(null);
      setFormData({ name: '', code: '', phone_code: '', is_active: true });
      fetchCountries();
    } catch (err: any) {
      setError(err.message || 'Failed to save country');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (country: Country) => {
    setEditingCountryId(country.id);
    setFormData({
      name: country.name,
      code: country.code,
      phone_code: country.phone_code,
      is_active: country.is_active === 1
    });
    setAddModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this country?')) {
      setLoading(true);
      try {
        await fetchData(`admin/countries/${id}`, 'DELETE');
        fetchCountries();
      } catch (err: any) {
        setError(err.message || 'Failed to delete country');
      } finally {
        setLoading(false);
      }
    }
  };

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'code', label: 'Code' },
    { key: 'phone_code', label: 'Phone Code' },
    {
      key: 'is_active',
      label: 'Status',
      render: (row: Country) => (
        <span className={`px-2 py-1 rounded text-xs ${row.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {row.is_active ? 'Active' : 'Inactive'}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row: Country) => (
        <div className="flex gap-2">
          <button onClick={() => handleEdit(row)} className="text-blue-600 hover:text-blue-800">
            <PencilIcon className="h-5 w-5" />
          </button>
          <button onClick={() => handleDelete(row.id)} className="text-red-600 hover:text-red-800">
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Countries Management</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <AdminTable
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleSearch={handleSearch}
        setAddModalOpen={() => {
          setEditingCountryId(null);
          setFormData({ name: '', code: '', phone_code: '', is_active: true });
          setAddModalOpen(true);
        }}
        title={countries}
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

      {addModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">{editingCountryId ? 'Edit Country' : 'Add New Country'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Code</label>
                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Code</label>
                <input
                  type="text"
                  name="phone_code"
                  value={formData.phone_code}
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleToggleActive}
                    className="mr-2"
                  />
                  <span className="text-sm font-medium text-gray-700">Active</span>
                </label>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCountriesPage;
