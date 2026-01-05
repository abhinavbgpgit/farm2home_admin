import React, { useState, useEffect } from 'react';

function AddCategoryPopup({ isOpen, onClose, onAddCategory, editMode = false, categoryData = null }) {
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    icon: '📦',
    color: '#10b981',
    productCount: 0,
    isActive: true
  });

  // Populate form when editing
  useEffect(() => {
    if (editMode && categoryData) {
      setFormData({
        name: categoryData.name,
        slug: categoryData.slug,
        description: categoryData.description,
        icon: categoryData.icon,
        color: categoryData.color,
        productCount: categoryData.productCount,
        isActive: categoryData.isActive
      });
    }
  }, [editMode, categoryData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Auto-generate slug from name
    if (name === 'name' && !editMode) {
      const slug = value.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
      setFormData(prev => ({ ...prev, slug }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const categoryToSave = editMode
      ? {
          ...categoryData,
          ...formData
        }
      : {
          id: `cat_${Date.now()}`,
          ...formData,
          createdAt: new Date().toISOString().split('T')[0]
        };

    onAddCategory(categoryToSave);

    // Reset form
    setFormData({
      name: '',
      slug: '',
      description: '',
      icon: '📦',
      color: '#10b981',
      productCount: 0,
      isActive: true
    });

    onClose();
  };

  if (!isOpen) return null;

  const commonIcons = ['🥬', '🍎', '🌾', '🥛', '🍯', '🌿', '🥕', '🍊', '🧀', '🥖', '🍇', '🥔', '🌽', '🥦', '🍅', '🥒', '🫑', '🧅', '🧄', '🥬'];
  const commonColors = [
    { name: 'Green', value: '#10b981' },
    { name: 'Red', value: '#ef4444' },
    { name: 'Orange', value: '#f59e0b' },
    { name: 'Blue', value: '#3b82f6' },
    { name: 'Purple', value: '#8b5cf6' },
    { name: 'Teal', value: '#14b8a6' },
    { name: 'Pink', value: '#ec4899' },
    { name: 'Yellow', value: '#eab308' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">
            {editMode ? 'Edit Category' : 'Add New Category'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Basic Information */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">Basic Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="e.g., Vegetables"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Slug *
                </label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="e.g., vegetables"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="e.g., Fresh farm vegetables - locally grown and organic"
                />
              </div>
            </div>
          </div>

          {/* Visual Settings */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">Visual Settings</h3>
            
            {/* Icon Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Icon
              </label>
              <div className="grid grid-cols-10 gap-2">
                {commonIcons.map(icon => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, icon }))}
                    className={`text-3xl p-2 rounded-lg border-2 transition-all hover:scale-110 ${
                      formData.icon === icon
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
              <div className="mt-2">
                <input
                  type="text"
                  name="icon"
                  value={formData.icon}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Or enter custom emoji"
                />
              </div>
            </div>

            {/* Color Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Color
              </label>
              <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
                {commonColors.map(color => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, color: color.value }))}
                    className={`h-12 rounded-lg border-2 transition-all hover:scale-105 ${
                      formData.color === color.value
                        ? 'border-gray-800 ring-2 ring-gray-400'
                        : 'border-gray-200'
                    }`}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  />
                ))}
              </div>
              <div className="mt-2 flex gap-2">
                <input
                  type="color"
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                  className="h-10 w-20 border border-gray-300 rounded-md cursor-pointer"
                />
                <input
                  type="text"
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="#10b981"
                />
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">Preview</h3>
            <div className="bg-white rounded-lg shadow-md overflow-hidden max-w-sm">
              <div
                className="p-6 text-white"
                style={{ backgroundColor: formData.color }}
              >
                <div className="text-5xl mb-3">{formData.icon}</div>
                <h3 className="text-2xl font-bold mb-1">{formData.name || 'Category Name'}</h3>
                <p className="text-sm opacity-90">{formData.slug || 'category-slug'}</p>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-4">
                  {formData.description || 'Category description will appear here'}
                </p>
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="mb-6">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
              />
              <span className="text-sm font-medium text-gray-700">Active Category</span>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              {editMode ? 'Update Category' : 'Add Category'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddCategoryPopup;