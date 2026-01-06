import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { mockProducts, categories } from '../data/mockProducts';
import AddProductPopup from '../components/AddProductPopup';
import EditProductPopup from '../components/EditProductPopup';
import DeleteConfirmDialog from '../components/DeleteConfirmDialog';

function Products() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [products, setProducts] = useState(mockProducts);
  const [isAddPopupOpen, setIsAddPopupOpen] = useState(false);
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) {
      // Check if the category exists in our categories list
      const categoryExists = categories.includes(cat);
      if (categoryExists) {
        setSelectedCategory(cat);
      } else {
        setSelectedCategory('All');
      }
    } else {
      setSelectedCategory('All');
    }
  }, [searchParams]);

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

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ maxWidth: '30px' }}>Sr. No.</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredProducts.map((product, index) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500" style={{ maxWidth: '50px' }}>{index + 1}</td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-12 h-12 object-cover rounded"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1546470427-227e9e3a0e6e?w=400';
                    }}
                  />
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div
                    className="text-sm font-medium text-gray-900 cursor-pointer hover:text-blue-600"
                    onClick={() => navigate(`/products/${product.id}`)}
                  >
                    {product.name}
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{product.category}</td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center">
                    <div className="flex text-yellow-400 text-xs">
                      {[...Array(5)].map((_, i) => (
                        <span key={i}>{i < Math.floor(product.rating) ? '★' : '☆'}</span>
                      ))}
                    </div>
                    <span className="ml-1">{product.rating}</span>
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                  ₹{product.price} per {product.unit}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={(e) => openEditPopup(product, e)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    Edit
                  </button>
                  <button
                    onClick={(e) => openDeleteDialog(product, e)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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