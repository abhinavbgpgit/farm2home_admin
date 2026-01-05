import React, { useState } from 'react';

function AddProductPopup({ isOpen, onClose, onAddProduct }) {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Vegetables',
    price: '',
    unit: 'kg',
    image: '',
    rating: 4.5,
    reviews: 0,
    description: '',
    organicFarming: true,
    naturalComposting: true,
    traditionalMethods: true,
    freshHarvest: true,
    vitaminA: 'Medium',
    vitaminC: 'Medium',
    vitaminK: 'Medium',
    bVitamins: 'Medium',
    iron: true,
    calcium: true,
    potassium: true,
    magnesium: true,
    phosphorus: true,
    zinc: true,
    dietaryFiber: '',
    antioxidants: '',
    healthBenefits: '',
    storageTips: ''
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Convert health benefits and storage tips from string to array
    const healthBenefitsArray = formData.healthBenefits
      .split('\n')
      .filter(item => item.trim() !== '');
    
    const storageTipsArray = formData.storageTips
      .split('\n')
      .filter(item => item.trim() !== '');

    // Build minerals object
    const minerals = {};
    if (formData.iron) minerals.iron = 'Fe';
    if (formData.calcium) minerals.calcium = 'Ca';
    if (formData.potassium) minerals.potassium = 'K';
    if (formData.magnesium) minerals.magnesium = 'Mg';
    if (formData.phosphorus) minerals.phosphorus = 'P';
    if (formData.zinc) minerals.zinc = 'Zn';

    const newProduct = {
      id: Date.now(),
      name: formData.name,
      category: formData.category,
      price: parseFloat(formData.price),
      unit: formData.unit,
      image: formData.image || 'https://images.unsplash.com/photo-1546470427-227e9e3a0e6e?w=400',
      rating: parseFloat(formData.rating),
      reviews: parseInt(formData.reviews),
      description: formData.description,
      organicFarming: formData.organicFarming,
      naturalComposting: formData.naturalComposting,
      traditionalMethods: formData.traditionalMethods,
      freshHarvest: formData.freshHarvest,
      vitamins: {
        vitaminA: formData.vitaminA,
        vitaminC: formData.vitaminC,
        vitaminK: formData.vitaminK,
        bVitamins: formData.bVitamins
      },
      minerals: minerals,
      dietaryFiber: formData.dietaryFiber,
      antioxidants: formData.antioxidants,
      healthBenefits: healthBenefitsArray,
      storageTips: storageTipsArray
    };

    onAddProduct(newProduct);
    
    // Reset form
    setFormData({
      name: '',
      category: 'Vegetables',
      price: '',
      unit: 'kg',
      image: '',
      rating: 4.5,
      reviews: 0,
      description: '',
      organicFarming: true,
      naturalComposting: true,
      traditionalMethods: true,
      freshHarvest: true,
      vitaminA: 'Medium',
      vitaminC: 'Medium',
      vitaminK: 'Medium',
      bVitamins: 'Medium',
      iron: true,
      calcium: true,
      potassium: true,
      magnesium: true,
      phosphorus: true,
      zinc: true,
      dietaryFiber: '',
      antioxidants: '',
      healthBenefits: '',
      storageTips: ''
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
                  Rating
                </label>
                <input
                  type="number"
                  name="rating"
                  value={formData.rating}
                  onChange={handleChange}
                  min="0"
                  max="5"
                  step="0.1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
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

          {/* How We Grow It Naturally */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">🌱 How We Grow It Naturally</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="organicFarming"
                  checked={formData.organicFarming}
                  onChange={handleChange}
                  className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                />
                <span className="text-sm text-gray-700">100% Organic Farming</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="naturalComposting"
                  checked={formData.naturalComposting}
                  onChange={handleChange}
                  className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                />
                <span className="text-sm text-gray-700">Natural Composting</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="traditionalMethods"
                  checked={formData.traditionalMethods}
                  onChange={handleChange}
                  className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                />
                <span className="text-sm text-gray-700">Traditional Methods</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="freshHarvest"
                  checked={formData.freshHarvest}
                  onChange={handleChange}
                  className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                />
                <span className="text-sm text-gray-700">Fresh Harvest</span>
              </label>
            </div>
          </div>

          {/* Nutritional Information */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">🍊 Nutritional Information</h3>
            
            {/* Vitamins */}
            <div className="mb-4">
              <h4 className="text-sm font-semibold mb-3 text-gray-600">Rich in Vitamins</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Vitamin A</label>
                  <select
                    name="vitaminA"
                    value={formData.vitaminA}
                    onChange={handleChange}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-gray-600 mb-1">Vitamin C</label>
                  <select
                    name="vitaminC"
                    value={formData.vitaminC}
                    onChange={handleChange}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-gray-600 mb-1">Vitamin K</label>
                  <select
                    name="vitaminK"
                    value={formData.vitaminK}
                    onChange={handleChange}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-gray-600 mb-1">B Vitamins</label>
                  <select
                    name="bVitamins"
                    value={formData.bVitamins}
                    onChange={handleChange}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Minerals */}
            <div className="mb-4">
              <h4 className="text-sm font-semibold mb-3 text-gray-600">Essential Minerals</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="iron"
                    checked={formData.iron}
                    onChange={handleChange}
                    className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                  />
                  <span className="text-sm text-gray-700">Iron (Fe)</span>
                </label>

                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="calcium"
                    checked={formData.calcium}
                    onChange={handleChange}
                    className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                  />
                  <span className="text-sm text-gray-700">Calcium (Ca)</span>
                </label>

                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="potassium"
                    checked={formData.potassium}
                    onChange={handleChange}
                    className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                  />
                  <span className="text-sm text-gray-700">Potassium (K)</span>
                </label>

                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="magnesium"
                    checked={formData.magnesium}
                    onChange={handleChange}
                    className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                  />
                  <span className="text-sm text-gray-700">Magnesium (Mg)</span>
                </label>

                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="phosphorus"
                    checked={formData.phosphorus}
                    onChange={handleChange}
                    className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                  />
                  <span className="text-sm text-gray-700">Phosphorus (P)</span>
                </label>

                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="zinc"
                    checked={formData.zinc}
                    onChange={handleChange}
                    className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                  />
                  <span className="text-sm text-gray-700">Zinc (Zn)</span>
                </label>
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

          {/* Storage & Usage Tips */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">💡 Storage & Usage Tips</h3>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Storage Tips (one per line)
            </label>
            <textarea
              name="storageTips"
              value={formData.storageTips}
              onChange={handleChange}
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Store in a cool, dry place away from direct sunlight&#10;Best consumed within 3-5 days of delivery for maximum freshness&#10;Wash thoroughly before consumption&#10;Can be used in salads, cooking, juicing, or eaten raw"
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