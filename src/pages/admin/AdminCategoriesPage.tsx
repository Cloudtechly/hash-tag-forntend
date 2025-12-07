import React, { useEffect, useState } from 'react';
import fetchData from '../../Api/FetchApi';
import AdminTable from '../../components/admin/AdminTable';

interface Category {
  id: number;
  name: string;
  description?: string;
}

interface SpecificationKey {
  id: number;
  name: string;
  type: string;
  category_id: number;
}

const AdminCategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [specModalOpen, setSpecModalOpen] = useState(false);
  const [viewSpecsModalOpen, setViewSpecsModalOpen] = useState(false);
  const [categorySpecs, setCategorySpecs] = useState<SpecificationKey[]>([]);
  const [specsLoading, setSpecsLoading] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [selectedCategoryName, setSelectedCategoryName] = useState<string>("");
  const [editingSpecId, setEditingSpecId] = useState<number | null>(null);
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);
  const [parentId, setParentId] = useState<number | null>(null);
  const [parentName, setParentName] = useState<string | null>(null);
  
  // Pagination State
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [lastPage, setLastPage] = useState(1);
  
  // Spec Form State
  const [specFormData, setSpecFormData] = useState({
    name: '',
    type: 'string'
  });

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    category_id: '',
    order_number: '',
    is_active: true,
    image: null as File | null
  });

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      let url = `admin/categories?page=${page}&per_page=${perPage}`;
      if (parentId) {
        url = `admin/categories/${parentId}/children?page=${page}&per_page=${perPage}`;
      }
      const res = await fetchData(url) as any;
      let data: Category[] = [];
      let meta: any = {};
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
    
      setCategories(data);
      if (meta) {
        setTotal(meta.total || 0);
        setLastPage(meta.last_page || 1);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [page, perPage, parentId]);

  const handleViewChildren = (category: Category) => {
    setParentId(category.id);
    setParentName(category.name);
    setPage(1);
  };

  const handleBackToParents = () => {
    setParentId(null);
    setParentName(null);
    setPage(1);
  };

  const handleAddSpec = (category: Category) => {
    setSelectedCategoryId(category.id);
    setSpecFormData({ name: '', type: 'string' });
    setEditingSpecId(null);
    setSpecModalOpen(true);
  };

  const handleViewSpecs = async (category: Category) => {
    setSelectedCategoryId(category.id);
    setSelectedCategoryName(category.name);
    setViewSpecsModalOpen(true);
    setSpecsLoading(true);
    try {
      const res = await fetchData(`admin/categories/${category.id}/specification-keys`) as any;
      let data: SpecificationKey[] = [];
      if (Array.isArray(res)) {
        data = res;
      } else if (Array.isArray(res.data)) {
        data = res.data;
      } else if (res.body && Array.isArray(res.body.data)) {
        data = res.body.data;
      } else if (Array.isArray(res.body)) {
        data = res.body;
      }
      setCategorySpecs(data);
    } catch (error) {
      console.error(error);
      alert('Failed to fetch specifications');
    } finally {
      setSpecsLoading(false);
    }
  };

  const handleEditSpec = (spec: SpecificationKey) => {
    setSpecFormData({ name: spec.name, type: spec.type });
    setEditingSpecId(spec.id);
    setSpecModalOpen(true);
  };

  const handleDeleteSpec = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this specification?")) return;
    try {
      await fetchData(`admin/specification-keys/${id}`, 'DELETE');
      setCategorySpecs(prev => prev.filter(s => s.id !== id));
      alert('Specification key deleted successfully');
    } catch (error) {
      console.error(error);
      alert('Failed to delete specification key');
    }
  };

  const handleSpecSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingSpecId) {
        await fetchData(`admin/specification-keys/${editingSpecId}`, 'PUT', {
          category_id: selectedCategoryId,
          name: specFormData.name,
          type: specFormData.type
        });
        alert('Specification key updated successfully');
        setCategorySpecs(prev => prev.map(s => s.id === editingSpecId ? { ...s, name: specFormData.name, type: specFormData.type } : s));
      } else {
        if (!selectedCategoryId) return;
        await fetchData('admin/specification-keys', 'POST', {
          category_id: selectedCategoryId,
          name: specFormData.name,
          type: specFormData.type
        });
        alert('Specification key added successfully');
      }
      setSpecModalOpen(false);
      setEditingSpecId(null);
    } catch (error) {
      console.error(error);
      alert('Failed to save specification key');
    }
  };

  const handleSearch = () => {};

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= lastPage) {
      setPage(newPage);
    }
  };

  const handlePerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPerPage(Number(e.target.value));
    setPage(1);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, image: e.target.files![0] }));
    }
  };

  const handleEditCategory = (category: any) => {
    setFormData({
      name: category.name,
      slug: category.slug || '',
      description: category.description || '',
      category_id: category.category_id || '',
      order_number: category.order_number || '',
      is_active: category.is_active === 1,
      image: null
    });
    setEditingCategoryId(category.id);
    setAddModalOpen(true);
  };

  const handleDeleteCategory = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    try {
      await fetchData(`admin/categories/${id}`, 'DELETE');
      setCategories(prev => prev.filter(c => c.id !== id));
      alert('Category deleted successfully');
    } catch (error) {
      console.error(error);
      alert('Failed to delete category');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    data.append('name', formData.name);
    if (formData.slug) data.append('slug', formData.slug);
    if (formData.description) data.append('description', formData.description);
    if (formData.category_id) data.append('category_id', formData.category_id);
    if (formData.order_number) data.append('order_number', formData.order_number);
    data.append('is_active', formData.is_active ? '1' : '0');
    if (formData.image) {
      data.append('image', formData.image);
    }

    try {
      if (editingCategoryId) {
        data.append('_method', 'PUT');
        await fetchData(`admin/categories/${editingCategoryId}`, 'PUT', data);
        alert('Category updated successfully');
      } else {
        await fetchData('admin/categories', 'POST', data);
        alert('Category added successfully');
      }
      setAddModalOpen(false);
      setEditingCategoryId(null);
      setFormData({
        name: '',
        slug: '',
        description: '',
        category_id: '',
        order_number: '',
        is_active: true,
        image: null
      });
      fetchCategories();
    } catch (error) {
      console.error(error);
      alert('Failed to save category');
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
              <span>Categories</span>
            </nav>
            <h1 className="text-3xl font-bold text-[#101828]">Categories</h1>
            <p className="text-[#667085] text-base">View and manage all categories registered in the system</p>
          </div>
          {parentId && (
            <button
              onClick={handleBackToParents}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to All Categories
            </button>
          )}
        </div>
        {parentId && (
            <div className="mb-4 p-4 bg-blue-50 text-blue-700 rounded-md flex items-center gap-2">
                <span className="font-semibold">Viewing Children of:</span> {parentName}
            </div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <AdminTable
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            handleSearch={handleSearch}
            setAddModalOpen={setAddModalOpen}
            title={categories}
            total={total}
            pagination={{
              page,
              perPage,
              total,
              lastPage,
              onPageChange: handlePageChange,
              onPerPageChange: handlePerPageChange,
            }}
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
              key: 'actions', label: 'Actions', render: row => (
                <div className="flex items-center gap-3">
                  <button onClick={() => handleViewChildren(row)} className="text-blue-600 hover:underline text-sm">
                    Children
                  </button>
                  <span className="text-gray-300">|</span>
                  <button onClick={() => handleAddSpec(row)} className="text-green-600 hover:underline text-sm">
                    Add Spec
                  </button>
                  <span className="text-gray-300">|</span>
                  <button onClick={() => handleViewSpecs(row)} className="text-purple-600 hover:underline text-sm">
                    View Specs
                  </button>
                  <span className="text-gray-300">|</span>
                  <button onClick={() => handleEditCategory(row)} className="text-primary hover:underline text-sm">Edit</button>
                  <span className="text-gray-300">|</span>
                  <button onClick={() => handleDeleteCategory(row.id)} className="text-red-500 hover:underline text-sm">Delete</button>
                </div>
              )
            }
          ]}
          />
        </div>
      </div>

      {/* Add Category Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">{editingCategoryId ? 'Edit Category' : 'Add New Category'}</h2>
              <button onClick={() => setAddModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Parent Category</label>
                <select
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="">None</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Order Number</label>
                <input
                  type="number"
                  name="order_number"
                  value={formData.order_number}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-opacity-90"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="is_active"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={handleCheckboxChange}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label htmlFor="is_active" className="text-sm font-medium text-gray-700">Active</label>
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
                  className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-opacity-90"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Specification Key Modal */}
      {specModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">{editingSpecId ? 'Edit Specification Key' : 'Add Specification Key'}</h2>
            <form onSubmit={handleSpecSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  value={specFormData.name}
                  onChange={(e) =>
                    setSpecFormData({
                      ...specFormData,
                      name: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Type</label>
                <select
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  value={specFormData.type}
                  onChange={(e) => setSpecFormData({ ...specFormData, type: e.target.value })}
                >
                  <option value="text">Text</option>
                  <option value="select">Select</option>
                  <option value="checkbox">Checkbox</option>
                  <option value="number">Number</option>
                </select>
              </div>

              <div className="flex justify-end space-x-2 mt-4">
                <button
                  type="button"
                  onClick={() => setSpecModalOpen(false)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Specifications Modal */}
      {viewSpecsModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Specifications for {selectedCategoryName}</h2>
            {specsLoading ? (
              <div className="flex items-center justify-center py-4">
                <svg className="animate-spin h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4zm16 0a8 8 0 01-8 8v-8h8z"></path>
                </svg>
              </div>
            ) : (
              <div>
                {categorySpecs.length === 0 ? (
                  <p className="text-center text-gray-500 py-4">No specifications found for this category.</p>
                ) : (
                  <div>
                    {categorySpecs.map(spec => (
                      <div key={spec.id} className="flex justify-between items-center py-2 border-b">
                        <div>
                          <div className="text-sm font-medium text-gray-800">{spec.name}</div>
                          <div className="text-xs text-gray-500">{spec.type}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => handleEditSpec(spec)} className="text-primary hover:underline text-sm">Edit</button>
                          <button onClick={() => handleDeleteSpec(spec.id)} className="text-red-500 hover:underline text-sm">Delete</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setViewSpecsModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategoriesPage;
