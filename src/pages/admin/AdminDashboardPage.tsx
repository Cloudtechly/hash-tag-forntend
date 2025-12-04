import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import MonthlySalesChart from '../../components/admin/charts/MonthlySalesChart';
import StatisticsChart from '../../components/admin/charts/StatisticsChart';
import CustomersDemographicChart from '../../components/admin/charts/CustomersDemographicChart';
import RecentOrders from '../../components/admin/RecentOrders';
import fetchData from '../../Api/FetchApi';

const AdminDashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="flex h-screen overflow-hidden bg-gray-100 dark:bg-boxdark-2 pl-5">
      <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden xl:ml-[250px]">
        <AdminHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        {children}
      </div>
    </div>
  );
};

const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [statsError, setStatsError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetchData<any>('admin/system-settings?per_page=100');
        setStats(res);
      } catch (err: any) {
        setStatsError(err.message || 'Failed to fetch dashboard stats');
      }
    };
    fetchStats();
  }, []);

  return (
    <main className="w-full flex-grow p-6 ">
      {/* Example: Show stats JSON for debugging */}
      {statsError && <div className="text-red-500 mb-2">{statsError}</div>}
      {stats && <pre className="bg-gray-100 p-4 rounded mb-4 text-xs">{JSON.stringify(stats, null, 2)}</pre>}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        {/* Customers Card */}
        <div className="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
            <svg
              className="fill-primary dark:fill-white"
              width="22"
              height="22"
              viewBox="0 0 22 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12.4143 9.16666C12.8803 9.16666 13.2586 8.78832 13.2586 8.32232C13.2586 7.85632 12.8803 7.47799 12.4143 7.47799C11.9483 7.47799 11.57 7.85632 11.57 8.32232C11.57 8.78832 11.9483 9.16666 12.4143 9.16666Z"
                fill=""
              />
              <path
                d="M15.6986 10.6903C15.3546 10.6903 15.0106 10.5528 14.7701 10.2778C14.7013 10.209 14.6669 10.1059 14.6669 10.0028C14.6669 9.89966 14.7013 9.79653 14.7701 9.72778C14.8732 9.62466 15.0107 9.55591 15.1482 9.55591C15.2857 9.55591 15.4232 9.62466 15.5263 9.72778C15.6295 9.83091 15.767 9.89966 15.9045 9.89966C16.042 9.89966 16.1795 9.83091 16.2826 9.72778C16.3857 9.62466 16.4545 9.48716 16.4545 9.34966C16.4545 9.21216 16.3857 9.07466 16.2826 8.97153L14.5638 7.25278C14.2198 6.90872 14.2198 6.35872 14.5638 6.01466C14.9079 5.6706 15.4579 5.6706 15.8019 6.01466L17.5207 7.73341C18.0363 8.24903 18.0363 9.07403 17.5207 9.58966C17.0051 10.1053 16.1801 10.1053 15.6645 9.58966L15.6986 10.6903Z"
                fill=""
              />
              <path
                d="M9.58565 9.16666C10.0516 9.16666 10.43 8.78832 10.43 8.32232C10.43 7.85632 10.0516 7.47799 9.58565 7.47799C9.11965 7.47799 8.74132 7.85632 8.74132 8.32232C8.74132 8.78832 9.11965 9.16666 9.58565 9.16666Z"
                fill=""
              />
              <path
                d="M7.73341 10.6903C7.38935 10.6903 7.04529 10.5528 6.80466 10.2778C6.73591 10.209 6.70153 10.1059 6.70153 10.0028C6.70153 9.89966 6.73591 9.79653 6.80466 9.72778C6.90779 9.62466 7.04529 9.55591 7.18279 9.55591C7.32029 9.55591 7.45779 9.62466 7.56091 9.72778C7.66404 9.83091 7.80154 9.89966 7.93904 9.89966C8.07654 9.89966 8.21404 9.83091 8.31716 9.72778C8.42029 9.62466 8.48904 9.48716 8.48904 9.34966C8.48904 9.21216 8.42029 9.07466 8.31716 8.97153L6.59841 7.25278C6.25435 6.90872 6.25435 6.35872 6.59841 6.01466C6.94247 5.6706 7.49247 5.6706 7.83653 6.01466L9.55528 7.73341C10.0709 8.24903 10.0709 9.07403 9.55528 9.58966C9.03966 10.1053 8.21466 10.1053 7.69903 9.58966L7.73341 10.6903Z"
                fill=""
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M11 0C4.92487 0 0 4.92487 0 11C0 17.0751 4.92487 22 11 22C17.0751 22 22 17.0751 22 11C22 4.92487 17.0751 0 11 0ZM11 19.8C6.13989 19.8 2.2 15.8601 2.2 11C2.2 6.13989 6.13989 2.2 11 2.2C15.8601 2.2 19.8 6.13989 19.8 11C19.8 15.8601 15.8601 19.8 11 19.8Z"
                fill=""
              />
            </svg>
          </div>

          <div className="mt-4 flex items-end justify-between">
            <div>
              <h4 className="text-title-md font-bold text-black dark:text-white">
                3,782
              </h4>
              <span className="text-sm font-medium text-gray-500">Customers</span>
            </div>

            <span className="flex items-center gap-1 text-sm font-medium text-meta-3 text-green-500 bg-green-100 px-2 py-1 rounded-full">
              <svg
                className="fill-current"
                width="10"
                height="11"
                viewBox="0 0 10 11"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4.35716 2.47737L0.908974 5.82987L5.0443e-07 4.94612L5 0.0848689L10 4.94612L9.09103 5.82987L5.64284 2.47737L5.64284 10.0849L4.35716 10.0849L4.35716 2.47737Z"
                  fill=""
                />
              </svg>
              11.01%
            </span>
          </div>
        </div>

        {/* Orders Card */}
        <div className="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
            <svg
              className="fill-primary dark:fill-white"
              width="20"
              height="22"
              viewBox="0 0 20 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19.0002 2.5H14.0002V1.25C14.0002 0.5625 13.4377 0 12.7502 0H7.25024C6.56274 0 6.00024 0.5625 6.00024 1.25V2.5H1.00024C0.312744 2.5 -0.249756 3.0625 -0.249756 3.75V20.75C-0.249756 21.4375 0.312744 22 1.00024 22H19.0002C19.6877 22 20.2502 21.4375 20.2502 20.75V3.75C20.2502 3.0625 19.6877 2.5 19.0002 2.5ZM7.25024 1.25H12.7502V2.5H7.25024V1.25ZM18.7502 20.75H1.25024V3.75H6.00024V5H7.25024V3.75H12.7502V5H14.0002V3.75H18.7502V20.75Z"
                fill=""
              />
            </svg>
          </div>

          <div className="mt-4 flex items-end justify-between">
            <div>
              <h4 className="text-title-md font-bold text-black dark:text-white">
                5,359
              </h4>
              <span className="text-sm font-medium text-gray-500">Orders</span>
            </div>

            <span className="flex items-center gap-1 text-sm font-medium text-meta-3 text-green-500 bg-green-100 px-2 py-1 rounded-full">
              <svg
                className="fill-current"
                width="10"
                height="11"
                viewBox="0 0 10 11"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4.35716 2.47737L0.908974 5.82987L5.0443e-07 4.94612L5 0.0848689L10 4.94612L9.09103 5.82987L5.64284 2.47737L5.64284 10.0849L4.35716 10.0849L4.35716 2.47737Z"
                  fill=""
                />
              </svg>
              2.59%
            </span>
          </div>
        </div>

        {/* Monthly Target Card */}
        <div className="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
            <svg
              className="fill-primary dark:fill-white"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z"
                fill=""
              />
              <path
                d="M12 6C11.45 6 11 6.45 11 7V12C11 12.55 11.45 13 12 13C12.55 13 13 12.55 13 12V7C13 6.45 12.55 6 12 6Z"
                fill=""
              />
              <path
                d="M16.24 7.76C15.85 7.37 15.22 7.37 14.83 7.76L12 10.59L9.17 7.76C8.78 7.37 8.15 7.37 7.76 7.76C7.37 8.15 7.37 8.78 7.76 9.17L10.59 12L7.76 14.83C7.37 15.22 7.37 15.85 7.76 16.24C8.15 16.63 8.78 16.63 9.17 16.24L12 13.41L14.83 16.24C15.22 16.63 15.85 16.63 16.24 16.24C16.63 15.85 16.63 15.22 16.24 14.83L13.41 12L16.24 9.17C16.63 8.78 16.63 8.15 16.24 7.76Z"
                fill=""
              />
            </svg>
          </div>

          <div className="mt-4 flex items-end justify-between">
            <div>
              <h4 className="text-title-md font-bold text-black dark:text-white">
                $25,372
              </h4>
              <span className="text-sm font-medium text-gray-500">Monthly Target</span>
            </div>

            <span className="flex items-center gap-1 text-sm font-medium text-meta-3 text-red-500 bg-red-100 px-2 py-1 rounded-full">
              <svg
                className="fill-current"
                width="10"
                height="11"
                viewBox="0 0 10 11"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5.64284 7.52263L9.09103 4.17013L10 5.05388L5 9.91513L0 5.05388L0.908974 4.17013L4.35716 7.52263L4.35716 0.0848689H5.64284V7.52263Z"
                  fill=""
                />
              </svg>
              4.25%
            </span>
          </div>
        </div>
        
        {/* Total Sales Card */}
        <div className="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
            <svg
              className="fill-primary dark:fill-white"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z"
                fill=""
              />
              <path
                d="M12 6C11.45 6 11 6.45 11 7V12C11 12.55 11.45 13 12 13C12.55 13 13 12.55 13 12V7C13 6.45 12.55 6 12 6Z"
                fill=""
              />
            </svg>
          </div>

          <div className="mt-4 flex items-end justify-between">
            <div>
              <h4 className="text-title-md font-bold text-black dark:text-white">
                $468,372
              </h4>
              <span className="text-sm font-medium text-gray-500">Total Sales</span>
            </div>

            <span className="flex items-center gap-1 text-sm font-medium text-meta-3 text-green-500 bg-green-100 px-2 py-1 rounded-full">
              <svg
                className="fill-current"
                width="10"
                height="11"
                viewBox="0 0 10 11"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4.35716 2.47737L0.908974 5.82987L5.0443e-07 4.94612L5 0.0848689L10 4.94612L9.09103 5.82987L5.64284 2.47737L5.64284 10.0849L4.35716 10.0849L4.35716 2.47737Z"
                  fill=""
                />
              </svg>
              8.59%
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <StatisticsChart />
        <MonthlySalesChart />
        <CustomersDemographicChart />
        <RecentOrders />
      </div>
    </main>
  );
};

export { AdminDashboardLayout };
export default AdminDashboardPage;
