import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FiGrid,
  FiCpu,
  FiShoppingCart,
  FiCalendar,
  FiUser,
  FiClipboard,
  FiLayout,
  FiList,
  FiFileText,
  FiMessageSquare,
  FiChevronDown,
  FiChevronUp,
  FiPackage,
  FiSettings
} from 'react-icons/fi';
import { BsFillMegaphoneFill } from 'react-icons/bs';
import { CiBoxList } from 'react-icons/ci';
import { MdMoney } from 'react-icons/md';
import { FaMoneyBill } from 'react-icons/fa6';
import { FaGlobe } from 'react-icons/fa';
import { FaCity } from 'react-icons/fa';
import { FaExchangeAlt } from 'react-icons/fa';
import { FaGavel } from 'react-icons/fa';

interface AdminSidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

interface SidebarItemProps {
  item: {
    name: string;
    icon: React.ReactNode;
    path?: string;
    children?: { name: string; path: string; badge?: string }[];
    badge?: string;
    isNew?: boolean;
  };
  isOpen: boolean;
  onToggle: () => void;
  pathname: string;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ item, isOpen, onToggle, pathname }) => {
  const isActive = item.path ? pathname === item.path : item.children?.some(child => pathname === child.path);

  return (
    <li>
      <div
        className={`group relative flex items-center gap-2.5 rounded-lg px-4 py-2 font-medium duration-300 ease-in-out cursor-pointer
          ${isActive 
            ? 'bg-primary/10 text-primary' 
            : 'text-gray-600 hover:bg-gray-50 hover:text-primary'
          }`}
      >
        <span className="text-xl">{item.icon}</span>

        {item.children ? (
          <button onClick={(e) => { e.preventDefault(); onToggle(); }} className="flex w-full items-center justify-between">
            <span>{item.name}</span>
            <div className="flex items-center gap-2">
              {isOpen ? <FiChevronUp /> : <FiChevronDown />}
            </div>
          </button>
        ) : (
          <Link to={item.path || '#'} className="flex w-full items-center justify-between">
            <span className="flex items-center gap-2.5">{item.name}</span>
            {item.isNew && (
              <span className="rounded bg-primary/10 px-1.5 py-0.5 text-xs font-medium text-primary">
                NEW
              </span>
            )}
          </Link>
        )}
      </div>

      {item.children && (
        <div className={`translate transform overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
          <ul className="mt-2 mb-2 flex flex-col gap-1 pl-9">
            {item.children.map((child, index) => (
              <li key={index}>
                <Link
                  to={child.path}
                  className={`group relative flex items-center gap-2.5 rounded-md px-4 py-1 font-medium duration-300 ease-in-out hover:text-primary 
                    ${pathname === child.path ? 'text-primary' : 'text-gray-500'}`}
                >
                  {child.name}
                  {child.badge && (
                    <span className="ml-auto rounded bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                      {child.badge}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </li>
  );
};

const AdminSidebar: React.FC<AdminSidebarProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const location = useLocation();
  const [openIndex, setOpenIndex] = useState<number | null>(2); // Default open E-commerce

  const menuGroups = [
    {
      name: 'MENU',
      items: [
        {
          name: 'Dashboard',
          icon: <FiGrid />,
          children: [
            { name: 'eCommerce', path: '/admin' },
            { name: 'Analytics', path: '/admin/analytics' },
          ]
        },
        // {
        //   name: 'AI Assistant',
        //   icon: <FiCpu />,
        //   isNew: true,
        //   children: [
        //     { name: 'Chat', path: '/admin/ai/chat' },
        //     { name: 'Generator', path: '/admin/ai/generator' },
        //   ]
        // },
        {
          name: 'Customers',
          icon: <FiUser />,
          path: '/admin/customers',
        }
        , {
          name: 'Products',
          icon: <FiShoppingCart />,
          path: '/admin/products',
        },
        {
          name: 'Categories',
          icon: <CiBoxList />,
          path: '/admin/categories',

        },
        {
          name: 'Ads Management',
          icon: <BsFillMegaphoneFill />,
          path: '/admin/ads',
        },
        {
          name: 'Packages',
          icon: <FiPackage />,
          path: '/admin/packages',
        },
        {
          name: 'Languages',
          icon: <FiFileText />,
          path: '/admin/languages',
        },
        {
          name: 'Currencies',
          icon: <FaMoneyBill/>,
          path: '/admin/currencies',
        },
        {
          name: 'Countries',
          icon: <FaGlobe />,
          path: '/admin/countries',
        },
        {
          name: 'Cities',
          icon: <FaCity />,
          path: '/admin/cities',
        },
        {
          name: 'Transactions',
          icon: <FaExchangeAlt />,
          path: '/admin/owner-transactions',
        },
        {
          name: 'Auctions',
          icon: <FaGavel />,
          path: '/admin/auctions',
        },
        
        // {
        //   name: 'Billing',
        //   icon: <FiShoppingCart />,
        //   isNew: true,
        //   children: [
        //     { name: 'Products', path: '/products-list' },
        //     { name: 'Add Product', path: '/add-product' },
        //     { name: 'Billing', path: '/billing' },
        //     { name: 'Invoices', path: '/invoices' },
        //     { name: 'Single Invoice', path: '/single-invoice' },
        //     { name: 'Create Invoice', path: '/create-invoice' },
        //     { name: 'Transactions', path: '/transactions' },
        //     { name: 'Single Transaction', path: '/single-transaction' },
        //   ]
        // },
        // {
        //   name: 'Calendar',
        //   icon: <FiCalendar />,
        //   path: '/calendar'
        // },
        // {
        //   name: 'User Profile',
        //   icon: <FiUser />,
        //   path: '/profile'
        // },
        // {
        //   name: 'Task',
        //   icon: <FiClipboard />,
        //   children: [
        //     { name: 'List', path: '/tasks/list' },
        //     { name: 'Kanban', path: '/tasks/kanban' },
        //   ]
        // },
        // {
        //   name: 'Forms',
        //   icon: <FiLayout />,
        //   children: [
        //     { name: 'Form Elements', path: '/forms/elements' },
        //     { name: 'Form Layout', path: '/forms/layout' },
        //   ]
        // },
        // {
        //   name: 'Tables',
        //   icon: <FiList />,
        //   children: [
        //     { name: 'Tables', path: '/tables' },
        //   ]
        // },
        // {
        //   name: 'Pages',
        //   icon: <FiFileText />,
        //   children: [
        //     { name: 'Settings', path: '/settings' },
        //     { name: 'FileManager', path: '/file-manager' },
        //   ]
        // },
      ]
    },
    {
      name: 'SUPPORT',
      items: [
        {
          name: 'System Settings',
          icon: <FiSettings />,
          path: '/admin/system-settings',
        },
        {
          name: 'Chat',
            isNew: true,
          icon: <FiMessageSquare />,
          path: '/chat'
        }
      ]
    }
  ];

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <>
      <aside className={`fixed flex flex-col w-72 top-0 left-0 bg-white h-screen transition-transform duration-300 ease-in-out z-50 border-r border-gray-200 shadow-lg ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} xl:translate-x-0 overflow-y-auto no-scrollbar`}>
        <div className="py-6 flex justify-start items-center gap-3 px-6 border-b border-gray-100">
          <div className="bg-primary/10 text-primary p-2 rounded-lg">
            <img src="/images/logo.png" alt="Logo" className="w-6 h-6" />
          </div>
          <span className="text-xl font-bold text-gray-800">
            Admin Panel
          </span>

          <button
            className="text-gray-500 hover:text-primary ml-auto xl:hidden"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
          >
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-x">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="flex flex-col duration-300 ease-linear">
          <nav className="mt-5 py-4 px-4 lg:mt-6 lg:px-4">
            {menuGroups.map((group, groupIndex) => (
              <div key={groupIndex} className="mb-6">
                <h3 className="mb-3 ml-4 text-xs font-bold text-gray-400 uppercase tracking-wider">{group.name}</h3>
                <ul className="mb-6 flex flex-col gap-1.5">
                  {group.items.map((item, itemIndex) => {
                    const globalIndex = groupIndex * 100 + itemIndex;
                    return (
                      <SidebarItem
                        key={itemIndex}
                        item={item}
                        isOpen={openIndex === globalIndex}
                        onToggle={() => handleToggle(globalIndex)}
                        pathname={location.pathname}
                      />
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
