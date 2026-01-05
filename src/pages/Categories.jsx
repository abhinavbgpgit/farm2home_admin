import React, { useState } from 'react';
import { mockCategories } from '../data/mockCategories';
import AddCategoryPopup from '../components/AddCategoryPopup';

function Categories() {
  const [categories, setCategories] = useState(mockCategories);
  const [isAddPopupOpen, setIsAddPopupOpen] = useState(false);
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Filter categories based on search
  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Add new category
  const handleAddCategory = (newCategory) => {
    setCategories([...categories, newCategory]);
  };

  // Edit category
  const handleEditCategory = (updatedCategory) => {
    setCategories(categories.map(cat =>
      cat.id === updatedCategory.id ? updatedCategory : cat
    ));
    setEditingCategory(null);
  };

  // Delete category
  const handleDeleteCategory = (categoryId) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      setCategories(categories.filter(cat => cat.id !== categoryId));
    }
  };

  // Toggle category active status
  const handleToggleActive = (categoryId) => {
    setCategories(categories.map(cat =>
      cat.id === categoryId ? { ...cat, isActive: !cat.isActive } : cat
    ));
  };

  // Open edit popup
  const openEditPopup = (category) => {
    setEditingCategory(category);
    setIsEditPopupOpen(true);
  };

  return (
    <div className="flex-1 p-6 bg-gray-50">
      {/* Header */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Categories</h1>
          <p className="text-gray-600">Manage product categories</p>
        </div>
        <button
          onClick={() => setIsAddPopupOpen(true)}
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold shadow-md"
        >
          + Add Category
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6 bg-white rounded-lg shadow-sm p-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl">
            🔍
          </span>
        </div>
      </div>

      {/* Categories Count */}
      <div className="mb-4">
        <p className="text-gray-600">
          Showing <span className="font-semibold text-gray-800">{filteredCategories.length}</span> categories
        </p>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategories.map(category => (
          <div
            key={category.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
          >
            {/* Category Header */}
            <div
              className="p-6 text-white"
              style={{ backgroundColor: category.color }}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="text-5xl">{category.icon}</div>
                <div className="flex gap-2">
                  <button
                    onClick={() => openEditPopup(category)}
                    className="p-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-colors"
                    title="Edit"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(category.id)}
                    className="p-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-colors"
                    title="Delete"
                  >
                    🗑️
                  </button>
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-1">{category.name}</h3>
              <p className="text-sm opacity-90">{category.slug}</p>
            </div>

            {/* Category Body */}
            <div className="p-6">
              <p className="text-gray-600 mb-4 min-h-[48px]">
                {category.description}
              </p>

              {/* Stats */}
              <div className="flex items-center justify-between mb-4 pb-4 border-b">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-gray-800">
                    {category.productCount}
                  </span>
                  <span className="text-sm text-gray-500">Products</span>
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(category.createdAt).toLocaleDateString('en-IN')}
                </div>
              </div>

              {/* Status Toggle */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Status:</span>
                <button
                  onClick={() => handleToggleActive(category.id)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                    category.isActive
                      ? 'bg-green-100 text-green-700 hover:bg-green-200'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category.isActive ? '✓ Active' : '✗ Inactive'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredCategories.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📂</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No categories found</h3>
          <p className="text-gray-500">
            {searchTerm
              ? 'Try adjusting your search terms'
              : 'Start by adding your first category'}
          </p>
        </div>
      )}

      {/* Add Category Popup */}
      <AddCategoryPopup
        isOpen={isAddPopupOpen}
        onClose={() => setIsAddPopupOpen(false)}
        onAddCategory={handleAddCategory}
      />

      {/* Edit Category Popup */}
      {editingCategory && (
        <AddCategoryPopup
          isOpen={isEditPopupOpen}
          onClose={() => {
            setIsEditPopupOpen(false);
            setEditingCategory(null);
          }}
          onAddCategory={handleEditCategory}
          editMode={true}
          categoryData={editingCategory}
        />
      )}
    </div>
  );
}

export default Categories;