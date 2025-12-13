import React, { useRef, useState } from 'react';
import fetchData from '../../Api/FetchApi';

interface Props {
  onNext: () => void;
}

const AuctionTradingLicenseUploadPage: React.FC<Props> = ({ onNext }) => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] || null;
    if (selected && selected.type !== 'application/pdf') {
      setError('Only PDF files are allowed.');
      setFile(null);
    } else {
      setError(null);
      setFile(selected);
    }
  };

  // Upload image and submit auction verification
  const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append('files[]', file);
    formData.append('purpose', 'trading_license');
    const data = await fetchData('customer/media/uploads', 'POST', formData) as any;
    if (data?.assets && Array.isArray(data.assets) && data.assets.length > 0) {
      return data.assets[0].id;
    }
    return null;
  };

  const submitAuctionVerification = async (imageAssetId: string) => {
    const body = { trading_license: imageAssetId };
    return await fetchData('customer/auction-verification', 'POST', body);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a PDF file.');
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <form onSubmit={handleUpload} className="bg-white rounded-2xl shadow p-8 max-w-md w-full flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-4 text-center">Upload Trading License (PDF)</h1>
        <p className="mb-6 text-gray-600 text-center">Please upload your trading license PDF and complete personal verification to continue.</p>
        <input
          type="file"
          accept="application/pdf"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="mb-4"
        />
        {file && <div className="mb-2 text-green-600">Selected: {file.name}</div>}
        {error && <div className="mb-2 text-red-500">{error}</div>}
        <button
          type="submit"
          className="bg-[#E46A4B] text-white font-bold px-6 py-2 rounded-xl mt-2 w-full"
          disabled={uploading}
        >
          {uploading ? 'Uploading...' : 'Submit & Continue'}
        </button>
      </form>
    </div>
  );
};

export default AuctionTradingLicenseUploadPage;
