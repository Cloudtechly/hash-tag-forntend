import React, { useEffect, useState } from 'react';
import fetchData from '../../Api/FetchApi';
import AdminTable from '../../components/admin/AdminTable';
import { CheckCircleIcon, XCircleIcon, ClockIcon } from '@heroicons/react/24/outline';

interface Auction {
  id: number;
  name: string;
  status: string;
  start_time: string;
  end_time: string;
  current_bid: number;
  // Add other fields as needed
}

const AdminAuctionsPage: React.FC = () => {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Pagination State
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [lastPage, setLastPage] = useState(1);

  // Extend Modal State
  const [extendModalOpen, setExtendModalOpen] = useState(false);
  const [selectedAuctionId, setSelectedAuctionId] = useState<number | null>(null);
  const [extendMinutes, setExtendMinutes] = useState(30);

  const fetchAuctions = async () => {
    setLoading(true);
    setError(null);
    try {
      const url = `admin/auctions?page=${page}&per_page=${perPage}&search=${searchQuery}`;
      const res = await fetchData(url) as any;
      
      let data: Auction[] = [];
      let meta: any = {};
      
      if (res.data && Array.isArray(res.data)) {
        data = res.data;
        meta = res.meta;
      } else if (Array.isArray(res)) {
        data = res;
      }
      
      setAuctions(data);
      if (meta) {
        setTotal(meta.total || 0);
        setLastPage(meta.last_page || 1);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch auctions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuctions();
  }, [page, perPage]);

  const handleSearch = () => {
    setPage(1);
    fetchAuctions();
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

  const handleApprove = async (id: number) => {
    if (!window.confirm('Are you sure you want to approve this auction?')) return;
    try {
      await fetchData(`admin/auctions/${id}/approve`, 'POST');
      alert('Auction approved successfully');
      fetchAuctions();
    } catch (err: any) {
      alert(err.message || 'Failed to approve auction');
    }
  };

  const handleClose = async (id: number) => {
    if (!window.confirm('Are you sure you want to close this auction?')) return;
    try {
      await fetchData(`admin/auctions/${id}/close`, 'POST');
      alert('Auction closed successfully');
      fetchAuctions();
    } catch (err: any) {
      alert(err.message || 'Failed to close auction');
    }
  };

  const openExtendModal = (id: number) => {
    setSelectedAuctionId(id);
    setExtendMinutes(30);
    setExtendModalOpen(true);
  };

  const handleExtend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAuctionId) return;
    
    try {
      await fetchData(`admin/auctions/${selectedAuctionId}/extend`, 'POST', {
        minutes: extendMinutes
      });
      alert('Auction extended successfully');
      setExtendModalOpen(false);
      fetchAuctions();
    } catch (err: any) {
      alert(err.message || 'Failed to extend auction');
    }
  };

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { 
      key: 'status', 
      label: 'Status',
      render: (row: Auction) => (
        <span className={`px-2 py-1 rounded text-xs font-medium ${
          row.status === 'active' ? 'bg-green-100 text-green-800' :
          row.status === 'closed' ? 'bg-red-100 text-red-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {row.status}
        </span>
      )
    },
    { key: 'current_bid', label: 'Current Bid' },
    { key: 'start_time', label: 'Start Time' },
    { key: 'end_time', label: 'End Time' },
    {
      key: 'actions',
      label: 'Actions',
      render: (row: Auction) => (
        <div className="flex gap-2">
          <button 
            onClick={() => handleApprove(row.id)} 
            className="text-green-600 hover:text-green-800"
            title="Approve"
          >
            <CheckCircleIcon className="h-5 w-5" />
          </button>
          <button 
            onClick={() => handleClose(row.id)} 
            className="text-red-600 hover:text-red-800"
            title="Close"
          >
            <XCircleIcon className="h-5 w-5" />
          </button>
          <button 
            onClick={() => openExtendModal(row.id)} 
            className="text-blue-600 hover:text-blue-800"
            title="Extend"
          >
            <ClockIcon className="h-5 w-5" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Auctions Management</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <AdminTable
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleSearch={handleSearch}
        title={auctions}
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

      {extendModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-sm">
            <h2 className="text-xl font-bold mb-4">Extend Auction</h2>
            <form onSubmit={handleExtend}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Minutes to Extend</label>
                <input
                  type="number"
                  min="1"
                  value={extendMinutes}
                  onChange={(e) => setExtendMinutes(parseInt(e.target.value))}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setExtendModalOpen(false)}
                  className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Extend
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAuctionsPage;
