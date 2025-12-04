import React from 'react';
import { Balance, WalletActions, WalletHeader } from '../components/wallet/WalletInfo';
import TransactionHistory from '../components/wallet/TransactionHistory';

const WalletPage = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <WalletHeader />
      <Balance  />
      <WalletActions />
      <TransactionHistory />
    </div>
  );
};

export default WalletPage;
