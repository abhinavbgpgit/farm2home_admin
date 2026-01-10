import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

function LeftBar() {
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={`bg-gray-100 p-4 flex flex-col h-full transition-all duration-300 ease-in-out ${
      isCollapsed ? 'w-20' : 'w-64'
    }`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className={`text-lg font-bold transition-opacity duration-300 ${
          isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'
        }`}>
          Navigation
        </h2>
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg hover:bg-gray-200 transition-all duration-200 hover:scale-110 active:scale-95"
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          <svg
            className={`w-5 h-5 text-gray-700 transition-transform duration-300 ${
              isCollapsed ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
            />
          </svg>
        </button>
      </div>
      <ul className="space-y-2 flex-1">
        <li>
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex items-center ${isCollapsed ? 'justify-center' : ''} px-4 py-2 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-green-600 text-white font-semibold'
                  : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'
              }`
            }
            title={isCollapsed ? 'Home' : ''}
          >
            <span className="text-xl">🏠</span>
            <span className={`ml-3 transition-all duration-300 ${
              isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'
            }`}>
              Home
            </span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/farmers"
            className={({ isActive }) =>
              `flex items-center ${isCollapsed ? 'justify-center' : ''} px-4 py-2 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-green-600 text-white font-semibold'
                  : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'
              }`
            }
            title={isCollapsed ? 'Farmers' : ''}
          >
            <span className="text-xl">👨‍🌾</span>
            <span className={`ml-3 transition-all duration-300 ${
              isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'
            }`}>
              Farmers
            </span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/products"
            className={({ isActive }) =>
              `flex items-center ${isCollapsed ? 'justify-center' : ''} px-4 py-2 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-green-600 text-white font-semibold'
                  : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'
              }`
            }
            title={isCollapsed ? 'Products' : ''}
          >
            <span className="text-xl">📦</span>
            <span className={`ml-3 transition-all duration-300 ${
              isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'
            }`}>
              Products
            </span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/categories"
            className={({ isActive }) =>
              `flex items-center ${isCollapsed ? 'justify-center' : ''} px-4 py-2 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-green-600 text-white font-semibold'
                  : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'
              }`
            }
            title={isCollapsed ? 'Categories' : ''}
          >
            <span className="text-xl">📂</span>
            <span className={`ml-3 transition-all duration-300 ${
              isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'
            }`}>
              Categories
            </span>
          </NavLink>
        </li>
      </ul>
      <button
        onClick={handleLogout}
        className={`mt-4 w-full py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-all duration-200 hover:scale-105 active:scale-95 ${
          isCollapsed ? 'px-2' : ''
        }`}
        title={isCollapsed ? 'Logout' : ''}
      >
        {isCollapsed ? '🚪' : 'Logout'}
      </button>
    </div>
  );
}

export default LeftBar;