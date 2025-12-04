import React from 'react';
import { IoSearchOutline } from 'react-icons/io5';
import { FiSliders, FiX } from 'react-icons/fi';

interface SearchBarWithFilterProps {
    onFilterClick: () => void;
}

const SearchBarWithFilter: React.FC<SearchBarWithFilterProps> = ({ onFilterClick }) => {
    return (
        <div className="relative">
            <input
                type="text"
                placeholder="Search"
                className="w-full bg-pink-50 rounded-xl px-12 py-4 text-gray-700 placeholder-gray-400 outline-none focus:ring-2 focus:ring-orange-400"
            />
            <IoSearchOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl text-gray-400" />
            <button onClick={onFilterClick} className="absolute right-14 top-1/2 -translate-y-1/2 bg-orange-500 text-white p-2 rounded-lg">
                <FiSliders size={20} />
            </button>
            <button onClick={
                // go back to previous page
                () => window.history.back()
            } className="absolute top-4 right-4 text-gray-500">
                <FiX size={24} />
            </button>
        </div>
    );
};

export default SearchBarWithFilter;
