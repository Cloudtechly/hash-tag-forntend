import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IoClose, IoChevronDown, IoChevronUp } from 'react-icons/io5';
import Header from '../components/home/Header';
import fetchData from '../Api/FetchApi';
import { useTranslation } from 'react-i18next';
import '../config/i18n';

interface Category {
  id: number;
  name: string;
}

interface SpecificationOption {
  id: number;
  value: string;
}

interface SpecificationKey {
  id: number;
  name: string;
  type: 'text' | 'select' | 'multiselect'; // Assuming type exists, or we infer from options
  options?: SpecificationOption[];
}

interface City {
  id: number;
  name: string;
}

export default function AddPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [listingType, setListingType] = useState('product');
  const [title, setTitle] = useState('');
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [cityId, setCityId] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [startingPrice, setStartingPrice] = useState('');
  const [startsAt, setStartsAt] = useState('');
  const [endsAt, setEndsAt] = useState('');
  
  // Store specifications as { keyId: { value: string, optionId: string } }
  const [specifications, setSpecifications] = useState<{ [key: number]: { value?: string, optionId?: string } }>({});
  const [specificationKeys, setSpecificationKeys] = useState<SpecificationKey[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const [parentCategories, setParentCategories] = useState<Category[]>([]);
  const [childCategories, setChildCategories] = useState<Category[]>([]);
  const [selectedParentId, setSelectedParentId] = useState('');
  const [cities, setCities] = useState<City[]>([]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [parentsRes, citiesRes] = await Promise.all([
          fetchData<{ data: Category[] }>('customer/parent-categories'),
          fetchData<{ data: City[] }>('customer/cities')
        ]);
        setParentCategories(parentsRes.data || []);
        setCities(citiesRes.data || []);
      } catch (error) {
        console.error('Error fetching initial data:', error);
      }
    };
    fetchInitialData();
  }, []);

  const handleParentChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const parentId = e.target.value;
    setSelectedParentId(parentId);
    setCategoryId(''); // Reset selected category
    setChildCategories([]); // Clear previous child categories

    if (parentId) {
      try {
        const response = await fetchData<{ data: Category[] }>(`customer/child-categories/${parentId}`);
        setChildCategories(response.data || []);
      } catch (error) {
        console.error('Error fetching child categories:', error);
      }
    }
  };

  const handleChildCategoryChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setCategoryId(id);
    setSpecificationKeys([]);
    setSpecifications({});
    
    if (id) {
      try {
        const response = await fetchData<{ data: SpecificationKey[] }>(`customer/categories/${id}/specification-keys`);
        setSpecificationKeys(response.data || []);
      } catch (error) {
        console.error('Error fetching specification keys:', error);
      }
    }
  };

  const uploadImages = async (files: File[]) => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files[]', file);
    });
    formData.append('purpose', 'adimage');
    
    try {
      const data = await fetchData('customer/media/uploads', 'POST', formData) as any;
      console.log('Upload response:', data); // Debug log

      if (data?.data && Array.isArray(data.data)) {
         return data.data.map((item: any) => item.id);
      }
      // Check for 'media' property based on user feedback
      if (data?.media && Array.isArray(data.media)) {
        return data.media.map((item: any) => item.id);
      }
      // Fallback if structure is different (e.g. data.assets)
      if (data?.assets && Array.isArray(data.assets)) {
        return data.assets.map((item: any) => item.id);
      }
      
      return [];
    } catch (e) {
      console.error("Upload failed", e);
      return [];
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    if (images.length === 0) {
      setError("Please select at least one image.");
      setLoading(false);
      return;
    }

    try {
      // 1. Upload Images
      const mediaIds = await uploadImages(images);

      if (mediaIds.length === 0) {
        setError("Image upload failed. Please try again.");
        setLoading(false);
        return;
      }

      // 2. Prepare Specifications
      const specsPayload = Object.entries(specifications).map(([keyId, val]) => {
        const payload: any = { specification_key_id: Number(keyId) };
        if (val.optionId) {
          payload.specification_option_id = Number(val.optionId);
        } else {
          payload.value = val.value;
        }
        return payload;
      });

      // 3. Construct Payload
      const payload = {
        title,
        name,
        category_id: Number(categoryId),
        description,
        price: Number(price),
        city_id: Number(cityId),
        media_ids: mediaIds,
        specifications: specsPayload,
        listing_type: listingType,
        ...(listingType === 'auction' && {
          starting_price: Number(startingPrice),
          starts_at: startsAt,
          ends_at: endsAt,
        })
      };

      await fetchData('customer/products', 'POST', payload);
      setSuccess(true);
      setTimeout(() => navigate('/'), 2000);
    } catch (err: any) {
      setError(err.message || t('add_error', 'Error adding product'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
     
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden border border-gray-100">
          
          {/* Header */}
          <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-white">
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900">{t('add_list_item', 'List an Item')}</h1>
              <p className="text-gray-500 text-sm mt-1">{t('add_fill_details', 'Fill in the details to publish your listing')}</p>
            </div>
            <Link to="/" className="p-3 hover:bg-gray-50 rounded-full transition-colors group">
              <IoClose className="text-2xl text-gray-400 group-hover:text-gray-600" />
            </Link>
          </div>

          <form className="p-8" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              
              {/* Left Column: Main Info (8 cols) */}
              <div className="lg:col-span-8 space-y-8">
                
                {/* Listing Type */}
                <section>
                  <label className="block text-sm font-bold text-gray-700 mb-4">{t('add_listing_type_question', 'What type of listing is this?')}</label>
                  <div className="grid grid-cols-2 gap-4">
                    <div 
                      onClick={() => setListingType('product')}
                      className={`cursor-pointer relative overflow-hidden p-5 rounded-2xl border-2 transition-all duration-200 ${listingType === 'product' ? 'border-[#E46A4B] bg-orange-50' : 'border-gray-100 hover:border-gray-200 bg-white'}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${listingType === 'product' ? 'border-[#E46A4B]' : 'border-gray-300'}`}>
                          {listingType === 'product' && <div className="w-2.5 h-2.5 rounded-full bg-[#E46A4B]" />}
                        </div>
                        <span className={`font-bold text-lg ${listingType === 'product' ? 'text-[#E46A4B]' : 'text-gray-600'}`}>{t('add_fixed_price', 'Fixed Price')}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-2 ml-8">{t('add_fixed_price_desc', 'Sell at a set price')}</p>
                    </div>

                    <div 
                      onClick={() => setListingType('auction')}
                      className={`cursor-pointer relative overflow-hidden p-5 rounded-2xl border-2 transition-all duration-200 ${listingType === 'auction' ? 'border-[#E46A4B] bg-orange-50' : 'border-gray-100 hover:border-gray-200 bg-white'}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${listingType === 'auction' ? 'border-[#E46A4B]' : 'border-gray-300'}`}>
                          {listingType === 'auction' && <div className="w-2.5 h-2.5 rounded-full bg-[#E46A4B]" />}
                        </div>
                        <span className={`font-bold text-lg ${listingType === 'auction' ? 'text-[#E46A4B]' : 'text-gray-600'}`}>{t('add_auction', 'Auction')}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-2 ml-8">{t('add_auction_desc', 'Let buyers bid on your item')}</p>
                    </div>
                  </div>
                </section>

                {/* Basic Details */}
                <section className="space-y-5">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <span className="w-1 h-6 bg-[#E46A4B] rounded-full"></span>
                    {t('add_basic_details', 'Basic Details')}
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">{t('add_title', 'Title')}</label>
                      <input
                        type="text"
                        placeholder={t('add_title_placeholder', 'What are you selling?')}
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        className="w-full rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-orange-300 focus:ring-4 focus:ring-orange-100 px-5 py-4 text-gray-900 placeholder-gray-400 outline-none transition-all font-medium"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">{t('add_contact_name', 'Contact Name')}</label>
                      <input
                        type="text"
                        placeholder={t('add_contact_name_placeholder', 'Your Name')}
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="w-full rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-orange-300 focus:ring-4 focus:ring-orange-100 px-5 py-4 text-gray-900 placeholder-gray-400 outline-none transition-all"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">{t('add_city', 'City')}</label>
                      <div className="relative">
                        <select
                          value={cityId}
                          onChange={(e) => setCityId(e.target.value)}
                          className="w-full appearance-none rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-orange-300 focus:ring-4 focus:ring-orange-100 px-5 py-4 text-gray-900 outline-none transition-all"
                          required
                        >
                          <option value="">{t('add_select_city', 'Select City')}</option>
                          {cities.map((city) => (
                            <option key={city.id} value={city.id}>{city.name}</option>
                          ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex flex-col justify-center px-5 text-gray-400">
                          <IoChevronUp size={12} />
                          <IoChevronDown size={12} className="-mt-0.5" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">{t('add_description', 'Description')}</label>
                    <textarea
                      placeholder={t('add_description_placeholder', 'Describe your item in detail...')}
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                      rows={6}
                      className="w-full rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-orange-300 focus:ring-4 focus:ring-orange-100 px-5 py-4 text-gray-900 placeholder-gray-400 outline-none transition-all resize-none"
                      required
                    ></textarea>
                  </div>
                </section>

                {/* Categories & Specs */}
                <section className="space-y-5">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <span className="w-1 h-6 bg-[#E46A4B] rounded-full"></span>
                    {t('add_category_specs', 'Category & Specifications')}
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">{t('add_parent_category', 'Parent Category')}</label>
                      <div className="relative">
                        <select
                          value={selectedParentId}
                          onChange={handleParentChange}
                          className="w-full appearance-none rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-orange-300 focus:ring-4 focus:ring-orange-100 px-5 py-4 text-gray-900 outline-none transition-all"
                          required
                        >
                          <option value="">{t('add_select_category', 'Select Category')}</option>
                          {parentCategories.map((cat) => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                          ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex flex-col justify-center px-5 text-gray-400">
                          <IoChevronUp size={12} />
                          <IoChevronDown size={12} className="-mt-0.5" />
                        </div>
                      </div>
                    </div>

                    {childCategories.length > 0 && (
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">{t('add_sub_category', 'Sub Category')}</label>
                        <div className="relative">
                          <select
                            value={categoryId}
                            onChange={handleChildCategoryChange}
                            className="w-full appearance-none rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-orange-300 focus:ring-4 focus:ring-orange-100 px-5 py-4 text-gray-900 outline-none transition-all"
                            required
                          >
                            <option value="">{t('add_select_subcategory', 'Select Sub Category')}</option>
                            {childCategories.map((cat) => (
                              <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex flex-col justify-center px-5 text-gray-400">
                            <IoChevronUp size={12} />
                            <IoChevronDown size={12} className="-mt-0.5" />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {specificationKeys.length > 0 && (
                    <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
                      <h4 className="font-bold text-gray-800 text-sm uppercase tracking-wider mb-2">{t('add_specifics', 'Specifics')}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {specificationKeys.map((key) => (
                          <div key={key.id}>
                            <label className="block text-xs font-bold text-gray-500 mb-1.5 capitalize">{key.name}</label>
                            {key.options && key.options.length > 0 ? (
                              <div className="relative">
                                <select
                                  value={specifications[key.id]?.optionId || ''}
                                  onChange={(e) => setSpecifications({ 
                                    ...specifications, 
                                    [key.id]: { optionId: e.target.value } 
                                  })}
                                  className="w-full appearance-none rounded-xl bg-white border border-gray-200 focus:border-orange-300 focus:ring-2 focus:ring-orange-100 px-4 py-3 text-gray-900 outline-none transition-all text-sm"
                                >
                                  <option value="">{t('add_select_generic', 'Select')} {key.name}</option>
                                  {key.options.map(opt => (
                                    <option key={opt.id} value={opt.id}>{opt.value}</option>
                                  ))}
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex flex-col justify-center px-4 text-gray-400">
                                  <IoChevronUp size={10} />
                                  <IoChevronDown size={10} className="-mt-0.5" />
                                </div>
                              </div>
                            ) : (
                              <input
                                type="text"
                                placeholder={`${t('add_enter_generic', 'Enter')} ${key.name}`}
                                value={specifications[key.id]?.value || ''}
                                onChange={(e) => setSpecifications({ 
                                  ...specifications, 
                                  [key.id]: { value: e.target.value } 
                                })}
                                className="w-full rounded-xl bg-white border border-gray-200 focus:border-orange-300 focus:ring-2 focus:ring-orange-100 px-4 py-3 text-gray-900 outline-none transition-all text-sm"
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </section>
              </div>

              {/* Right Column: Price & Media (4 cols) */}
              <div className="lg:col-span-4 space-y-8">
                
                {/* Price Card */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">{t('add_pricing', 'Pricing')}</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">{t('add_price', 'Price')}</label>
                      <div className="relative">
                        <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
                        <input
                          type="number"
                          placeholder={t('add_price_placeholder', '0.00')}
                          value={price}
                          onChange={e => setPrice(e.target.value)}
                          className="w-full rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-orange-300 focus:ring-4 focus:ring-orange-100 pl-10 pr-5 py-4 text-gray-900 font-bold outline-none transition-all"
                          required
                        />
                      </div>
                    </div>

                    {listingType === 'auction' && (
                      <>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">{t('add_starting_price', 'Starting Price')}</label>
                          <div className="relative">
                            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
                            <input
                              type="number"
                              placeholder={t('add_price_placeholder', '0.00')}
                              value={startingPrice}
                              onChange={e => setStartingPrice(e.target.value)}
                              className="w-full rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-orange-300 focus:ring-4 focus:ring-orange-100 pl-10 pr-5 py-4 text-gray-900 font-bold outline-none transition-all"
                              required
                            />
                          </div>
                        </div>
                        <div className="space-y-4 pt-2">
                          <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">{t('add_starts_at', 'Starts At')}</label>
                            <input
                              type="datetime-local"
                              value={startsAt}
                              onChange={e => setStartsAt(e.target.value)}
                              className="w-full rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-orange-300 px-4 py-3 text-sm"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">{t('add_ends_at', 'Ends At')}</label>
                            <input
                              type="datetime-local"
                              value={endsAt}
                              onChange={e => setEndsAt(e.target.value)}
                              className="w-full rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-orange-300 px-4 py-3 text-sm"
                              required
                            />
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Photos Card */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">{t('add_photos', 'Photos')}</h3>
                  <div className="border-2 border-dashed border-orange-200 bg-orange-50/50 rounded-2xl p-6 flex flex-col items-center text-center transition-colors hover:bg-orange-50 hover:border-orange-300">
                    <div className="w-12 h-12 bg-orange-100 text-[#E46A4B] rounded-full flex items-center justify-center mb-3">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    </div>
                    <p className="font-bold text-gray-800">{t('add_upload_images', 'Upload Images')}</p>
                    <p className="text-xs text-gray-500 mb-4 mt-1">{t('add_supported_formats', 'Supported: JPG, PNG')}</p>
                    <label className="cursor-pointer bg-white border border-orange-200 text-[#E46A4B] font-bold py-2 px-4 rounded-xl text-sm hover:bg-orange-50 transition-colors shadow-sm">
                      {t('add_choose_files', 'Choose Files')}
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={e => {
                          if (e.target.files) {
                            setImages(Array.from(e.target.files));
                          }
                        }}
                        className="hidden"
                      />
                    </label>
                  </div>
                  
                  {images.length > 0 && (
                    <div className="mt-4 grid grid-cols-3 gap-2">
                      {images.map((img, idx) => (
                        <div key={idx} className="relative aspect-square bg-gray-100 rounded-xl overflow-hidden border border-gray-200">
                          <img 
                            src={URL.createObjectURL(img)} 
                            alt="preview" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full rounded-2xl bg-[#E46A4B] py-4 text-lg font-bold text-white shadow-lg shadow-orange-200 transition-all hover:shadow-xl hover:-translate-y-0.5 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      {t('add_processing', 'Processing...')}
                    </span>
                  ) : t('add_publish_listing', 'Publish Listing')}
                </button>

                {error && (
                  <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm text-center font-medium border border-red-100">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="bg-green-50 text-green-600 p-4 rounded-xl text-sm text-center font-bold border border-green-100">
                    {t('add_success', 'Product added successfully!')}
                  </div>
                )}

              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
