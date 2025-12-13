import React from 'react';
import { Balance, WalletActions, WalletHeader } from '../components/wallet/WalletInfo';
import TransactionHistory from '../components/wallet/TransactionHistory';

const WalletPage = () => {
  return (
    <div className="bg-white pb-24 max-w-7xl mx-auto min-h-screen ">
      <WalletHeader />
      <Balance  />
      <WalletActions />
      <TransactionHistory />
    </div>
  );
};

export default WalletPage;
