import React, { useEffect, useState } from 'react';
import fetchData from '../../Api/FetchApi';
import AdminTable from '../../components/admin/AdminTable';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

interface City {
  id: number;
  name: string;
  country_id: number;
  country?: {
    id: number;
    name: string;
  };
  created_at: string;
  updated_at: string;
}

interface Country {
  id: number;
  name: string;
}

const AdminCitiesPage: React.FC = () => {
  const [cities, setCities] = useState<City[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editingCityId, setEditingCityId] = useState<number | null>(null);

  // Pagination State
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [lastPage, setLastPage] = useState(1);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    country_id: ''
  });

  const fetchCities = async () => {
    setLoading(true);
    setError(null);
    try {
      const url = `admin/cities?page=${page}&per_page=${perPage}`;
      const res = await fetchData(url) as any;
      let data: City[] = [];
      let meta: any = {};
      if (res.data && Array.isArray(res.data)) {
        data = res.data;
        meta = res.meta;
      }
      setCities(data);
      if (meta) {
        setTotal(meta.total || 0);
        setLastPage(meta.last_page || 1);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch cities');
    } finally {
      setLoading(false);
    }
  };

  const fetchCountries = async () => {
    try {
      // Fetching all countries for the dropdown. 
      // Assuming a large per_page to get all, or a specific list endpoint if available.
      const res = await fetchData('admin/countries?per_page=1000') as any;
      if (res.data && Array.isArray(res.data)) {
        setCountries(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch countries', err);
    }
  };

  useEffect(() => {
    fetchCities();
    fetchCountries();
  }, [page, perPage]);

  const handleSearch = () => {
    fetchCities();
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
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        name: formData.name,
        country_id: parseInt(formData.country_id)
      };

      if (editingCityId) {
        await fetchData(`admin/cities/${editingCityId}`, 'PUT', payload);
      } else {
        await fetchData('admin/cities', 'POST', payload);
      }
      setAddModalOpen(false);
      setEditingCityId(null);
      setFormData({ name: '', country_id: '' });
      fetchCities();
    } catch (err: any) {
      setError(err.message || 'Failed to save city');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (city: City) => {
    setEditingCityId(city.id);
    setFormData({
      name: city.name,
      country_id: city.country_id.toString()
    });
    setAddModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this city?')) {
      setLoading(true);
      try {
        await fetchData(`admin/cities/${id}`, 'DELETE');
        fetchCities();
      } catch (err: any) {
        setError(err.message || 'Failed to delete city');
      } finally {
        setLoading(false);
      }
    }
  };

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { 
      key: 'country', 
      label: 'Country',
      render: (row: City) => row.country?.name || row.country_id
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row: City) => (
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
      <h1 className="text-2xl font-bold mb-6">Cities Management</h1>
      
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
          setEditingCityId(null);
          setFormData({ name: '', country_id: '' });
          setAddModalOpen(true);
        }}
        title={cities}
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
            <h2 className="text-xl font-bold mb-4">{editingCityId ? 'Edit City' : 'Add New City'}</h2>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                <select
                  name="country_id"
                  value={formData.country_id}
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2"
                  required
                >
                  <option value="">Select Country</option>
                  {countries.map(country => (
                    <option key={country.id} value={country.id}>
                      {country.name}
                    </option>
                  ))}
                </select>
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

export default AdminCitiesPage;
