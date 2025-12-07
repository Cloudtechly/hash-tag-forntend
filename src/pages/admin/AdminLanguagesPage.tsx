import React, { useEffect, useRef, useState } from 'react';
import fetchData from '../../Api/FetchApi';
import AdminTable from '../../components/admin/AdminTable';
import { EllipsisVerticalIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';


interface Language {
  id: number;
  name: string;
  native_name: string;
  flag: string;
  code: string;
  is_active: boolean;
  is_rtl: boolean;
  is_default: boolean;
}

const AdminLanguagesPage: React.FC = () => {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Language, 'id'>>({
    name: '',
    native_name: '',
    flag: '',
    code: '',
    is_active: true,
    is_rtl: false,
    is_default: false,
  });
  const [editId, setEditId] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    fetchLanguages();
  }, []);

  const fetchLanguages = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchData('admin/languages', 'GET') as any;
      let data: Language[] = [];
      if (Array.isArray(res)) {
        data = res;
      } else if (Array.isArray(res.data)) {
        data = res.data;
      } else if (res.body && Array.isArray(res.body.data)) {
        data = res.body.data;
      } else if (Array.isArray(res.body)) {
        data = res.body;
      }
      setLanguages(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch languages');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this language?')) {
      try {
        await fetchData(`admin/languages/${id}`, 'DELETE');
        fetchLanguages();
      } catch (err) {
        alert('Failed to delete language.');
      }
    }
  };
 const ActionMenu = ({ languageId }: any) => {
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
                      'admin/languages/' + languageId,
                      'DELETE',
                    )
                      .then(() => {
                        alert('Language deleted successfully');
                        window.location.reload();
                      })
                  }
                }
                className="flex items-center w-full px-4 py-2 text-[#F04438] text-sm hover:bg-[#F9FAFB] gap-2">
                <TrashIcon className="w-5 h-5 mr-2 text-[#F04438]" />Delete
              </button>
            </li>
          </ul>
          {editOpen && <EditLenModal languageId={languageId} open={editOpen} onClose={() => setEditOpen(false)} onAdEdited={() => window.location.reload()} />}
        </div>
      )}
    </div>
  );
  };

  function EditLenModal({ languageId, open, onClose, onAdEdited }: { languageId: number; open: boolean; onClose: () => void; onAdEdited: () => void }) {
    const [form, setForm] = useState<Omit<Language, 'id'>>({
      name: '',
      native_name: '',
      flag: '',
      code: '',
      is_active: true,
      is_rtl: false,
      is_default: false,
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
      if (open) {
        fetchData(`admin/languages/${languageId}`, 'GET').then((res: any) => {
            const data = res.data || res;
            setForm({
                name: data.name,
                native_name: data.native_name,
                flag: data.flag,
                code: data.code,
                is_active: data.is_active,
                is_rtl: data.is_rtl,
                is_default: data.is_default
            });
        });
      }
    }, [languageId, open]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value, type, checked } = e.target;
      setForm((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      try {
        await fetchData(`admin/languages/${languageId}`, 'PUT', form);
        onAdEdited();
        onClose();
      } catch {
        alert('Failed to edit language');
      } finally {
        setLoading(false);
      }
    };

    if (!open) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg border border-[#EAECF0] animate-fade-in">
          <h2 className="text-2xl font-bold mb-6 text-center text-[#1976D2]">Edit Language</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2 text-[#1976D2]" htmlFor="edit_name">Name</label>
                <input name="name" id="edit_name" type="text" value={form.name} onChange={handleChange} required className="w-full border border-[#D0D5DD] rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#1976D2] transition-all" placeholder="English" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-[#1976D2]" htmlFor="edit_native_name">Native Name</label>
                <input name="native_name" id="edit_native_name" type="text" value={form.native_name} onChange={handleChange} required className="w-full border border-[#D0D5DD] rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#1976D2] transition-all" placeholder="English" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-[#1976D2]" htmlFor="edit_flag">Flag (URL or emoji)</label>
                <input name="flag" id="edit_flag" type="text" value={form.flag} onChange={handleChange} className="w-full border border-[#D0D5DD] rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#1976D2] transition-all" placeholder="🇺🇸 or /images/flag.png" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-[#1976D2]" htmlFor="edit_code">Code</label>
                <input name="code" id="edit_code" type="text" value={form.code} onChange={handleChange} required className="w-full border border-[#D0D5DD] rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#1976D2] transition-all" placeholder="en" />
              </div>
              <div className="flex items-center gap-3 col-span-2">
                <input name="is_active" id="edit_is_active" type="checkbox" checked={form.is_active} onChange={handleChange} className="accent-[#1976D2]" />
                <label className="text-sm font-semibold text-[#1976D2]" htmlFor="edit_is_active">Is Active</label>
                <input name="is_rtl" id="edit_is_rtl" type="checkbox" checked={form.is_rtl} onChange={handleChange} className="accent-[#1976D2] ml-6" />
                <label className="text-sm font-semibold text-[#1976D2]" htmlFor="edit_is_rtl">Is RTL</label>
                <input name="is_default" id="edit_is_default" type="checkbox" checked={form.is_default} onChange={handleChange} className="accent-[#1976D2] ml-6" />
                <label className="text-sm font-semibold text-[#1976D2]" htmlFor="edit_is_default">Is Default</label>
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
 

  const handleAdd = () => {
    setEditId(null);
    setForm({
      name: '',
      native_name: '',
      flag: '',
      code: '',
      is_active: true,
      is_rtl: false,
      is_default: false,
    });
    setModalOpen(true);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalLoading(true);
    try {
      if (editId) {
        await fetchData(`admin/languages/${editId}`, 'PUT', form);
      } else {
        await fetchData('admin/languages', 'POST', form);
      }
      setModalOpen(false);
      fetchLanguages();
    } catch {
      alert('Failed to save language');
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-0">
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg border border-[#EAECF0] animate-fade-in">
            <h2 className="text-2xl font-bold mb-6 text-center text-[#1976D2]">{editId ? 'Edit Language' : 'Add Language'}</h2>
            <form onSubmit={handleFormSubmit} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-[#1976D2]" htmlFor="name">Name</label>
                  <input name="name" id="name" type="text" value={form.name} onChange={handleFormChange} required className="w-full border border-[#D0D5DD] rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#1976D2] transition-all" placeholder="English" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-[#1976D2]" htmlFor="native_name">Native Name</label>
                  <input name="native_name" id="native_name" type="text" value={form.native_name} onChange={handleFormChange} required className="w-full border border-[#D0D5DD] rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#1976D2] transition-all" placeholder="English" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-[#1976D2]" htmlFor="flag">Flag (URL or emoji)</label>
                  <input name="flag" id="flag" type="text" value={form.flag} onChange={handleFormChange} className="w-full border border-[#D0D5DD] rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#1976D2] transition-all" placeholder="🇺🇸 or /images/flag.png" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-[#1976D2]" htmlFor="code">Code</label>
                  <input name="code" id="code" type="text" value={form.code} onChange={handleFormChange} required className="w-full border border-[#D0D5DD] rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#1976D2] transition-all" placeholder="en" />
                </div>
                <div className="flex items-center gap-3 col-span-2">
                  <input name="is_active" id="is_active" type="checkbox" checked={form.is_active} onChange={handleFormChange} className="accent-[#1976D2]" />
                  <label className="text-sm font-semibold text-[#1976D2]" htmlFor="is_active">Is Active</label>
                  <input name="is_rtl" id="is_rtl" type="checkbox" checked={form.is_rtl} onChange={handleFormChange} className="accent-[#1976D2] ml-6" />
                  <label className="text-sm font-semibold text-[#1976D2]" htmlFor="is_rtl">Is RTL</label>
                  <input name="is_default" id="is_default" type="checkbox" checked={form.is_default} onChange={handleFormChange} className="accent-[#1976D2] ml-6" />
                  <label className="text-sm font-semibold text-[#1976D2]" htmlFor="is_default">Is Default</label>
                </div>
              </div>
              <div className="flex gap-3 justify-end mt-8">
                <button type="button" onClick={() => setModalOpen(false)} className="px-5 py-2 rounded-lg bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition">Cancel</button>
                <button type="submit" disabled={modalLoading} className="px-5 py-2 rounded-lg bg-[#1976D2] text-white font-semibold shadow hover:bg-[#1565C0] transition">{modalLoading ? (editId ? 'Saving...' : 'Adding...') : (editId ? 'Save Changes' : 'Add Language')}</button>
              </div>
            </form>
          </div>
        </div>
      )}
      <div className="container mx-auto px-8 pt-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div className="space-y-1">
            <nav className="flex items-center gap-2 text-sm text-[#98A2B3]">
              <span>Home</span>
              <span className="mx-1">/</span>
              <span>Languages</span>
            </nav>
            <h1 className="text-3xl font-bold text-[#101828]">Languages</h1>
            <p className="text-[#667085] text-base">View and manage all languages registered in the system</p>
          </div>
         </div>
     <AdminTable
  searchQuery={''}
  setSearchQuery={() => {}}
  handleSearch={() => {}}
  setAddModalOpen={handleAdd}
  title={languages}
  columns={[
    { key: 'name', label: 'Name' },
    { key: 'native_name', label: 'Native Name' },
    { key: 'flag', label: 'Flag' },
    { key: 'code', label: 'Code' },
    { key: 'is_active', label: 'Active', render: row => row.is_active ? 'Yes' : 'No' },
    { key: 'is_rtl', label: 'RTL', render: row => row.is_rtl ? 'Yes' : 'No' },
    { key: 'is_default', label: 'Default', render: row => row.is_default ? 'Yes' : 'No' },
    { key: 'actions', label: 'Actions', render: row => <ActionMenu languageId={row.id} /> }
  ]}
/>
      </div>
    </div>
  );
};

export default AdminLanguagesPage;
