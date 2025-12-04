import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { IoIosArrowBack } from 'react-icons/io'
import fetchData from '../Api/FetchApi';



interface Category {
  id: number;
  name: string;
}

const InterestChip = ({ category, onSelect, isSelected }: { category: Category, onSelect: (id: number) => void, isSelected: boolean }) => (
  <button
    onClick={() => onSelect(category.id)}
    className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors
      ${isSelected
        ? 'bg-orange-100 text-orange-600 border-orange-300'
        : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'
      }`}
  >
    {isSelected && <span className="mr-2">×</span>}
    {category.name}
  </button>
);

export default function Interests() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetchData('customer/parent-categories') as any;
        setCategories(res.data);
      } catch (err) {
        // handle error
      }
    }
    fetchCategories();
  }, []);

  const toggleCategory = (id: number) => {
    setSelectedIds(prev =>
      prev.includes(id)
        ? prev.filter(i => i !== id)
        : [...prev, id]
    );
  };

  const handleContinue = async () => {
    if (selectedIds.length === 0) return;
    setLoading(true);
    try {
      await fetchData('customer/me/interests', 'POST', { category_ids: selectedIds });
      //go to home page 
      window.location.href = '/';

    } catch (err) {
      alert('Failed to save interests.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-2xl bg-white p-8 justify-center rounded-2xl shadow-lg">
        <div className="mb-8">
          <Link to="/" className="text-2xl text-gray-800">
            <IoIosArrowBack />
          </Link>
          <h1 className="mt-6 text-3xl font-bold text-gray-900">Improve your feed</h1>
          <p className="mt-2 text-lg text-gray-600">Let's find out your taste. What you're into?</p>
        </div>

        <div className="flex flex-wrap gap-3 mb-8 justify-center">
          {categories.map((category) => (
            <InterestChip
              key={category.id}
              category={category}
              onSelect={toggleCategory}
              isSelected={selectedIds.includes(category.id)}
            />
          ))}
        </div>

        <button
          className="w-full rounded-2xl bg-[#E46A4B] py-4 text-lg font-semibold text-white shadow-lg transition-transform active:scale-95 disabled:opacity-50"
          onClick={handleContinue}
          disabled={loading || selectedIds.length === 0}
        >
          {loading ? 'Saving...' : 'Continue'}
        </button>
      </div>
    </div>
  );
}
