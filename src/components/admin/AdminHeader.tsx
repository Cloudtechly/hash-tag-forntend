import React, { useState, useRef, useEffect } from 'react';
import { FiMenu, FiSearch, FiMoon, FiBell, FiChevronDown, FiUser, FiSettings, FiHelpCircle, FiLogOut } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const AdminHeader: React.FC<{ sidebarOpen: boolean; setSidebarOpen: (arg: boolean) => void }> = ({ sidebarOpen, setSidebarOpen }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const trigger = useRef<any>(null);
  const dropdown = useRef<any>(null);

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!dropdown.current) return;
      if (
        !dropdownOpen ||
        dropdown.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setDropdownOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!dropdownOpen || keyCode !== 27) return;
      setDropdownOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  return (
    <header className="sticky top-0 z-40 flex w-full bg-white drop-shadow-sm border-b border-gray-200">
      <div className="flex flex-grow items-center justify-between px-4 py-3 shadow-2 md:px-6 2xl:px-11">
        <div className="flex items-center gap-2 sm:gap-4 lg:hidden">
          {/* Hamburger Toggle BTN */}
          <button
            aria-controls="sidebar"
            onClick={(e) => {
              e.stopPropagation();
              setSidebarOpen(!sidebarOpen);
            }}
            className="z-99999 block rounded-sm border border-stroke bg-white p-1.5 shadow-sm lg:hidden"
          >
            <span className="relative block h-5.5 w-5.5 cursor-pointer">
              <span className="du-block absolute right-0 h-full w-full">
                <span
                  className={`relative top-0 left-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-[0] duration-200 ease-in-out  ${
                    !sidebarOpen && '!w-full delay-300'
                  }`}
                ></span>
                <span
                  className={`relative top-0 left-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-150 duration-200 ease-in-out  ${
                    !sidebarOpen && 'delay-400 !w-full'
                  }`}
                ></span>
                <span
                  className={`relative top-0 left-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-200 duration-200 ease-in-out  ${
                    !sidebarOpen && '!w-full delay-500'
                  }`}
                ></span>
              </span>
              <span className="absolute right-0 h-full w-full rotate-45">
                <span
                  className={`absolute left-2.5 top-0 block h-full w-0.5 rounded-sm bg-black delay-300 duration-200 ease-in-out  ${
                    !sidebarOpen && '!h-0 !delay-[0]'
                  }`}
                ></span>
                <span
                  className={`delay-400 absolute left-0 top-2.5 block h-0.5 w-full rounded-sm bg-black duration-200 ease-in-out  ${
                    !sidebarOpen && '!h-0 !delay-200'
                  }`}
                ></span>
              </span>
            </span>
          </button>
          {/* Hamburger Toggle BTN */}

          <button className="block lg:hidden">
             <FiMenu className="h-6 w-6" />
          </button>
        </div>

        <div className="hidden sm:block">
          <form action="https://formbold.com/s/unique_form_id" method="POST">
            <div className="relative">
              <button className="absolute left-3 top-1/2 -translate-y-1/2">
                <FiSearch className="text-gray-400 hover:text-primary text-lg" />
              </button>

              <input
                type="text"
                placeholder="Search or type command..."
                className="w-full bg-gray-50 rounded-lg border border-transparent pl-10 pr-4 py-2 font-medium focus:outline-none focus:bg-white focus:border-primary/20 transition-all xl:w-96"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden md:block">
                 <span className="border border-gray-300 rounded px-2 py-0.5 text-xs text-gray-500 bg-gray-50">⌘ K</span>
              </div>
            </div>
          </form>
        </div>

        <div className="flex items-center gap-3 2xsm:gap-7">
          <ul className="flex items-center gap-2 2xsm:gap-4">
            {/* Dark Mode Toggler */}
            <li>
                <button className="relative flex h-10 w-10 items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 hover:text-primary transition-colors">
                    <FiMoon className="text-xl" />
                </button>
            </li>
            {/* Dark Mode Toggler */}

            {/* Notification Menu Area */}
            <li className="relative">
              <button
                className="relative flex h-10 w-10 items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 hover:text-primary transition-colors"
              >
                <span className="absolute top-2 right-2 z-1 h-2 w-2 rounded-full bg-primary">
                  <span className="absolute -z-1 inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
                </span>
                <FiBell className="text-xl" />
              </button>
            </li>
            {/* Notification Menu Area */}
          </ul>

          {/* User Area */}
          <div className="relative">
            <Link
              ref={trigger}
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-4"
              to="#"
            >
              <span className="hidden text-right lg:block">
                <span className="block text-sm font-semibold text-gray-800">
                  Musharof
                </span>
                <span className="block text-xs text-gray-500">Admin</span>
              </span>

              <span className="h-10 w-10 rounded-full overflow-hidden border border-gray-200">
                <img src="https://i.pravatar.cc/150?u=musharof" alt="User" className="h-full w-full object-cover" />
              </span>
              
              <FiChevronDown className="hidden sm:block text-gray-500" />
            </Link>

            {/* Dropdown Start */}
            <div
              ref={dropdown}
              onFocus={() => setDropdownOpen(true)}
              onBlur={() => setDropdownOpen(false)}
              className={`absolute right-0 mt-4 flex w-64 flex-col rounded-lg border border-gray-100 bg-white shadow-lg transition-all duration-300 ${
                dropdownOpen === true ? 'opacity-100 translate-y-0 visible' : 'opacity-0 translate-y-2 invisible'
              }`}
            >
              <div className="px-6 py-4 border-b border-gray-100">
                 <h4 className="text-sm font-semibold text-gray-800">Musharof Chowdhury</h4>
                 <p className="text-xs text-gray-500">randomuser@pimjo.com</p>
              </div>
              <ul className="flex flex-col gap-1 border-b border-gray-100 p-2">
                <li>
                  <Link
                    to="/profile"
                    className="flex items-center gap-3.5 px-4 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-primary transition-colors"
                  >
                    <FiUser className="text-lg" />
                    Edit profile
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    className="flex items-center gap-3.5 px-4 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-primary transition-colors"
                  >
                    <FiSettings className="text-lg" />
                    Account settings
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    className="flex items-center gap-3.5 px-4 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-primary transition-colors"
                  >
                    <FiHelpCircle className="text-lg" />
                    Support
                  </Link>
                </li>
              </ul>
              <div className="p-2" onClick={()=>{
                // Add sign out logic here
                localStorage.clear();
                window.location.href = '/admin/login';
              }

              }>
                <button className="flex w-full items-center gap-3.5 px-4 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-red-50 hover:text-red-600 transition-colors">
                  <FiLogOut className="text-lg" />
                  Sign out
                </button>
              </div>
            </div>
            {/* Dropdown End */}
          </div>
          {/* User Area */}
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
