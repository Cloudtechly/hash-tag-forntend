import React from 'react';
import { FiArrowLeft, FiEye, FiStar } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const WalletHeader = () => {
        const navigate = useNavigate();
  return (
    <div className="flex justify-between items-center p-4 bg-white">
      <button>
        <FiArrowLeft size={24} onClick={()=>{
            navigate(-1);
        }} />
      </button>
      <h1 className="text-xl font-bold">Wallet</h1>
      <div className="w-6"></div>
    </div>
  );
};

const Balance = () => {
  return (
    <div className="p-4 bg-white">
      <h2 className="text-2xl font-bold mb-2">Balance</h2>
      <div className="flex justify-between items-center mb-4">
        <p className="text-2xl">LYD 1,234.56</p>
        <button className="text-orange-500">
          <FiEye size={24} />
        </button>
      </div>
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-500">Subscription Package</p>
          <p className="font-bold text-orange-500">Gold Package</p>
        </div>
        <button className="text-orange-500">
          <FiStar size={24} />
        </button>
      </div>
    </div>
  );
};

const WalletActions = () => {
    const navigate = useNavigate();
    return (
        <div className="flex justify-center gap-4 p-4 bg-white">
            <button className="bg-orange-500 text-white font-bold py-3 px-8 rounded-lg shadow-md">
                Add funds
            </button>
            <button 
            onClick={
                ()=>navigate('/membership')
            }
            className="bg-orange-200 text-orange-800 font-bold py-3 px-8 rounded-lg shadow-md">
                Adjust Membership
            </button>
        </div>
    )
}

export { WalletHeader, Balance, WalletActions };
