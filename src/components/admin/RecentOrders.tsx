import React from 'react';

const orders = [
  {
    product: 'MacBook Pro 13"',
    category: 'Laptop',
    price: '$2399.00',
    status: 'Delivered',
    variants: 2,
    img: 'https://via.placeholder.com/40'
  },
  {
    product: 'Apple Watch Ultra',
    category: 'Watch',
    price: '$879.00',
    status: 'Pending',
    variants: 1,
    img: 'https://via.placeholder.com/40'
  },
  {
    product: 'iPhone 15 Pro Max',
    category: 'SmartPhone',
    price: '$1869.00',
    status: 'Delivered',
    variants: 2,
    img: 'https://via.placeholder.com/40'
  },
  {
    product: 'iPad Pro 3rd Gen',
    category: 'Electronics',
    price: '$1699.00',
    status: 'Canceled',
    variants: 2,
    img: 'https://via.placeholder.com/40'
  },
];

const RecentOrders: React.FC = () => {
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-100 text-green-600';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-600';
      case 'Canceled':
        return 'bg-red-100 text-red-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white p-7.5 shadow-default  xl:col-span-5">
      <div className="mb-4 justify-between gap-4 sm:flex">
        <h4 className="text-xl font-bold text-black ">
          Recent Orders
        </h4>
        <div className="flex items-center gap-2">
            <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">Filter</button>
            <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">See all</button>
        </div>
      </div>

      <div className="w-full overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 ">
              <th className="py-4 px-4 font-medium text-black ">
                Products
              </th>
              <th className="py-4 px-4 font-medium text-black ">
                Category
              </th>
              <th className="py-4 px-4 font-medium text-black ">
                Price
              </th>
              <th className="py-4 px-4 font-medium text-black ">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr key={index} className="border-b border-gray-200 ">
                <td className="py-5 px-4">
                  <div className="flex items-center gap-4">
                    <img src={order.img} alt={order.product} className="h-10 w-10 rounded-md" />
                    <div>
                      <p className="font-medium text-black ">{order.product}</p>
                      <p className="text-sm text-gray-500">{order.variants} Variants</p>
                    </div>
                  </div>
                </td>
                <td className="py-5 px-4">
                  <p className="text-black ">{order.category}</p>
                </td>
                <td className="py-5 px-4">
                  <p className="text-black ">{order.price}</p>
                </td>
                <td className="py-5 px-4">
                  <p className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${getStatusClass(order.status)}`}>
                    {order.status}
                  </p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentOrders;
