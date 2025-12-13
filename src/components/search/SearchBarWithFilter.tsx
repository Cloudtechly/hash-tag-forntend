import React, { useState } from 'react';
import { IoSearchOutline } from 'react-icons/io5';
import { FiSliders, FiX } from 'react-icons/fi';

interface SearchBarWithFilterProps {
    onFilterClick: () => void;
    onSearch?: (query: string) => void;
}

const SearchBarWithFilter: React.FC<SearchBarWithFilterProps> = ({ onFilterClick, onSearch }) => {
    const [input, setInput] = useState('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && onSearch) {
            onSearch(input.trim());
        }
    };

    return (
        <div className="relative">
            <input
                type="text"
                placeholder="Search"
                className="w-full bg-pink-50 rounded-xl px-12 py-4 text-gray-700 placeholder-gray-400 outline-none focus:ring-2 focus:ring-orange-400"
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
            />
            <IoSearchOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl text-gray-400" />
            <button onClick={onFilterClick} className="absolute right-14 top-1/2 -translate-y-1/2 bg-orange-500 text-white p-2 rounded-lg">
                <FiSliders size={20} />
            </button>
            <button onClick={() => window.history.back()} className="absolute top-4 right-4 text-gray-500">
                <FiX size={24} />
            </button>
        </div>
    );
};

export default SearchBarWithFilter;
