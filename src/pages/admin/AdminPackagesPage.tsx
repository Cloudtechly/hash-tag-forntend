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

const AdminPackagesPage: React.FC = () => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [lastPage, setLastPage] = useState(1);

  useEffect(() => {
    fetchPackages();
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

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= lastPage) {
      setPage(newPage);
    }
  };

  const handlePerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPerPage(Number(e.target.value));
    setPage(1);
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
            // setAddModalOpen not provided to disable Add New button
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
    </div>
  );
};

export default AdminPackagesPage;
