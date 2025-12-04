
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
 
} from "@heroicons/react/24/outline";
import fetchData from "../../Api/FetchApi";

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
              <button className="flex items-center w-full px-4 py-2 text-[#101828] text-sm hover:bg-[#F9FAFB] gap-2">
                <EyeIcon className="w-5 h-5 mr-2" />View Details
              </button>
            </li>
            <li>
              <button className="flex items-center w-full px-4 py-2 text-[#101828] text-sm hover:bg-[#F9FAFB] gap-2">
                <PencilIcon className="w-5 h-5 mr-2" />Edit
              </button>
            </li>
            <li>
              <button className="flex items-center w-full px-4 py-2 text-[#1976D2] text-sm hover:bg-[#F9FAFB] gap-2" onClick={() => approveProduct(productId)}>
                <CheckCircleIcon className="w-5 h-5 mr-2" />Approve Product
              </button>
            </li>
            <li>
              <button className="flex items-center w-full px-4 py-2 text-[#101828] text-sm hover:bg-[#F9FAFB] gap-2">
                <ArrowTrendingUpIcon className="w-5 h-5 mr-2" />Follow-up
              </button>
            </li>
            <li>
              <button className="flex items-center w-full px-4 py-2 text-[#101828] text-sm hover:bg-[#F9FAFB] gap-2">
                <ArrowDownTrayIcon className="w-5 h-5 mr-2" />Download
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
         const res = await fetchData<any[]>('admin/products') as any;
         setProducts(res.data as any[])
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
  useEffect( () => {
   
       fetchProducts();
  }, []);

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
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="relative w-72">
                  <input type="text" placeholder="Search for products..." className="flex h-9 w-full rounded-md border border-[#D0D5DD] bg-transparent pl-10 pr-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-[#98A2B3] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#1976D2] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm text-left" />
                  <MagnifyingGlassIcon className="w-4 h-4 text-[#98A2B3] absolute right-3 top-1/2 -translate-y-1/2" />
                </div>
               
                    <button
                onClick={()=>
               setSidebarOpen((v) => true)
                }
                 className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#1976D2] disabled:pointer-events-none disabled:opacity-50 border border-[#D0D5DD] bg-transparent shadow-sm hover:bg-[#F2F4F7] hover:text-[#1976D2] h-9 px-4 py-2">
                  Search
                </button>
                {sidebarOpen ? null : (
                 <button
                onClick={()=>
               setSidebarOpen((v) => true)
                }
                 className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#1976D2] disabled:pointer-events-none disabled:opacity-50 border border-[#D0D5DD] bg-transparent shadow-sm hover:bg-[#F2F4F7] hover:text-[#1976D2] h-9 px-4 py-2">
                  Advanced Search
                </button>
                )}
              </div>
            
            </div>
            <div className="bg-white rounded-xl border border-[#EAECF0] shadow-soft">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-4 border-b border-[#EAECF0]">
                <div className="text-sm text-[#667085]">Total products: <span className="font-semibold text-[#101828]">{products.length}</span></div>
                <div className="flex items-center gap-2">
                  <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#1976D2] disabled:pointer-events-none disabled:opacity-50 border border-[#D0D5DD] bg-transparent shadow-sm hover:bg-[#F2F4F7] hover:text-[#1976D2] h-8 rounded-md px-3 text-xs">
                    <ArrowDownTrayIcon className="w-4 h-4 mr-2" />Export
                  </button>
                  <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#1976D2] disabled:pointer-events-none disabled:opacity-50 border border-[#D0D5DD] bg-transparent shadow-sm hover:bg-[#F2F4F7] hover:text-[#1976D2] h-8 rounded-md px-3 text-xs">
                    <PrinterIcon className="w-4 h-4 mr-2" />Print
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full caption-bottom text-sm ltr text-[#344054]">
                  <thead className="bg-[#F9FAFB]">
                    <tr className="border-b border-[#EAECF0]">
                      <th className="h-10 px-2 align-middle font-medium text-[#98A2B3] w-12 text-center">
                        <input type="checkbox" className="h-4 w-4 rounded-sm border border-[#1976D2] shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#1976D2]" />
                      </th>
                      <th className="h-10 px-2 align-middle font-medium text-[#98A2B3] text-left">
                        <div className="flex items-center gap-2">
                          Product Name
                          
                        </div>
                      </th>
                      <th className="h-10 px-2 align-middle font-medium text-[#98A2B3] text-left">Category</th>
                      <th className="h-10 px-2 align-middle font-medium text-[#98A2B3] text-left">Price</th>
                      <th className="h-10 px-2 align-middle font-medium text-[#98A2B3] text-left">
                        <div className="flex items-center gap-2">
                          Date
                          <ArrowDownIcon className="w-4 h-4" />
                        </div>
                      </th>
                      <th className="h-10 px-2 align-middle font-medium text-[#98A2B3] text-left">
                        <div className="flex items-center gap-2">
                          Status
                       
                        </div>
                      </th>
                      <th className="h-10 px-2 align-middle font-medium text-[#98A2B3] text-center w-12">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products?.map((product) => (
                      <tr key={product.id} className="border-b border-[#EAECF0] hover:bg-[#F9FAFB]">
                        <td className="p-2 align-middle text-center">
                          <input type="checkbox" className="h-4 w-4 rounded-sm border border-[#1976D2] shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#1976D2]" />
                        </td>
                        <td className="p-2 align-middle font-medium text-[#101828] text-left">{product.name}</td>
                        <td className="p-2 align-middle text-left max-w-xs truncate">{product.category.name}</td>
                        <td className="p-2 align-middle text-left text-sm text-[#667085]">{product.price}</td>
                        <td className="p-2 align-middle text-left text-sm">{new Date(product.created_at).toLocaleDateString()}</td>
                        <td className="p-2 align-middle text-left">
                          <span className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none border-transparent shadow ${
                    product.status === 'pending' ? 'bg-yellow-200 text-yellow-800' : 'bg-gray-200 text-gray-800'
                }`}> 
                            {product.status}
                          </span>
                        </td>
                        <td className="p-2 align-middle text-center">
                          <ActionMenu productId={product.id} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-4">
                <div className="text-sm text-[#667085]">
                  Showing <span className="font-semibold text-[#101828]">1</span> to <span className="font-semibold text-[#101828]">{products.length}</span> of <span className="font-semibold text-[#101828]">{products.length}</span> products
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <label htmlFor="pageSize" className="text-sm text-[#667085]">Rows per page:</label>
                    <select id="pageSize" className="px-3 py-1 border border-[#EAECF0] rounded-md bg-white text-[#101828] text-sm">
                      <option value="10" selected>10</option>
                      <option value="25">25</option>
                      <option value="50">50</option>
                    </select>
                  </div>
                  <nav role="navigation" aria-label="pagination" className="mx-auto flex w-full justify-center">
                    <ul className="flex flex-row items-center gap-1">
                      <li>
                        <a className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#1976D2] disabled:pointer-events-none disabled:opacity-50 border border-[#EAECF0] bg-transparent shadow-sm hover:bg-[#F2F4F7] hover:text-[#1976D2] h-9 px-4 py-2 gap-1 pr-2.5" aria-label="Go to previous page">
                          <ChevronLeftIcon className="h-4 w-4" />
                          <span>Previous</span>
                        </a>
                      </li>
                      <li>
                        <a aria-current="page" className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#1976D2] disabled:pointer-events-none disabled:opacity-50 border border-[#D0D5DD] bg-transparent shadow-sm hover:bg-[#F2F4F7] hover:text-[#1976D2] h-9 w-9 cursor-pointer">1</a>
                      </li>
                      <li>
                        <a className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#1976D2] disabled:pointer-events-none disabled:opacity-50 border border-[#EAECF0] bg-transparent shadow-sm hover:bg-[#F2F4F7] hover:text-[#1976D2] h-9 px-4 py-2 gap-1 pl-2.5" aria-label="Go to next page">
                          <span>Next</span>
                          <ChevronRightIcon className="h-4 w-4" />
                        </a>
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>
            </div>
          </main>
          {sidebarOpen && <CollapsibleSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />}
        </div>
      </div>
    </div>
  );
}

