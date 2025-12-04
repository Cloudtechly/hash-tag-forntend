import React, { useState } from 'react';
import AuctionHeader from '../../components/auction/AuctionHeader';

const AuctionVerificationPage = ({ onNext }: { onNext: () => void }) => {
    const [docType, setDocType] = useState('passport');

  return (
    <div className="min-h-screen bg-white">
      <AuctionHeader />
      <main className="p-6">
        <h2 className="text-xl font-bold mb-2">Personal verification</h2>
        <p className="text-sm text-gray-600 mb-6">
          Select the type of documentation you're submitting
        </p>
        
        <div className="space-y-3">
            <div onClick={() => setDocType('passport')} className={`flex justify-between items-center p-4 rounded-lg border ${docType === 'passport' ? 'border-orange-500 bg-orange-50' : 'border-gray-200'}`}>
                <label htmlFor="passport" className="font-semibold">Passport</label>
                <input type="radio" id="passport" name="docType" value="passport" checked={docType === 'passport'} onChange={() => {}} className="form-radio h-5 w-5 text-orange-600" />
            </div>
            <div onClick={() => setDocType('idcard')} className={`flex justify-between items-center p-4 rounded-lg border ${docType === 'idcard' ? 'border-orange-500 bg-orange-50' : 'border-gray-200'}`}>
                <label htmlFor="idcard" className="font-semibold">ID Card</label>
                <input type="radio" id="idcard" name="docType" value="idcard" checked={docType === 'idcard'} onChange={() => {}} className="form-radio h-5 w-5 text-orange-600" />
            </div>
        </div>

        <div className="border-2 border-dashed border-orange-300 rounded-2xl p-8 flex flex-col items-center text-center mt-8">
            <p className="font-bold text-gray-800">Add photo</p>
            <button
            type="button"
            className="bg-gray-200 text-gray-700 font-semibold px-6 py-2 rounded-lg mt-4"
            >
            Add photo
            </button>
        </div>

        <button onClick={onNext} className="w-full bg-[#E46A4B] text-white font-bold py-4 rounded-xl mt-8">
          Submit
        </button>
      </main>
    </div>
  );
};

export default AuctionVerificationPage;
