import React, { useEffect, useState } from 'react';
import fetchData from '../../Api/FetchApi';
import AdminTable from '../../components/admin/AdminTable';

interface Customer {
  id: number;
  name: string;
  email: string;
  phone_number: string;
  avatar: string | null;
  verified_phone_number_at: string | null;
  is_active: boolean;
  default_language_id: number | null;
  is_first_time_login: boolean;
  auto_approve: boolean;
  auto_approve_auction: boolean;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

const AdminCustomersPage: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const handleView = async (id: number) => {
    try {
      const res = await fetchData(`admin/customers/${id}`, 'GET') as any;
      let customer: Customer | null = null;
      if (Array.isArray(res)) customer = res[0];
      else if (Array.isArray(res.data)) customer = res.data[0];
      else if (res.data) customer = res.data;
      else if (Array.isArray(res.body?.data)) customer = res.body.data[0];
      else if (res.body?.data) customer = res.body.data;
      else if (res.body) customer = res.body;
      setSelectedCustomer(customer);
      setViewModalOpen(true);
    } catch {
      alert('Failed to load customer details');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await fetchData(`admin/customers/${id}`, 'DELETE');
        fetchCustomers();
      } catch {
        alert('Failed to delete customer');
      }
    }
  };
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [lastPage, setLastPage] = useState(1);

  useEffect(() => {
    fetchCustomers();
    // eslint-disable-next-line
  }, [page, perPage]);

  const fetchCustomers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchData(`admin/customers?per_page=${perPage}&page=${page}`, 'GET') as any;
      let data: Customer[] = [];
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
      setCustomers(data);
      if (meta) {
        setTotal(meta.total || 0);
        setLastPage(meta.last_page || 1);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch customers');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPage(1);
    fetchCustomers();
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
              <span>Customers</span>
            </nav>
            <h1 className="text-3xl font-bold text-[#101828]">Customers</h1>
            <p className="text-[#667085] text-base">View and manage all customers registered in the system</p>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <AdminTable
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            handleSearch={handleSearch}
              // setAddModalOpen not provided to disable Add New button
            title={customers}
            columns={[
              { key: 'id', label: 'ID' },
              { key: 'name', label: 'Name' },
              { key: 'email', label: 'Email' },
              { key: 'phone_number', label: 'Phone Number' },
              { key: 'avatar', label: 'Avatar', render: row => row.avatar ? <img src={row.avatar} alt={row.name} className="w-10 h-10 rounded-full object-cover" /> : '-' },
              { key: 'is_active', label: 'Active', render: row => row.is_active ? 'Yes' : 'No' },
              { key: 'is_first_time_login', label: 'First Login', render: row => row.is_first_time_login ? 'Yes' : 'No' },
              { key: 'auto_approve', label: 'Auto Approve', render: row => row.auto_approve ? 'Yes' : 'No' },
              { key: 'auto_approve_auction', label: 'Auto Approve Auction', render: row => row.auto_approve_auction ? 'Yes' : 'No' },
              { key: 'created_at', label: 'Created At', render: row => new Date(row.created_at).toLocaleDateString() },
              { key: 'updated_at', label: 'Updated At', render: row => new Date(row.updated_at).toLocaleDateString() },
              {
                key: 'actions',
                label: 'Actions',
                render: row => (
                  <div className="flex gap-2">
                    <button className="px-2 py-1 rounded bg-blue-100 text-blue-700 text-xs font-semibold" onClick={() => handleView(row.id)}>View</button>
                    <button className="px-2 py-1 rounded bg-red-100 text-red-700 text-xs font-semibold" onClick={() => handleDelete(row.id)}>Delete</button>
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
      {viewModalOpen && selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg border border-[#EAECF0] animate-fade-in">
            <h2 className="text-2xl font-bold mb-6 text-center text-[#1976D2]">Customer Details</h2>
            <div className="space-y-2">
              <div><strong>ID:</strong> {selectedCustomer.id}</div>
              <div><strong>Name:</strong> {selectedCustomer.name}</div>
              <div><strong>Email:</strong> {selectedCustomer.email}</div>
              <div><strong>Phone:</strong> {selectedCustomer.phone_number}</div>
              <div><strong>Active:</strong> {selectedCustomer.is_active ? 'Yes' : 'No'}</div>
              <div><strong>First Login:</strong> {selectedCustomer.is_first_time_login ? 'Yes' : 'No'}</div>
              <div><strong>Auto Approve:</strong> {selectedCustomer.auto_approve ? 'Yes' : 'No'}</div>
              <div><strong>Auto Approve Auction:</strong> {selectedCustomer.auto_approve_auction ? 'Yes' : 'No'}</div>
              <div><strong>Created At:</strong> {new Date(selectedCustomer.created_at).toLocaleString()}</div>
              <div><strong>Updated At:</strong> {new Date(selectedCustomer.updated_at).toLocaleString()}</div>
              {selectedCustomer.avatar && (
                <div><strong>Avatar:</strong> <img src={selectedCustomer.avatar} alt={selectedCustomer.name} className="w-16 h-16 rounded-full object-cover" /></div>
              )}
            </div>
            <div className="flex gap-3 justify-end mt-8">
              <button type="button" onClick={() => setViewModalOpen(false)} className="px-5 py-2 rounded-lg bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition">Close</button>
            </div>
          </div>
        </div>
      )}
        </div>
      </div>
    </div>
  );
};

export default AdminCustomersPage;
