import React, { useEffect, useState } from 'react';
import fetchData from '../../Api/FetchApi';
import AdminTable from '../../components/admin/AdminTable';

interface SystemSetting {
  id: number;
  key: string;
  value: string | any;
  is_json: boolean;
  is_protected: boolean;
}

const AdminSystemSettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<SystemSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(100);
  const [total, setTotal] = useState(0);
  const [lastPage, setLastPage] = useState(1);

  // Add/Edit Modal State
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    key: '',
    value: '',
    is_json: false,
    is_protected: false
  });
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);

  useEffect(() => {
    fetchSettings();
    // eslint-disable-next-line
  }, [page, perPage]);

  const fetchSettings = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchData(`admin/system-settings?per_page=${perPage}&page=${page}`, 'GET') as any;
      let data: SystemSetting[] = [];
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
      setSettings(data);
      if (meta) {
        setTotal(meta.total || 0);
        setLastPage(meta.last_page || 1);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch settings');
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

  const handleAddClick = () => {
    setEditingId(null);
    setFormData({
      key: '',
      value: '',
      is_json: false,
      is_protected: false
    });
    setAddModalOpen(true);
  };

  const handleEditClick = (setting: SystemSetting) => {
    setEditingId(setting.id);
    let displayValue = setting.value;
    if (setting.is_json && typeof setting.value !== 'string') {
        displayValue = JSON.stringify(setting.value, null, 2);
    }

    setFormData({
      key: setting.key,
      value: displayValue,
      is_json: setting.is_json,
      is_protected: setting.is_protected
    });
    setAddModalOpen(true);
  };

  const handleSaveSetting = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddLoading(true);
    setAddError(null);

    let payloadValue = formData.value;
    if (formData.is_json) {
        try {
            payloadValue = JSON.parse(formData.value);
        } catch (e) {
            setAddError("Invalid JSON format in Value field");
            setAddLoading(false);
            return;
        }
    }

    const payload = {
        ...formData,
        value: payloadValue
    };

    try {
      if (editingId) {
        await fetchData(`admin/system-settings/${editingId}`, 'PUT', payload);
      } else {
        await fetchData('admin/system-settings', 'POST', payload);
      }
      setAddModalOpen(false);
      fetchSettings(); // Refresh list
    } catch (err: any) {
      setAddError(err.message || 'Failed to save setting');
    } finally {
      setAddLoading(false);
    }
  };

  const handleDeleteClick = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this setting?')) return;
    
    try {
      await fetchData(`admin/system-settings/${id}`, 'DELETE');
      fetchSettings();
    } catch (err: any) {
      alert(err.message || 'Failed to delete setting');
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
              <span>System Settings</span>
            </nav>
            <h1 className="text-3xl font-bold text-[#101828]">System Settings</h1>
            <p className="text-[#667085] text-base">Manage system configuration and variables</p>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <AdminTable
            searchQuery={''}
            setSearchQuery={() => {}}
            handleSearch={() => {}}
            setAddModalOpen={(val) => { if (val === true) handleAddClick(); else setAddModalOpen(val as boolean); }}
            title={settings}
            columns={[
              { key: 'id', label: 'ID' },
              { key: 'key', label: 'Key' },
              { 
                key: 'value', 
                label: 'Value', 
                render: (row: SystemSetting) => {
                    if (row.is_json && typeof row.value === 'object') {
                        return <pre className="text-xs max-w-xs overflow-auto">{JSON.stringify(row.value, null, 2)}</pre>;
                    }
                    return <span className="truncate max-w-xs block" title={String(row.value)}>{String(row.value)}</span>;
                }
              },
              { key: 'is_json', label: 'Is JSON', render: (row: SystemSetting) => row.is_json ? 'Yes' : 'No' },
              { key: 'is_protected', label: 'Protected', render: (row: SystemSetting) => row.is_protected ? 'Yes' : 'No' },
              {
                key: 'actions',
                label: 'Actions',
                render: (row: SystemSetting) => (
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleEditClick(row)}
                      className="text-primary hover:underline"
                    >
                      Edit
                    </button>
                    {!row.is_protected && (
                        <button
                        onClick={() => handleDeleteClick(row.id)}
                        className="text-red-500 hover:underline"
                        >
                        Delete
                        </button>
                    )}
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
        </div>
      </div>

      {/* Add/Edit Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">{editingId ? 'Edit Setting' : 'Add New Setting'}</h2>
              <button onClick={() => setAddModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {addError && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
                {addError}
              </div>
            )}

            <form onSubmit={handleSaveSetting}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Key</label>
                  <input
                    type="text"
                    required
                    value={formData.key}
                    onChange={(e) => setFormData({ ...formData, key: e.target.value })}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="e.g. site_name"
                    disabled={!!editingId && formData.is_protected} // Maybe prevent editing key if protected?
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Value</label>
                  {formData.is_json ? (
                      <textarea
                        required
                        value={formData.value}
                        onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary h-32 font-mono text-sm"
                        placeholder='{"key": "value"}'
                      />
                  ) : (
                    <input
                        type="text"
                        required
                        value={formData.value}
                        onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
                        placeholder="Value"
                    />
                  )}
                </div>
                
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_json}
                      onChange={(e) => setFormData({ ...formData, is_json: e.target.checked })}
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="text-sm text-gray-700">Is JSON</span>
                  </label>
                  {/* Usually users shouldn't be able to set is_protected easily, but for admin maybe ok */}
                  {/* <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_protected}
                      onChange={(e) => setFormData({ ...formData, is_protected: e.target.checked })}
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="text-sm text-gray-700">Protected</span>
                  </label> */}
                </div>
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
                  disabled={addLoading}
                  className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-opacity-90 disabled:opacity-50"
                >
                  {addLoading ? 'Saving...' : (editingId ? 'Update Setting' : 'Save Setting')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSystemSettingsPage;
