import React, { useState } from 'react';

function AddProductPopup({ isOpen, onClose, onAddProduct }) {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Vegetables',
    price: '',
    unit: 'kg',
    image: '',
    backgroundURL: '',
    reviews: 0,
    description: '',
    vitamins: [],
    minerals: [],
    dietaryFiber: '',
    antioxidants: '',
    healthBenefits: ''
  });

  const vitaminOptions = [
    { label: 'Vitamin A', value: 'A' },
    { label: 'Vitamin B', value: 'B' },
    { label: 'Vitamin C', value: 'C' },
    { label: 'Vitamin D', value: 'D' },
    { label: 'Vitamin E', value: 'E' },
    { label: 'Vitamin K', value: 'K' }
  ];

  const mineralOptions = [
    { label: 'Iron (Fe)', value: 'iron' },
    { label: 'Calcium (Ca)', value: 'calcium' },
    { label: 'Potassium (K)', value: 'potassium' },
    { label: 'Magnesium (Mg)', value: 'magnesium' },
    { label: 'Phosphorus (P)', value: 'phosphorus' },
    { label: 'Zinc (Zn)', value: 'zinc' }
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'vitamins') {
      setFormData(prev => ({
        ...prev,
        vitamins: prev.vitamins.includes(value)
          ? prev.vitamins.filter(v => v !== value)
          : [...prev.vitamins, value]
      }));
    } else if (name === 'minerals') {
      setFormData(prev => ({
        ...prev,
        minerals: prev.minerals.includes(value)
          ? prev.minerals.filter(m => m !== value)
          : [...prev.minerals, value]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Convert health benefits from string to array
    const healthBenefitsArray = formData.healthBenefits
      .split('\n')
      .filter(item => item.trim() !== '');

    const newProduct = {
      id: Date.now(),
      name: formData.name,
      category: formData.category,
      price: parseFloat(formData.price),
      unit: formData.unit,
      image: formData.image || 'https://images.unsplash.com/photo-1546470427-227e9e3a0e6e?w=400',
      backgroundURL: formData.backgroundURL,
      reviews: parseInt(formData.reviews),
      description: formData.description,
      vitamins: formData.vitamins,
      minerals: formData.minerals,
      dietaryFiber: formData.dietaryFiber,
      antioxidants: formData.antioxidants,
      healthBenefits: healthBenefitsArray
    };

    onAddProduct(newProduct);

    // Reset form
    setFormData({
      name: '',
      category: 'Vegetables',
      price: '',
      unit: 'kg',
      image: '',
      backgroundURL: '',
      reviews: 0,
      description: '',
      vitamins: [],
      minerals: [],
      dietaryFiber: '',
      antioxidants: '',
      healthBenefits: ''
    });

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Add New Product</h2>
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
                  Product Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="e.g., Tomato"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="Vegetables">Vegetables</option>
                  <option value="Fruits">Fruits</option>
                  <option value="Grains">Grains</option>
                  <option value="Dairy">Dairy</option>
                  <option value="Pulses">Pulses</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="e.g., 94"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Unit *
                </label>
                <select
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="kg">per kg</option>
                  <option value="liter">per liter</option>
                  <option value="dozen">per dozen</option>
                  <option value="piece">per piece</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image URL
                </label>
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Background URL
                </label>
                <input
                  type="url"
                  name="backgroundURL"
                  value={formData.backgroundURL}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="https://example.com/background.jpg"
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
                  rows="2"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="e.g., Fresh red tomatoes — farm grown"
                />
              </div>
            </div>
          </div>


          {/* Nutritional Information */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">🍊 Nutritional Information</h3>
            
            {/* Vitamins */}
            <div className="mb-4">
              <h4 className="text-sm font-semibold mb-3 text-gray-600">Rich in Vitamins</h4>
              <div className="flex flex-wrap gap-4">
                {vitaminOptions.map(option => (
                  <label key={option.value} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="vitamins"
                      value={option.value}
                      checked={formData.vitamins.includes(option.value)}
                      onChange={handleChange}
                      className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                    />
                    <span className="text-sm text-gray-700">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Minerals */}
            <div className="mb-4">
              <h4 className="text-sm font-semibold mb-3 text-gray-600">Essential Minerals</h4>
              <div className="flex flex-wrap gap-4">
                {mineralOptions.map(option => (
                  <label key={option.value} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="minerals"
                      value={option.value}
                      checked={formData.minerals.includes(option.value)}
                      onChange={handleChange}
                      className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                    />
                    <span className="text-sm text-gray-700">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Other Nutritional Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dietary Fiber
                </label>
                <input
                  type="text"
                  name="dietaryFiber"
                  value={formData.dietaryFiber}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="e.g., 3.5g per 100g"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Antioxidants
                </label>
                <input
                  type="text"
                  name="antioxidants"
                  value={formData.antioxidants}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="e.g., Rich source"
                />
              </div>
            </div>
          </div>

          {/* Health Benefits */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">💚 Health Benefits</h3>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Health Benefits (one per line)
            </label>
            <textarea
              name="healthBenefits"
              value={formData.healthBenefits}
              onChange={handleChange}
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Fresh red tomatoes — farm grown&#10;Fresh produce&#10;Farmer direct"
            />
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
              Add Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddProductPopup;