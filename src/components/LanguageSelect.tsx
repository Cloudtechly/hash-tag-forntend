import React, { useState } from 'react';

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'ar', name: 'Arabic' },
  { code: 'tr', name: 'Turkish' },
  { code: 'zh', name: 'Chinese' },
];

const LanguageSelect: React.FC<{
  value: string;
  onChange: (val: string) => void;
}> = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const selectedLabel = LANGUAGES.find(l => l.code === value)?.name || 'Select language';

  return (
    <>
      <button
        type="button"
        className="w-full p-3 rounded-xl border mt-2 bg-white text-left"
        onClick={() => setOpen(true)}
      >
        {selectedLabel}
      </button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-lg p-6 w-80 max-w-full relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl"
              onClick={() => setOpen(false)}
              aria-label="Close"
            >
              ×
            </button>
            <h2 className="text-lg font-bold mb-4">Select Language</h2>
            <ul className="space-y-2">
              {LANGUAGES.map(lang => (
                <li key={lang.code}>
                  <button
                    className={`w-full text-left px-4 py-2 rounded-lg ${value === lang.code ? 'bg-[#E46A4B] text-white' : 'hover:bg-gray-100'}`}
                    onClick={() => {
                      onChange(lang.code);
                      setOpen(false);
                    }}
                  >
                    {lang.name} <span className="text-xs text-gray-400">({lang.code})</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
};

export default LanguageSelect;
