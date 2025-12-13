import React, { useState, useRef, useEffect } from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  FunnelIcon,
  PrinterIcon,
  ArrowDownTrayIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  EllipsisVerticalIcon,
  ArrowDownIcon,
  ArrowPathIcon,
  EyeIcon,
  PencilIcon,
  CheckCircleIcon,
  ArrowTrendingUpIcon,
  TrashIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import fetchData from "../../Api/FetchApi";
import AdminTable from "../../components/admin/AdminTable";

interface Category {
  id: number;
  name: string;
}

interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  status: string;
  is_special: boolean;
  special_starts_at: string | null;
  special_ends_at: string | null;
  category: Category;
  created_at: string;
  images?: Array<{
    id: number;
    url: string;
    purpose: string;
    type: string;
  }>;
  specifications?: Array<{
    value: string;
    specification_key: {
      id: number;
      name: string;
      type: string;
    };
    specification_option: any;
  }>;
}




const statuses = [
  'pending',
  'approved',
  'rejected',
  
];

interface ActionMenuProps {
  productId: number;
}


// Collapsible Sidebar as a separate component
function CollapsibleSidebar({ sidebarOpen, setSidebarOpen }: { sidebarOpen: boolean, setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>> }) {
  return (
    <aside className="lg:col-span-1 bg-white rounded-xl border border-[#EAECF0] h-fit transition-all duration-300" style={{minWidth: sidebarOpen ? undefined : 0, width: sidebarOpen ? undefined : 0, padding: sidebarOpen ? '1.5rem' : '0', overflow: 'hidden'}}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-semibold tracking-tight text-lg text-[#101828]">Filters</h2>
        <button
          className="rounded-full p-1 hover:bg-[#F2F4F7] focus:outline-none border border-[#EAECF0]"
          onClick={() => setSidebarOpen((v) => !v)}
          aria-label={sidebarOpen ? 'Close filters' : 'Open filters'}
        >
          <span className={sidebarOpen ? 'rotate-180' : ''} style={{display:'inline-block', transition:'transform 0.2s'}}>
            <ChevronRightIcon className="w-5 h-5 text-[#1976D2]" />
          </span>
        </button>
      </div>
      {sidebarOpen && (
        <>
          <div className="space-y-6">
            <div>
              <label htmlFor="productName" className="text-sm font-medium text-[#344054] block mb-2">Product Name</label>
              <input type="text" id="productName" placeholder="Search by product name..." className="flex h-9 w-full rounded-md border border-[#D0D5DD] bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-[#98A2B3] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#1976D2] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm text-left" />
            </div>
            <div>
              <label className="text-sm font-medium text-[#344054] block mb-2">Product Status</label>
              <div className="space-y-2">
                {statuses.map((status) => (
                  <div key={status} className="flex items-center gap-2">
                    <input id={`status-${status}`} type="checkbox" className="h-4 w-4 rounded-sm border border-[#1976D2] shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#1976D2]" />
                    <label htmlFor={`status-${status}`} className="text-sm font-normal text-[#344054] cursor-pointer">{status.charAt(0).toUpperCase() + status.slice(1)}</label>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-[#344054] block mb-2">Created Date Range</label>
              <div className="space-y-2">
                <div>
                  <label htmlFor="dateFrom" className="font-medium text-xs text-[#98A2B3] block mb-1">From</label>
                  <input type="date" id="dateFrom" className="flex h-9 w-full rounded-md border border-[#D0D5DD] bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-[#98A2B3] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#1976D2] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm" placeholder="mm/dd/yyyy" />
                </div>
                <div>
                  <label htmlFor="dateTo" className="font-medium text-xs text-[#98A2B3] block mb-1">To</label>
                  <input type="date" id="dateTo" className="flex h-9 w-full rounded-md border border-[#D0D5DD] bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-[#98A2B3] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#1976D2] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm" placeholder="mm/dd/yyyy" />
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-2 pt-4 border-t border-[#EAECF0] mt-6">
            <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#1976D2] disabled:pointer-events-none disabled:opacity-50 bg-[#1976D2] text-white shadow hover:bg-[#1565C0] h-9 px-4 py-2 w-full">
              <FunnelIcon className="w-4 h-4 mr-2" />Apply Product Filters
            </button>
            <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#1976D2] disabled:pointer-events-none disabled:opacity-50 border border-[#D0D5DD] bg-transparent shadow-sm hover:bg-[#F2F4F7] hover:text-[#1976D2] h-9 px-4 py-2 w-full">
              <ArrowPathIcon className="w-4 h-4 mr-2" />Reset
            </button>
          </div>
        </>
      )}
    </aside>
  );
}
export default function AdminProductsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);
  
  // Pagination & Search State
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [lastPage, setLastPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    is_special: false,
    special_starts_at: '',
    special_ends_at: ''
  });

  const handleViewProduct = async (productId: number) => {
    try {
      const res = await fetchData(`admin/products/${productId}`);
      // API response: { data: { ...product } }
      const productData = res.data || res;
      setViewingProduct(productData);
      setViewModalOpen(true);
    } catch (error) {
      console.error("Failed to fetch product details", error);
      alert("Failed to fetch product details");
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price.toString(),
      is_special: product.is_special,
      special_starts_at: product.special_starts_at || '',
      special_ends_at: product.special_ends_at || ''
    });
    setEditModalOpen(true);
  };

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    try {
      await fetchData(`admin/products/${editingProduct.id}`, 'PUT', {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        is_special: formData.is_special,
        special_starts_at: formData.special_starts_at,
        special_ends_at: formData.special_ends_at
      });
      alert('Product updated successfully');
      setEditModalOpen(false);
      fetchProducts();
    } catch (error) {
      console.error(error);
      alert('Failed to update product');
    }
  };

const ActionMenu = ({ productId }: ActionMenuProps) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);
  return (
    <div className="relative" ref={menuRef}>
      <button
        className="flex items-center justify-center w-8 h-8 rounded hover:bg-gray-100"
        onClick={() => setOpen((v) => !v)}
        tabIndex={0}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <EllipsisVerticalIcon className="w-5 h-5 text-gray-500" />
      </button>
      {open && (
        <div className="absolute right-0 top-10 z-20 min-w-[180px] bg-white rounded-xl shadow-lg border border-[#EAECF0] py-2 px-0 text-left animate-fade-in" style={{boxShadow:'0 4px 24px 0 rgba(16,24,40,0.08)'}}>
          <ul className="space-y-1">
            <li>
              <button 
                className="flex items-center w-full px-4 py-2 text-[#101828] text-sm hover:bg-[#F9FAFB] gap-2"
                onClick={() => handleViewProduct(productId)}
              >
                <EyeIcon className="w-5 h-5 mr-2" />View Details
              </button>
            </li>
            <li>
              <button 
                className="flex items-center w-full px-4 py-2 text-[#101828] text-sm hover:bg-[#F9FAFB] gap-2"
                onClick={() => {
                  const product = products.find(p => p.id === productId);
                  if (product) handleEditProduct(product);
                }}
              >
                <PencilIcon className="w-5 h-5 mr-2" />Edit
              </button>
            </li>
            <li>
              <button className="flex items-center w-full px-4 py-2 text-[#1976D2] text-sm hover:bg-[#F9FAFB] gap-2" onClick={() => approveProduct(productId)}>
                <CheckCircleIcon className="w-5 h-5 mr-2" />Approve Product
              </button>
            </li>
            <li>
              <button className="flex items-center w-full px-4 py-2 text-[#F04438] text-sm hover:bg-[#F9FAFB] gap-2" onClick={() => rejectProduct(productId)}>
                <XCircleIcon className="w-5 h-5 mr-2" />Reject Product
              </button>
            </li>
            
            <li>
              <button className="flex items-center w-full px-4 py-2 text-[#F04438] text-sm hover:bg-[#F9FAFB] gap-2">
                <TrashIcon className="w-5 h-5 mr-2 text-[#F04438]" />Delete
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};
    const fetchProducts = async () => {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        per_page: perPage.toString(),
        search: searchQuery,
      });
      
      try {
        const res = await fetchData<any>(`admin/products?${queryParams.toString()}`);
        
        let data: Product[] = [];
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

        setProducts(data);
        if (meta) {
          setTotal(meta.total || 0);
          setLastPage(meta.last_page || 1);
        }
      } catch (error) {
        console.error("Failed to fetch products", error);
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
    
    const handleSearch = () => {
      setPage(1);
      fetchProducts();
    };

async function approveProduct(productId: number) {
  try {
    await fetchData(`admin/products/${productId}/approve`, 'POST');
    // Optionally, refresh products list or show a success message
    // You may want to refetch products here
       fetchProducts();
    alert('Product approved successfully!');
  } catch (error) {
    alert('Failed to approve product.');
  }
}

async function rejectProduct(productId: number) {
  try {
    await fetchData(`admin/products/${productId}/reject`, 'POST');
    fetchProducts();
    alert('Product rejected successfully!');
  } catch (error) {
    alert('Failed to reject product.');
  }
}
  useEffect( () => {
   
       fetchProducts();
  }, [page, perPage]);

  return (
    <div className="min-h-screen  p-0 " dir="ltr">
      <div className="container mx-auto px-8 pt-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div className="space-y-1">
            <nav className="flex items-center gap-2 text-sm text-[#98A2B3]">
              <span>Home</span>
              <span className="mx-1">/</span>
              <span>Products</span>
            </nav>
            <h1 className="text-3xl font-bold text-[#101828]">Products</h1>
            <p className="text-[#667085] text-base">View and manage all products registered in the system</p>
          </div>
        </div>
 
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Products Table */}
          <main className={`${sidebarOpen ? 'lg:col-span-3' : 'lg:col-span-4'} space-y-6`}>
          <AdminTable 
            searchQuery={searchQuery} 
            setSearchQuery={setSearchQuery} 
            handleSearch={handleSearch} 
            setAddModalOpen={() => {}} 
            title={products}
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
              key: 'category', label: 'Category', render: (product: Product) => product.category ? product.category.name : 'N/A'
            }, 
            {
              key : 'description', label : 'Description', render: (product: Product) => product.description ? product.description : 'N/A'

            },
            {
              key: 'price', label: 'Price', render: (product: Product) => `$${product.price.toFixed(2)}`
            }, {
              key: 'status', label: 'Status', render: (product: Product) => (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  product.status === 'approved' ? 'bg-green-100 text-green-800' :
                  product.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  product.status === 'rejected' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                </span>
              )
            }, {
              key: 'created_at', label: 'Created At', render: (product: Product) => new Date(product.created_at).toLocaleDateString()
            }, {
              key: 'actions', label: 'Actions', render: (product: Product) => <ActionMenu productId={product.id} />
            }]}
          />

          </main>
          {sidebarOpen && <CollapsibleSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />}
        </div>
      </div>

      {/* Edit Product Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Edit Product</h2>
              <button onClick={() => setEditModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleUpdateProduct} className="space-y-4">
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                <input
                  type="number"
                  required
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_special"
                  checked={formData.is_special}
                  onChange={(e) => setFormData({ ...formData, is_special: e.target.checked })}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label htmlFor="is_special" className="text-sm font-medium text-gray-700">Is Special</label>
              </div>

              {formData.is_special && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Special Starts At</label>
                    <input
                      type="datetime-local"
                      value={formData.special_starts_at}
                      onChange={(e) => setFormData({ ...formData, special_starts_at: e.target.value })}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Special Ends At</label>
                    <input
                      type="datetime-local"
                      value={formData.special_ends_at}
                      onChange={(e) => setFormData({ ...formData, special_ends_at: e.target.value })}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-[#1976D2] rounded-md hover:bg-[#1565C0]"
                >
                  Update Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Product Modal */}
      {viewModalOpen && viewingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Product Details</h2>
              <button onClick={() => setViewModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">ID</label>
                <p className="text-gray-900">{viewingProduct.id}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Name</label>
                <p className="text-gray-900">{viewingProduct.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Description</label>
                <p className="text-gray-900">{viewingProduct.description || 'N/A'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Price</label>
                <p className="text-gray-900">${viewingProduct.price}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Category</label>
                <p className="text-gray-900">{viewingProduct.category?.name || 'N/A'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Status</label>
                <span className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-medium ${
                  viewingProduct.status === 'approved' ? 'bg-green-100 text-green-800' :
                  viewingProduct.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {viewingProduct.status}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Created At</label>
                <p className="text-gray-900">{new Date(viewingProduct.created_at).toLocaleString()}</p>
              </div>
              {viewingProduct.images && viewingProduct.images.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Images</label>
                  <div className="flex flex-wrap gap-2">
                    {viewingProduct.images.map((img: any) => (
                      <img key={img.id} src={img.url} alt="Product" className="w-20 h-20 object-cover rounded border" />
                    ))}
                  </div>
                </div>
              )}
              {viewingProduct.specifications && viewingProduct.specifications.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Specifications</label>
                  <div className="grid grid-cols-2 gap-2">
                    {viewingProduct.specifications.map((spec: any, idx: number) => (
                      <div key={idx} className="text-xs bg-gray-50 rounded p-2">
                        <span className="font-semibold text-gray-700">{spec.specification_key?.name || 'Key'}:</span> {spec.value}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {viewingProduct.is_special && (
                <div className="bg-blue-50 p-3 rounded-md">
                  <p className="text-sm font-medium text-blue-800 mb-2">Special Offer Details</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-blue-600">Starts</label>
                      <p className="text-sm text-blue-900">{viewingProduct.special_starts_at ? new Date(viewingProduct.special_starts_at).toLocaleString() : 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-xs text-blue-600">Ends</label>
                      <p className="text-sm text-blue-900">{viewingProduct.special_ends_at ? new Date(viewingProduct.special_ends_at).toLocaleString() : 'N/A'}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setViewModalOpen(false)}
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
}

