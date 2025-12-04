import React from 'react';

const TransactionHistory = () => {
  const transactions = [
    { date: '12/12/2023', amount: 'LYD 500.00', description: 'Funds added' },
    { date: '12/05/2023', amount: 'LYD 300.00', description: 'Funds added' },
  ];

  return (
    <div className="p-4 mt-4 bg-white">
      <h2 className="text-2xl font-bold mb-4">Transaction history</h2>
      <div className="space-y-4">
        {transactions.map((tx, index) => (
          <div key={index} className="flex justify-between items-center">
            <div>
              <p className="font-semibold">{tx.description}</p>
              <p className="text-sm text-red-400">{tx.date}</p>
            </div>
            <p className="font-bold">{tx.amount}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionHistory;
