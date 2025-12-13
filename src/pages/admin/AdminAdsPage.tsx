import React, { useState, useRef, useEffect } from "react";
import {
  EllipsisVerticalIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import fetchData from "../../Api/FetchApi";
import AdminTable from "../../components/admin/AdminTable";


interface Ad {
  id: number;
  name: string;
  image_url?: string | null;
  target_url?: string | null;
  is_clickable?: boolean;
  click_count?: number;
  is_active?: boolean;
  display_order?: number;
  starts_at?: string | null;
  ends_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

const uploadImage = async (file: File) => {
  const formData = new FormData();
  formData.append('files[]', file);
  formData.append('purpose', 'adimage');
  
  const data = await fetchData('admin/assets/uploads', 'POST', formData) as any;
  
  if (data?.assets && Array.isArray(data.assets) && data.assets.length > 0) {
    return data.assets[0].id;
  }
  
  return null;
};

interface ActionMenuProps {
  adId: number;
}



 const ActionMenu = ({ adId }: ActionMenuProps) => {
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
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
        <div className="absolute right-0 top-10 z-20 min-w-[180px] bg-white rounded-xl shadow-lg border border-[#EAECF0] py-2 px-0 text-left animate-fade-in" style={{ boxShadow: '0 4px 24px 0 rgba(16,24,40,0.08)' }}>
          <ul className="space-y-1">
            <li>
              <button className="flex items-center w-full px-4 py-2 text-[#101828] text-sm hover:bg-[#F9FAFB] gap-2" onClick={() => { setEditOpen(true); setOpen(false); }}>
                <PencilIcon className="w-5 h-5 mr-2" />Edit
              </button>
            </li>
            <li>
              <button
                onClick={
                  () => {
                    const data = fetchData(
                      'admin/ads/' + adId,
                      'DELETE',
                    )
                      .then(() => {
                        alert('Ad deleted successfully');
                        window.location.reload();
                      })
                  }
                }
                className="flex items-center w-full px-4 py-2 text-[#F04438] text-sm hover:bg-[#F9FAFB] gap-2">
                <TrashIcon className="w-5 h-5 mr-2 text-[#F04438]" />Delete
              </button>
            </li>
          </ul>
          {editOpen && <EditAdModal adId={adId} open={editOpen} onClose={() => setEditOpen(false)} onAdEdited={() => window.location.reload()} />}
        </div>
      )}
    </div>
  );
  // EditAdModal: same UI as AddAdModal, but loads ad data and sends PATCH
  function EditAdModal({ adId, open, onClose, onAdEdited }: { adId: number; open: boolean; onClose: () => void; onAdEdited: () => void }) {
    const [form, setForm] = useState<{
      name: string;
      image: File | null;
      target_url: string;
      is_clickable: boolean;
      is_active: boolean;
      display_order: number;
      starts_at: string;
      ends_at: string;
    }>({
      name: '',
      image: null,
      target_url: '',
      is_clickable: true,
      is_active: true,
      display_order: 0,
      starts_at: '',
      ends_at: ''
    });
    const [loading, setLoading] = useState(false);
    const [initialImageUrl, setInitialImageUrl] = useState<string | null>(null);

    useEffect(() => {
      const normalizeAd = (payload: any) => {
        if (!payload) return null;
        if (Array.isArray(payload)) return payload[0];
        if (Array.isArray(payload.data)) return payload.data[0];
        if (payload.data) return payload.data;
        if (Array.isArray(payload.body?.data)) return payload.body.data[0];
        if (payload.body?.data) return payload.body.data;
        if (payload.body) return payload.body;
        return payload;
      };

      const toBoolean = (value: any) => {
        if (typeof value === 'string') {
          return value === 'true' || value === '1';
        }
        if (typeof value === 'number') {
          return value === 1;
        }
        return Boolean(value);
      };

      if (open) {
        const fetchAd = async () => {
          try {
            const adResponse = await fetchData(`admin/ads/${adId}`, 'GET');
            const ad = normalizeAd(adResponse);
            if (ad) {
              const convertToDateString = (value?: string | null) => (
                value ? new Date(value).toISOString().slice(0, 16) : ''
              );
              setForm({
                name: ad.name || '',
                image: null,
                target_url: ad.target_url || '',
                is_clickable: toBoolean(ad.is_clickable ?? true),
                is_active: toBoolean(ad.is_active ?? true),
                display_order: typeof ad.display_order === 'number' ? ad.display_order : Number(ad.display_order ?? 0),
                starts_at: convertToDateString(ad.starts_at),
                ends_at: convertToDateString(ad.ends_at),
              });
              setInitialImageUrl(ad.image_url || null);
            }
          } catch (error) {
            console.error("Failed to fetch ad:", error);
          }
        };
        fetchAd();
      }
    }, [adId, open]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value, type, checked, files } = e.target as HTMLInputElement;
      if (name === 'image' && files && files[0]) {
        setForm((prev) => ({ ...prev, image: files[0] }));
      } else {
        setForm((prev) => ({
          ...prev,
          [name]: type === 'checkbox' ? checked : type === 'number' ? Number(value) : value
        }));
      }
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (form.starts_at && form.ends_at) {
        const starts = new Date(form.starts_at);
        const ends = new Date(form.ends_at);
        if (ends < starts) {
          alert('End time must be the same or after the start time.');
          return;
        }
      }
      setLoading(true);
      try {
        let imageAssetId = null;
        if (form.image) {
          imageAssetId = await uploadImage(form.image);
        }

        const payload: any = {
          name: form.name,
          target_url: form.target_url || undefined,
          is_clickable: form.is_clickable,
          is_active: form.is_active,
          display_order: form.display_order,
          starts_at: form.starts_at || undefined,
          ends_at: form.ends_at || undefined,
        };

        if (imageAssetId) {
          payload.image_asset_id = imageAssetId;
        }

        await fetchData(`admin/ads/${adId}`, 'PATCH', payload);
        onAdEdited();
        onClose();
      } catch {
        alert('Failed to edit ad');
      } finally {
        setLoading(false);
      }
    };

    if (!open) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg border border-[#EAECF0] animate-fade-in">
          <h2 className="text-2xl font-bold mb-6 text-center text-[#1976D2]">Edit Ad</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2 text-[#1976D2]" htmlFor="name">Name</label>
                <input name="name" id="name" type="text" value={form.name} onChange={handleChange} required className="w-full border border-[#D0D5DD] rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#1976D2] transition-all" placeholder="Ad for test" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-[#1976D2]" htmlFor="display_order">Display Order</label>
                <input name="display_order" id="display_order" type="number" value={form.display_order} onChange={handleChange} className="w-full border border-[#D0D5DD] rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#1976D2] transition-all" />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-semibold mb-2 text-[#1976D2]" htmlFor="target_url">Target URL</label>
                <input name="target_url" id="target_url" type="text" value={form.target_url} onChange={handleChange} className="w-full border border-[#D0D5DD] rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#1976D2] transition-all" placeholder="https://example.com" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-[#1976D2]" htmlFor="starts_at">Starts At</label>
                <input name="starts_at" id="starts_at" type="datetime-local" value={form.starts_at} onChange={handleChange} className="w-full border border-[#D0D5DD] rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#1976D2] transition-all" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-[#1976D2]" htmlFor="ends_at">Ends At</label>
                <input name="ends_at" id="ends_at" type="datetime-local" value={form.ends_at} onChange={handleChange} className="w-full border border-[#D0D5DD] rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#1976D2] transition-all" />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-semibold mb-2 text-[#1976D2]" htmlFor="image">Image</label>
                <input name="image" id="image" type="file" accept="image/*" onChange={handleChange} className="w-full border border-[#D0D5DD] rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#1976D2] transition-all" />
                {(form.image || initialImageUrl) && (
                  <div className="mt-2 flex justify-center">
                    <img src={form.image ? URL.createObjectURL(form.image) : initialImageUrl!} alt="Preview" className="h-32 w-32 object-cover rounded-lg border border-[#EAECF0] shadow" />
                  </div>
                )}
              </div>
              <div className="flex items-center gap-3">
                <input name="is_clickable" id="is_clickable" type="checkbox" checked={form.is_clickable} onChange={handleChange} className="accent-[#1976D2]" />
                <label className="text-sm font-semibold text-[#1976D2]" htmlFor="is_clickable">Is Clickable</label>
              </div>
              <div className="flex items-center gap-3">
                <input name="is_active" id="is_active" type="checkbox" checked={form.is_active} onChange={handleChange} className="accent-[#1976D2]" />
                <label className="text-sm font-semibold text-[#1976D2]" htmlFor="is_active">Is Active</label>
              </div>
            </div>
            <div className="flex gap-3 justify-end mt-8">
              <button type="button" onClick={onClose} className="px-5 py-2 rounded-lg bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition">Cancel</button>
              <button type="submit" disabled={loading} className="px-5 py-2 rounded-lg bg-[#1976D2] text-white font-semibold shadow hover:bg-[#1565C0] transition">{loading ? 'Saving...' : 'Save Changes'}</button>
            </div>
          </form>
        </div>
      </div>
    );
  }
};

function AddAdModal({ open, onClose, onAdAdded }: { open: boolean; onClose: () => void; onAdAdded: () => void }) {
  const [form, setForm] = useState<{
    name: string;
    image: File | null;
    target_url: string;
    is_clickable: boolean;
    is_active: boolean;
    display_order: number;
    starts_at: string;
    ends_at: string;
  }>({
    name: '',
    image: null,
    target_url: '',
    is_clickable: true,
    is_active: true,
    display_order: 0,
    starts_at: '',
    ends_at: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked, files } = e.target as HTMLInputElement;
    if (name === 'image' && files && files[0]) {
      setForm((prev) => ({ ...prev, image: files[0] }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : type === 'number' ? Number(value) : value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let imageAssetId = null;
      if (form.image) {
        imageAssetId = await uploadImage(form.image);
      }

      const payload: any = {
        name: form.name,
        target_url: form.target_url || '',
        is_clickable: form.is_clickable ? 1 : 0,
        is_active: form.is_active ? 1 : 0,
        display_order: form.display_order,
        starts_at: form.starts_at || '',
        ends_at: form.ends_at || ''
      };

      if (imageAssetId) {
        payload.image_asset_id = imageAssetId;
      }

      await fetchData('admin/ads', 'POST', payload);
      onAdAdded();
      onClose();
    } catch {
      alert('Failed to add ad');
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Add New Add</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="name">Name</label>
            <input name="name" id="name" type="text" value={form.name} onChange={handleChange} required className="w-full border rounded px-3 py-2" placeholder="Ad for test" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="image">Image</label>
            <input name="image" id="image" type="file" accept="image/*" onChange={handleChange} required className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="target_url">Target URL</label>
            <input name="target_url" id="target_url" type="text" value={form.target_url} onChange={handleChange} className="w-full border rounded px-3 py-2" placeholder="https://example.com" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="display_order">Display Order</label>
            <input name="display_order" id="display_order" type="number" value={form.display_order} onChange={handleChange} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="starts_at">Starts At</label>
            <input name="starts_at" id="starts_at" type="datetime-local" value={form.starts_at} onChange={handleChange} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="ends_at">Ends At</label>
            <input name="ends_at" id="ends_at" type="datetime-local" value={form.ends_at} onChange={handleChange} className="w-full border rounded px-3 py-2" />
          </div>
          <div className="flex ">
            <input name="is_clickable" id="is_clickable" type="checkbox" checked={form.is_clickable} onChange={handleChange} className="mr-2" />

            <label className="block text-sm font-medium mb-1 mx-3" htmlFor="is_clickable">Is Clickable</label>

            <input name="is_active" id="is_active" type="checkbox" checked={form.is_active} onChange={handleChange} className="mr-2" />
            <label className="block text-sm font-medium mb-1" htmlFor="is_active">Is Active</label>

          </div>
          <div className="flex gap-2 justify-end mt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded bg-gray-200">Cancel</button>
            <button type="submit" disabled={loading} className="px-4 py-2 rounded bg-[#1976D2] text-white font-semibold">{loading ? 'Adding...' : 'Add Ad'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
export default function AdminAdsPage() {
  const [ads, setAds] = useState<Ad[]>([]);
  const [addModalOpen, setAddModalOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");

  // Pagination State
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [lastPage, setLastPage] = useState(1);

  const fetchAds = async () => {
    let url = `admin/ads?page=${page}&per_page=${perPage}`;
    if (searchQuery) {
      url += `&filter[name]=${encodeURIComponent(searchQuery)}`;
    }
    const res = await fetchData<any>(url) as any;
    let data: Ad[] = [];
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
    
    setAds(data);
    if (meta) {
      setTotal(meta.total || 0);
      setLastPage(meta.last_page || 1);
    }
  };

  useEffect(() => {
    fetchAds();
  }, [page, perPage]);

  function handleSearch() {
    setPage(1);
    fetchAds();
  }

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
    <div className="min-h-screen p-0" >
      <AddAdModal open={addModalOpen} onClose={() => setAddModalOpen(false)} onAdAdded={fetchAds} />
      <div className="container mx-auto px-8 pt-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div className="space-y-1">
            <nav className="flex items-center gap-2 text-sm text-[#98A2B3]">
              <span>Home</span>
              <span className="mx-1">/</span>
              <span>Ads</span>
            </nav>
            <h1 className="text-3xl font-bold text-[#101828]">Ads</h1>
            <p className="text-[#667085] text-base">View and manage all ads registered in the system</p>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Ads Table */}
          <AdminTable searchQuery={searchQuery} setSearchQuery={setSearchQuery} handleSearch={handleSearch} setAddModalOpen={setAddModalOpen} title={ads}
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
              key: 'target_url', label: 'Target URL'
            }, {
              key: 'is_clickable', label: 'Is Clickable' ,render: row => row.is_clickable ? 'Yes' : 'No'
            }, {
              key: 'is_active', label: 'Is Active', render: row => row.is_active ? 'Yes' : 'No'
            }, {
              key: 'display_order', label: 'Display Order'
            }, {
              key: 'click_count', label: 'Click Count'
            }, {
              key: 'starts_at', label: 'Starts At'
            }, {
              key: 'ends_at', label: 'Ends At'
            },{
            key : 'image_url', label: 'Image', render: row => row.image_url ? <img src={row.image_url} alt={row.name} className="h-12 w-12 object-cover rounded" /> : 'No Image'
            }]
          }

          />
        </div>
      </div>
    </div>
  );
}

