import React from 'react';
import { NavLink } from 'react-router-dom';

function LeftBar() {
  return (
    <div className="w-64 bg-gray-100 p-4">
      <h2 className="text-lg font-bold mb-4">Navigation</h2>
      <ul className="space-y-2">
        <li>
          <NavLink
            to="/"
            className={({ isActive }) =>
              `block px-4 py-2 rounded-lg transition-colors ${
                isActive
                  ? 'bg-green-600 text-white font-semibold'
                  : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'
              }`
            }
          >
            🏠 Home
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/farmers"
            className={({ isActive }) =>
              `block px-4 py-2 rounded-lg transition-colors ${
                isActive
                  ? 'bg-green-600 text-white font-semibold'
                  : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'
              }`
            }
          >
            👨‍🌾 Farmers
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/products"
            className={({ isActive }) =>
              `block px-4 py-2 rounded-lg transition-colors ${
                isActive
                  ? 'bg-green-600 text-white font-semibold'
                  : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'
              }`
            }
          >
            📦 Products
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/categories"
            className={({ isActive }) =>
              `block px-4 py-2 rounded-lg transition-colors ${
                isActive
                  ? 'bg-green-600 text-white font-semibold'
                  : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'
              }`
            }
          >
            📂 Categories
          </NavLink>
        </li>
      </ul>
    </div>
  );
}

export default LeftBar;