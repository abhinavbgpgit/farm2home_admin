import React, { useState } from 'react';
import { useGetCategoriesQuery } from '../store/api/categoriesApi';
import { useCreateProductMutation } from '../store/api/productsApi';

function AddProductPopup({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    subcategory: '',
    price: '',
    unit: 'kg',
    imageUrl: '',
    bgImageUrl: '',
    offReference: '',
    description: '',
    vitamins: [],
    minerals: [],
    dietaryFiber: '',
    antioxidants: '',
    healthBenefits: ''
  });

  // For vitamin/mineral amounts
  const [vitaminAmounts, setVitaminAmounts] = useState({});
  const [mineralAmounts, setMineralAmounts] = useState({});

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

  // RTK Query hooks
  const { data: categories = [], isLoading: categoriesLoading } = useGetCategoriesQuery(undefined, { skip: !isOpen });
  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();

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

  const handleVitaminAmountChange = (vitamin, amount) => {
    setVitaminAmounts(prev => ({
      ...prev,
      [vitamin]: amount
    }));
  };

  const handleMineralAmountChange = (mineral, amount) => {
    setMineralAmounts(prev => ({
      ...prev,
      [mineral]: amount
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Convert health benefits from string to array
    const healthBenefitsArray = formData.healthBenefits
      .split('\n')
      .filter(item => item.trim() !== '');

    // Build vitamins array with amount
    const vitaminsPayload = formData.vitamins.map(vit => ({
      name: vitaminOptions.find(opt => opt.value === vit)?.label || vit,
      amount: vitaminAmounts[vit] || ''
    }));

    // Build minerals array with amount
    const mineralsPayload = formData.minerals.map(min => ({
      name: mineralOptions.find(opt => opt.value === min)?.label.replace(/\s*\(.*\)/, '') || min,
      amount: mineralAmounts[min] || ''
    }));

    const payload = {
      name: formData.name,
      category: formData.category,
      subcategory: formData.subcategory,
      price: parseFloat(formData.price),
      unit: formData.unit,
      description: formData.description,
      imageUrl: formData.imageUrl || 'https://images.unsplash.com/photo-1546470427-227e9e3a0e6e?w=400',
      bgImageUrl: formData.bgImageUrl,
      vitamins: vitaminsPayload,
      minerals: mineralsPayload,
      dietaryFiber: formData.dietaryFiber,
      antioxidants: formData.antioxidants,
      healthBenefits: healthBenefitsArray,
      offReference: formData.offReference
    };

    try {
      // Use RTK Query mutation - it will automatically update the cache
      await createProduct(payload).unwrap();
      
      // Reset form
      setFormData({
        name: '',
        category: '',
        subcategory: '',
        price: '',
        unit: 'kg',
        imageUrl: '',
        bgImageUrl: '',
        offReference: '',
        description: '',
        vitamins: [],
        minerals: [],
        dietaryFiber: '',
        antioxidants: '',
        healthBenefits: ''
      });
      setVitaminAmounts({});
      setMineralAmounts({});
      
      // Close popup
      onClose();
    } catch (error) {
      console.error('Failed to add product:', error);
      alert('Failed to add product. Please try again.');
    }
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
            disabled={isCreating}
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
                  disabled={isCreating}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
                  placeholder="e.g., Tomato"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                {categoriesLoading ? (
                  <div className="w-full px-3 py-2 border border-gray-300 rounded-md text-center text-gray-500 bg-gray-100">
                    Loading categories...
                  </div>
                ) : (
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    disabled={isCreating}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
                  >
                    <option value="" disabled>Select category</option>
                    {categories.map((cat) => (
                      <option key={cat._id || cat.id || cat.name} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                )}
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
                  disabled={isCreating}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
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
                  disabled={isCreating}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
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
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  disabled={isCreating}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Background URL
                </label>
                <input
                  type="url"
                  name="bgImageUrl"
                  value={formData.bgImageUrl}
                  onChange={handleChange}
                  disabled={isCreating}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
                  placeholder="https://example.com/background.jpg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subcategory
                </label>
                <input
                  type="text"
                  name="subcategory"
                  value={formData.subcategory}
                  onChange={handleChange}
                  disabled={isCreating}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
                  placeholder="e.g., Fresh Fruits"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Open Food Facts Reference
                </label>
                <input
                  type="url"
                  name="offReference"
                  value={formData.offReference}
                  onChange={handleChange}
                  disabled={isCreating}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
                  placeholder="https://world.openfoodfacts.org/product/..."
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
                  disabled={isCreating}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
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
                  <div key={option.value} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="vitamins"
                      value={option.value}
                      checked={formData.vitamins.includes(option.value)}
                      onChange={handleChange}
                      disabled={isCreating}
                      className="w-4 h-4 text-green-600 rounded focus:ring-green-500 disabled:opacity-50"
                    />
                    <span className="text-sm text-gray-700">{option.label}</span>
                    {formData.vitamins.includes(option.value) && (
                      <input
                        type="text"
                        placeholder="Amount (e.g., 10mg)"
                        value={vitaminAmounts[option.value] || ''}
                        onChange={e => handleVitaminAmountChange(option.value, e.target.value)}
                        disabled={isCreating}
                        className="ml-2 px-2 py-1 border border-gray-300 rounded text-xs disabled:bg-gray-100"
                        style={{ minWidth: 80 }}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Minerals */}
            <div className="mb-4">
              <h4 className="text-sm font-semibold mb-3 text-gray-600">Essential Minerals</h4>
              <div className="flex flex-wrap gap-4">
                {mineralOptions.map(option => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="minerals"
                      value={option.value}
                      checked={formData.minerals.includes(option.value)}
                      onChange={handleChange}
                      disabled={isCreating}
                      className="w-4 h-4 text-green-600 rounded focus:ring-green-500 disabled:opacity-50"
                    />
                    <span className="text-sm text-gray-700">{option.label}</span>
                    {formData.minerals.includes(option.value) && (
                      <input
                        type="text"
                        placeholder="Amount (e.g., 50mg)"
                        value={mineralAmounts[option.value] || ''}
                        onChange={e => handleMineralAmountChange(option.value, e.target.value)}
                        disabled={isCreating}
                        className="ml-2 px-2 py-1 border border-gray-300 rounded text-xs disabled:bg-gray-100"
                        style={{ minWidth: 80 }}
                      />
                    )}
                  </div>
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
                  disabled={isCreating}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
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
                  disabled={isCreating}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
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
              disabled={isCreating}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
              placeholder="Fresh red tomatoes — farm grown&#10;Fresh produce&#10;Farmer direct"
            />
          </div>


          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              disabled={isCreating}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCreating}
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isCreating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Adding...
                </>
              ) : (
                'Add Product'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddProductPopup;