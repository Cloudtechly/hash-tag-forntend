import React, { useEffect, useState } from 'react';
import fetchData from '../../Api/FetchApi';
import AdminTable from '../../components/admin/AdminTable';

interface Category {
  id: number;
  name: string;
  description?: string;
}

const AdminCategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetchData('admin/categories?page=1&per_page=10') as any;
        let data: Category[] = [];
        if (Array.isArray(res)) {
          data = res;
        } else if (Array.isArray(res.data)) {
          data = res.data;
        } else if (res.body && Array.isArray(res.body.data)) {
          data = res.body.data;
        } else if (Array.isArray(res.body)) {
          data = res.body;
        }
        setCategories(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch categories');
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const [searchQuery, setSearchQuery] = useState("");
  const [addModalOpen, setAddModalOpen] = useState(false);
  const handleSearch = () => {};

  return (
    <div className="min-h-screen p-0">
      <div className="container mx-auto px-8 pt-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div className="space-y-1">
            <nav className="flex items-center gap-2 text-sm text-[#98A2B3]">
              <span>Home</span>
              <span className="mx-1">/</span>
              <span>Categories</span>
            </nav>
            <h1 className="text-3xl font-bold text-[#101828]">Categories</h1>
            <p className="text-[#667085] text-base">View and manage all categories registered in the system</p>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <AdminTable
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            handleSearch={handleSearch}
            setAddModalOpen={setAddModalOpen}
            title={categories}
            columns={[{
              key: 'id', label: 'ID'
            }, {
              key: 'name', label: 'Name'
            }, {
              key: 'description', label: 'Description', render: row => row.description || '-'
            },{
              key: 'slug', label: 'Slug'
            },
            {
              key: 'actions', label: 'Actions', render: row => <div>Edit | Delete</div>
            }
          ]}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminCategoriesPage;
