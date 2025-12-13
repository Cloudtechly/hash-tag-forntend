import React, { useRef, useState } from 'react';
import fetchData from '../../Api/FetchApi';
import AuctionHeader from '../../components/auction/AuctionHeader';

const AuctionVerificationPage = ({ onNext }: { onNext: () => void }) => {
  const [docType, setDocType] = useState('passport');
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
    // Upload image and submit verification
    const uploadImage = async (file: File) => {
      const formData = new FormData();
      formData.append('files[]', file);
      formData.append('purpose', 'personal_document');
      const data = await fetchData('customer/media/uploads', 'POST', formData) as any;
      if (data?.media && Array.isArray(data.media) && data.media.length > 0) {
        return data.media[0].id;
      }
      return null;
    };

    const submitAuctionVerification = async (imageAssetId: string) => {
      // You may want to include docType in the body if required by backend
      const body = { personal_document: imageAssetId ,personal_document_type : docType =='2' ? "passport":"passport"   };
      return await fetchData('customer/auction-verification', 'POST', body);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const selected = e.target.files?.[0] || null;
      if (selected && !selected.type.startsWith('image/')) {
        setError('Only image files are allowed.');
        setFile(null);
      } else {
        setError(null);
        setFile(selected);
      }
    };

    const handleUpload = async () => {
      if (!file) {
        setError('Please select an image file.');
        return;
      }
      setUploading(true);
      setError(null);
      try {
        const imageAssetId = await uploadImage(file);
        if (!imageAssetId) {
          setError('Failed to upload file.');
          setUploading(false);
          return;
        }
        await submitAuctionVerification(imageAssetId);
        setUploading(false);
        onNext();
      } catch (err: any) {
        setError(err?.message || 'An error occurred.');
        setUploading(false);
      }
    };

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
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="mb-2 mt-4"
            />
            {file && <div className="mb-2 text-green-600">Selected: {file.name}</div>}
            {error && <div className="mb-2 text-red-500">{error}</div>}
        </div>

        <button
          onClick={handleUpload}
          className="w-full bg-[#E46A4B] text-white font-bold py-4 rounded-xl mt-8"
          disabled={uploading}
        >
          {uploading ? 'Uploading...' : 'Submit'}
        </button>
      </main>
    </div>
  );
};

export default AuctionVerificationPage;
