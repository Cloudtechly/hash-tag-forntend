import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import fetchData from '../Api/FetchApi';

const MyProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState<any>({
    title: '',
    price: '',
    description: '',
    discount_active: false,
    discount_ends_at: null,
    discount_percent: null,
  
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetchData(`customer/my-products/${id}`);
        setProduct(res.data || res);
        setForm({
          title: (res.data || res).title || '',
          price: (res.data || res).price || '',
          description: (res.data || res).description || '',
          discount_active: (res.data || res).discount_active ?? false,
          discount_ends_at: (res.data || res).discount_ends_at ?? null,
          discount_percent: (res.data || res).discount_percent ?? null,
         
        });
      } catch (err) {
        setError('Failed to load product');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProduct();
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;
  if (!product) return <div className="min-h-screen flex items-center justify-center">Product not found</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 md:px-8">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow p-6">
        <Link to="/customer/my-products" className="text-[#E46A4B] font-bold mb-4 inline-block">&larr; Back to My Products</Link>
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-900">{product.title}</h1>
          <button
            className="text-sm text-[#E46A4B] font-bold underline"
            onClick={() => setEditMode((v) => !v)}
          >
            {editMode ? 'Cancel' : 'Edit'}
          </button>
        </div>
        {/* Images */}
        <div className="mb-6 grid grid-cols-2 gap-4">
          {product.images && product.images.length > 0 ? (
            product.images.map((img: any, idx: number) => (
              <div key={img.id || idx} className="aspect-[4/3] bg-gray-100 rounded-xl overflow-hidden border border-gray-200 flex items-center justify-center">
                <img
                  src={img.url || `https://via.placeholder.com/400x300?text=Image+${idx+1}`}
                  alt={`Product image ${idx+1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))
          ) : (
            <div className="col-span-2 flex items-center justify-center bg-gray-100 rounded-xl h-48 text-gray-400">No Images</div>
          )}
        </div>
        {/* Edit Form */}
        {editMode ? (
          <form
            className="space-y-4 mb-4"
            onSubmit={async (e) => {
              e.preventDefault();
              setSaving(true);
              try {
                await fetchData(`customer/products/${product.id}`, 'PUT', {
                  title: form.title,
                  price: form.price,
                  description: form.description,
                  discount_active: form.discount_active,
                  discount_ends_at: form.discount_ends_at,
                  discount_percent: form.discount_percent,
                
                });
                setProduct((prev: any) => ({ ...prev, ...form }));
                setEditMode(false);
                alert('Product updated!');
              } catch (err) {
                alert('Failed to update product.');
              } finally {
                setSaving(false);
              }
            }}
          >
            <div>
              <label className="block text-sm font-bold mb-1">Title</label>
              <input
                type="text"
                value={form.title}
                onChange={e => setForm((f: any) => ({ ...f, title: e.target.value }))}
                className="w-full rounded-xl border px-4 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1">Price</label>
              <input
                type="number"
                value={form.price}
                onChange={e => setForm((f: any) => ({ ...f, price: e.target.value }))}
                className="w-full rounded-xl border px-4 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1">Description</label>
              <textarea
                value={form.description}
                onChange={e => setForm((f: any) => ({ ...f, description: e.target.value }))}
                className="w-full rounded-xl border px-4 py-2"
                rows={4}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1">Discount Active</label>
              <input
                type="checkbox"
                checked={form.discount_active}
                onChange={e => setForm((f: any) => ({ ...f, discount_active: e.target.checked }))}
                className="mr-2"
              />
              <span>{form.discount_active ? 'Yes' : 'No'}</span>
            </div>
            {/* <div>
              <label className="block text-sm font-bold mb-1">Discount Price</label>
              <input
                type="number"
                value={form.discount_price ?? ''}
                onChange={e => setForm((f: any) => ({ ...f, discount_price: e.target.value ? Number(e.target.value) : null }))}
                className="w-full rounded-xl border px-4 py-2"
                disabled={!form.discount_active}
              />
            </div> */}
            <div>
              <label className="block text-sm font-bold mb-1">Discount Percent</label>
              <input
                type="number"
                value={form.discount_percent ?? ''}
                onChange={e => setForm((f: any) => ({ ...f, discount_percent: e.target.value ? Number(e.target.value) : null }))}
                className="w-full rounded-xl border px-4 py-2"
                disabled={!form.discount_active}
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1">Discount Ends At</label>
              <input
                type="datetime-local"
                value={form.discount_ends_at ? form.discount_ends_at.substring(0, 16) : ''}
                onChange={e => setForm((f: any) => ({ ...f, discount_ends_at: e.target.value || null }))}
                className="w-full rounded-xl border px-4 py-2"
                disabled={!form.discount_active}
              />
            </div>
            <button
              type="submit"
              className="bg-[#E46A4B] text-white font-bold px-6 py-2 rounded-xl mt-2"
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        ) : (
          <>
            <div className="mb-4">
              <span className="inline-block bg-[#E46A4B] text-white text-xs font-bold px-3 py-1 rounded-full mb-2">{product.category?.name}</span>
              <div className="text-lg font-bold text-[#E46A4B] mb-2">LYD {product.price}</div>
              <div className="text-gray-700 mb-2">{product.description}</div>
              <div className="flex gap-2 mt-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  product.status === 'approved' ? 'bg-green-100 text-green-800' :
                  product.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  product.status === 'rejected' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                </span>
              </div>
            </div>
            {product.specifications && product.specifications.length > 0 && (
              <div className="mb-4">
                <h3 className="font-bold text-gray-900 mb-2">Specifications</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {product.specifications.map((spec: any) => (
                    <div key={spec.id} className="flex flex-col pb-2 border-b border-gray-50">
                      <span className="text-xs text-gray-500 capitalize mb-1">{spec.specification_key?.name}</span>
                      <span className="font-medium text-gray-900 text-sm">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MyProductDetailPage;
