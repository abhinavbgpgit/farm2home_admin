import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockProducts, categories } from '../data/mockProducts';
import AddProductPopup from '../components/AddProductPopup';
import EditProductPopup from '../components/EditProductPopup';
import DeleteConfirmDialog from '../components/DeleteConfirmDialog';

function Products() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [products, setProducts] = useState(mockProducts);
  const [isAddPopupOpen, setIsAddPopupOpen] = useState(false);
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const filteredProducts = selectedCategory === 'All'
    ? products
    : products.filter(product => product.category === selectedCategory);

  const handleAddProduct = (newProduct) => {
    setProducts([...products, newProduct]);
  };

  const handleUpdateProduct = (updatedProduct) => {
    setProducts(products.map(p => p.id === updatedProduct.id ? updatedProduct : p));
  };

  const handleDeleteProduct = () => {
    setProducts(products.filter(p => p.id !== selectedProduct.id));
    setIsDeleteDialogOpen(false);
    setSelectedProduct(null);
  };

  const openEditPopup = (product, e) => {
    e.stopPropagation();
    setSelectedProduct(product);
    setIsEditPopupOpen(true);
  };

  const openDeleteDialog = (product, e) => {
    e.stopPropagation();
    setSelectedProduct(product);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div className="flex-1 p-6 bg-gray-50">
      {/* Header */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Products</h1>
          <p className="text-gray-600">Manage your product inventory</p>
        </div>
        <button
          onClick={() => setIsAddPopupOpen(true)}
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold shadow-md"
        >
          + Add Product
        </button>
      </div>

      {/* Category Filter */}
      <div className="mb-6 bg-white rounded-lg shadow-sm p-4">
        <div className="flex flex-wrap gap-3">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                selectedCategory === category
                  ? 'bg-green-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Products Count */}
      <div className="mb-4">
        <p className="text-gray-600">
          Showing <span className="font-semibold text-gray-800">{filteredProducts.length}</span> products
          {selectedCategory !== 'All' && ` in ${selectedCategory}`}
        </p>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map(product => (
          <div
            key={product.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow relative group"
          >
            {/* Action Buttons */}
            <div className="absolute top-2 left-2 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={(e) => openEditPopup(product, e)}
                className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors shadow-lg"
                title="Edit Product"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                onClick={(e) => openDeleteDialog(product, e)}
                className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors shadow-lg"
                title="Delete Product"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>

            <div
              onClick={() => navigate(`/products/${product.id}`)}
              className="cursor-pointer"
            >
            {/* Product Image */}
            <div className="relative h-48 bg-gray-200">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1546470427-227e9e3a0e6e?w=400';
                }}
              />
              <div className="absolute top-2 right-2 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                {product.category}
              </div>
            </div>

            {/* Product Info */}
            <div className="p-4">
              <h3 className="text-xl font-bold text-gray-800 mb-1">{product.name}</h3>
              <p className="text-sm text-green-600 font-medium mb-2">{product.category}</p>
              
              {/* Rating */}
              <div className="flex items-center mb-3">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <span key={i}>
                      {i < Math.floor(product.rating) ? '★' : '☆'}
                    </span>
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-600">
                  {product.rating} ({product.reviews} reviews)
                </span>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {product.description}
              </p>

              {/* Price */}
              <div className="flex justify-between items-center pt-3 border-t">
                <div>
                  <span className="text-2xl font-bold text-green-600">₹{product.price}</span>
                  <span className="text-sm text-gray-500 ml-1">per {product.unit}</span>
                </div>
              </div>

              {/* Badges */}
              <div className="mt-3 flex flex-wrap gap-2">
                {product.organicFarming && (
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                    🌱 Organic
                  </span>
                )}
                {product.freshHarvest && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                    🌾 Fresh
                  </span>
                )}
              </div>
            </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No products found</h3>
          <p className="text-gray-500">
            {selectedCategory === 'All'
              ? 'Start by adding your first product'
              : `No products in ${selectedCategory} category`}
          </p>
        </div>
      )}

      {/* Add Product Popup */}
      <AddProductPopup
        isOpen={isAddPopupOpen}
        onClose={() => setIsAddPopupOpen(false)}
        onAddProduct={handleAddProduct}
      />

      {/* Edit Product Popup */}
      <EditProductPopup
        isOpen={isEditPopupOpen}
        onClose={() => {
          setIsEditPopupOpen(false);
          setSelectedProduct(null);
        }}
        onUpdateProduct={handleUpdateProduct}
        product={selectedProduct}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setSelectedProduct(null);
        }}
        onConfirm={handleDeleteProduct}
        productName={selectedProduct?.name}
      />
    </div>
  );
}

export default Products;