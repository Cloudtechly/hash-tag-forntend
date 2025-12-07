import React, { useEffect, useState } from 'react';
import fetchData from '../../Api/FetchApi';
import AdminTable from '../../components/admin/AdminTable';

interface Price {
  id: number;
  package_id: number;
  currency_id: string;
  price: number;
  type: string;
  duration_days: number;
  created_at: string;
  updated_at: string;
  type_display: string;
  currency_display: string | null;
  currency: any;
}

interface Feature {
  id: number;
  package_id: number;
  feature_key: string;
  feature_value: string;
  created_at: string;
  updated_at: string;
  feature_display: string;
}

interface Package {
  id: number;
  name: string;
  description: string;
  main_color: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  display_name: string;
  display_description: string;
  prices: Price[];
  features: Feature[];
}

interface Currency {
  id: number;
  code: string;
  name: string;
}

const AdminPackagesPage: React.FC = () => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [lastPage, setLastPage] = useState(1);

  // Add/Edit Modal State
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    main_color: '#000000',
    is_active: true,
    prices: [] as { currency_id: number; price: number; type: string; duration_days: number }[],
    features: [] as { feature_key: string; feature_value: string }[]
  });

  const featurePresets: Record<string, { feature_key: string; feature_value: string }[]> = {
    starter: [
      { feature_key: "ads_monthly_limit", feature_value: "5" },
      { feature_key: "ad_display_days", feature_value: "7" },
      { feature_key: "featured_ads_limit", feature_value: "1" },
      { feature_key: "banner_ads_limit", feature_value: "0" },
      { feature_key: "notifications_monthly_limit", feature_value: "1" },
      { feature_key: "facebook_ads_monthly_limit", feature_value: "0" },
      { feature_key: "support_level", feature_value: "email" }
    ],
    business: [
      { feature_key: "ads_monthly_limit", feature_value: "15" },
      { feature_key: "ad_display_days", feature_value: "15" },
      { feature_key: "featured_ads_limit", feature_value: "3" },
      { feature_key: "banner_ads_limit", feature_value: "1" },
      { feature_key: "notifications_monthly_limit", feature_value: "2" },
      { feature_key: "facebook_ads_monthly_limit", feature_value: "1" },
      { feature_key: "support_level", feature_value: "chat" }
    ],
    premium: [
      { feature_key: "ads_monthly_limit", feature_value: "unlimited" },
      { feature_key: "ad_display_days", feature_value: "30" },
      { feature_key: "featured_ads_limit", feature_value: "unlimited" },
      { feature_key: "banner_ads_limit", feature_value: "3" },
      { feature_key: "notifications_monthly_limit", feature_value: "4" },
      { feature_key: "facebook_ads_monthly_limit", feature_value: "4" },
      { feature_key: "support_level", feature_value: "24_7" }
    ]
  };

  useEffect(() => {
    fetchPackages();
    fetchCurrencies();
    // eslint-disable-next-line
  }, [page, perPage]);

  const fetchPackages = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchData(`admin/packages?per_page=${perPage}&page=${page}`, 'GET') as any;
      let data: Package[] = [];
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
      setPackages(data);
      if (meta) {
        setTotal(meta.total || 0);
        setLastPage(meta.last_page || 1);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch packages');
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrencies = async () => {
    try {
      const res = await fetchData('admin/currencies') as any;
      let data: Currency[] = [];
      if (Array.isArray(res)) {
        data = res;
      } else if (Array.isArray(res.data)) {
        data = res.data;
      } else if (res.body && Array.isArray(res.body.data)) {
        data = res.body.data;
      }
      setCurrencies(data);
    } catch (err) {
      console.error('Failed to fetch currencies', err);
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

  const handleAddPrice = () => {
    setFormData({
      ...formData,
      prices: [...formData.prices, { currency_id: currencies[0]?.id || 0, price: 0, type: 'm', duration_days: 30 }]
    });
  };

  const handleRemovePrice = (index: number) => {
    const newPrices = [...formData.prices];
    newPrices.splice(index, 1);
    setFormData({ ...formData, prices: newPrices });
  };

  const handlePriceChange = (index: number, field: string, value: any) => {
    const newPrices = [...formData.prices];
    (newPrices[index] as any)[field] = value;
    setFormData({ ...formData, prices: newPrices });
  };

  const handleAddFeature = () => {
    setFormData({
      ...formData,
      features: [...formData.features, { feature_key: '', feature_value: '' }]
    });
  };

  const handleRemoveFeature = (index: number) => {
    const newFeatures = [...formData.features];
    newFeatures.splice(index, 1);
    setFormData({ ...formData, features: newFeatures });
  };

  const handleFeatureChange = (index: number, field: string, value: string) => {
    const newFeatures = [...formData.features];
    (newFeatures[index] as any)[field] = value;
    setFormData({ ...formData, features: newFeatures });
  };

  const applyPreset = (presetName: string) => {
    if (featurePresets[presetName]) {
      setFormData({
        ...formData,
        features: featurePresets[presetName]
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetchData('admin/packages', 'POST', formData);
      setAddModalOpen(false);
      setFormData({
        name: '',
        description: '',
        main_color: '#000000',
        is_active: true,
        prices: [],
        features: []
      });
      fetchPackages();
      alert('Package added successfully');
    } catch (error) {
      console.error(error);
      alert('Failed to add package');
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
              <span>Packages</span>
            </nav>
            <h1 className="text-3xl font-bold text-[#101828]">Packages</h1>
            <p className="text-[#667085] text-base">View and manage all packages registered in the system</p>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <AdminTable
            searchQuery={''}
            setSearchQuery={() => {}}
            handleSearch={() => {}}
            setAddModalOpen={setAddModalOpen}
            title={packages}
            columns={[
              { key: 'id', label: 'ID' },
              { key: 'name', label: 'Name' },
              { key: 'display_name', label: 'Display Name' },
              { key: 'description', label: 'Description' },
              { key: 'display_description', label: 'Display Description' },
              { key: 'main_color', label: 'Color', render: row => <span style={{background: row.main_color, color: '#fff', padding: '2px 8px', borderRadius: '6px'}}>{row.main_color}</span> },
              { key: 'is_active', label: 'Active', render: row => row.is_active ? 'Yes' : 'No' },
              { key: 'created_at', label: 'Created At', render: row => new Date(row.created_at).toLocaleDateString() },
              { key: 'updated_at', label: 'Updated At', render: row => new Date(row.updated_at).toLocaleDateString() },
              { key: 'prices', label: 'Prices', render: row => (
                <div className="space-y-1">
                  {row.prices?.map((price: Price) => (
                    <div key={price.id} className="text-xs bg-gray-100 rounded px-2 py-1 mb-1">
                      {price.type_display}: {price.price} ({price.duration_days} days)
                    </div>
                  ))}
                </div>
              ) },
              { key: 'features', label: 'Features', render: row => (
                <div className="space-y-1">
                  {row.features?.map((feature: Feature) => (
                    <div key={feature.id} className="text-xs bg-gray-100 rounded px-2 py-1 mb-1">
                      {feature.feature_display}: {feature.feature_value}
                    </div>
                  ))}
                </div>
              ) },
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

      {/* Add Package Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Add New Package</h2>
              <button onClick={() => setAddModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Main Color</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={formData.main_color}
                      onChange={(e) => setFormData({ ...formData, main_color: e.target.value })}
                      className="h-10 w-20 rounded-md border border-gray-300 p-1"
                    />
                    <input
                      type="text"
                      value={formData.main_color}
                      onChange={(e) => setFormData({ ...formData, main_color: e.target.value })}
                      className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
                    rows={2}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <label htmlFor="is_active" className="text-sm font-medium text-gray-700">Active</label>
                </div>
              </div>

              {/* Prices Section */}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold text-gray-800">Prices</h3>
                  <button
                    type="button"
                    onClick={handleAddPrice}
                    className="text-sm text-primary hover:underline"
                  >
                    + Add Price
                  </button>
                </div>
                <div className="space-y-3">
                  {formData.prices.map((price, index) => (
                    <div key={index} className="flex flex-wrap gap-3 items-end bg-gray-50 p-3 rounded-md border border-gray-200">
                      <div className="w-32">
                        <label className="block text-xs font-medium text-gray-500 mb-1">Currency</label>
                        <select
                          value={price.currency_id}
                          onChange={(e) => handlePriceChange(index, 'currency_id', Number(e.target.value))}
                          className="w-full rounded-md border border-gray-300 px-2 py-1 text-sm"
                        >
                          {currencies.map(c => (
                            <option key={c.id} value={c.id}>{c.code}</option>
                          ))}
                        </select>
                      </div>
                      <div className="w-32">
                        <label className="block text-xs font-medium text-gray-500 mb-1">Price</label>
                        <input
                          type="number"
                          value={price.price}
                          onChange={(e) => handlePriceChange(index, 'price', Number(e.target.value))}
                          className="w-full rounded-md border border-gray-300 px-2 py-1 text-sm"
                        />
                      </div>
                      <div className="w-32">
                        <label className="block text-xs font-medium text-gray-500 mb-1">Type</label>
                        <select
                          value={price.type}
                          onChange={(e) => handlePriceChange(index, 'type', e.target.value)}
                          className="w-full rounded-md border border-gray-300 px-2 py-1 text-sm"
                        >
                          <option value="m">Monthly</option>
                          <option value="y">Yearly</option>
                        </select>
                      </div>
                      <div className="w-32">
                        <label className="block text-xs font-medium text-gray-500 mb-1">Duration (Days)</label>
                        <input
                          type="number"
                          value={price.duration_days}
                          onChange={(e) => handlePriceChange(index, 'duration_days', Number(e.target.value))}
                          className="w-full rounded-md border border-gray-300 px-2 py-1 text-sm"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemovePrice(index)}
                        className="text-red-500 hover:text-red-700 mb-1"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  ))}
                  {formData.prices.length === 0 && (
                    <p className="text-sm text-gray-500 italic">No prices added yet.</p>
                  )}
                </div>
              </div>

              {/* Features Section */}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold text-gray-800">Features</h3>
                  <div className="flex gap-2">
                    <span className="text-sm text-gray-500 self-center">Presets:</span>
                    <button type="button" onClick={() => applyPreset('starter')} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200">Starter</button>
                    <button type="button" onClick={() => applyPreset('business')} className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded hover:bg-purple-200">Business</button>
                    <button type="button" onClick={() => applyPreset('premium')} className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded hover:bg-orange-200">Premium</button>
                  </div>
                </div>
                <div className="space-y-3">
                  {formData.features.map((feature, index) => (
                    <div key={index} className="flex gap-3 items-end bg-gray-50 p-3 rounded-md border border-gray-200">
                      <div className="flex-1">
                        <label className="block text-xs font-medium text-gray-500 mb-1">Feature Key</label>
                        <input
                          type="text"
                          value={feature.feature_key}
                          onChange={(e) => handleFeatureChange(index, 'feature_key', e.target.value)}
                          className="w-full rounded-md border border-gray-300 px-2 py-1 text-sm"
                          placeholder="e.g. ads_monthly_limit"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-xs font-medium text-gray-500 mb-1">Value</label>
                        <input
                          type="text"
                          value={feature.feature_value}
                          onChange={(e) => handleFeatureChange(index, 'feature_value', e.target.value)}
                          className="w-full rounded-md border border-gray-300 px-2 py-1 text-sm"
                          placeholder="e.g. 10"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveFeature(index)}
                        className="text-red-500 hover:text-red-700 mb-1"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={handleAddFeature}
                    className="text-sm text-primary hover:underline mt-2"
                  >
                    + Add Feature
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-opacity-90"
                >
                  Save Package
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPackagesPage;
