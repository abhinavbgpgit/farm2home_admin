import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useGetCategoriesQuery } from '../store/api/categoriesApi';
import { useGetProductsQuery, useDeleteProductMutation } from '../store/api/productsApi';
import AddProductPopup from '../components/AddProductPopup';
import EditProductPopup from '../components/EditProductPopup';
import DeleteConfirmDialog from '../components/DeleteConfirmDialog';

function Products() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isAddPopupOpen, setIsAddPopupOpen] = useState(false);
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // RTK Query hooks - data is automatically cached and managed
  const { 
    data: categoriesData = [], 
    isLoading: isLoadingCategories 
  } = useGetCategoriesQuery();

  const { 
    data: products = [], 
    isLoading: isLoadingProducts,
    isFetching: isFetchingProducts 
  } = useGetProductsQuery();

  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

  // Build categories list with "All" option
  const categories = ['All', ...categoriesData.map(cat => cat.name)];

  // Handle category selection from URL params
  useEffect(() => {
    const rawCat = searchParams.get('category');
    const cat = rawCat ? decodeURIComponent(rawCat) : null;
    if (cat) {
      // Normalize helper: convert strings like "Pulses & Grains" or "pulses_grains" to comparable form
      const normalize = (s) =>
        String(s || '')
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '_')
          .replace(/^_+|_+$/g, '');
      const found = categories.find((c) => normalize(c) === normalize(cat));
      if (found) {
        setSelectedCategory(found);
      } else {
        setSelectedCategory('All');
      }
    } else {
      setSelectedCategory('All');
    }
  }, [searchParams.get('category'), categories.length]);

  // Filter products by selected category
  const filteredProducts = selectedCategory === 'All'
    ? products
    : products.filter(product => {
        return product.category === selectedCategory ||
               product.category_name === selectedCategory ||
               product.categoryName === selectedCategory;
      });

  // Handle product deletion with RTK Query mutation
  const handleDeleteProduct = async () => {
    if (!selectedProduct) return;

    try {
      await deleteProduct(selectedProduct.id).unwrap();
      setIsDeleteDialogOpen(false);
      setSelectedProduct(null);
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product. Please try again.');
    }
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
        {isLoadingCategories ? (
          <div className="flex items-center justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            <span className="ml-3 text-gray-600">Loading categories...</span>
          </div>
        ) : (
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
        )}
      </div>

      {/* Products Count */}
      <div className="mb-4">
        <p className="text-gray-600">
          Showing <span className="font-semibold text-gray-800">{filteredProducts.length}</span> products
          {selectedCategory !== 'All' && ` in ${selectedCategory}`}
          {isFetchingProducts && !isLoadingProducts && (
            <span className="ml-2 text-sm text-blue-600">(Updating...)</span>
          )}
        </p>
      </div>

      {/* Loading State for Products */}
      {isLoadingProducts ? (
        <div className="bg-white rounded-lg shadow-sm p-12">
          <div className="flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mb-4"></div>
            <p className="text-gray-600">Loading products...</p>
          </div>
        </div>
      ) : (
        <>
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
                        disabled={isDeleting}
                      >
                        Edit
                      </button>
                      <button
                        onClick={(e) => openDeleteDialog(product, e)}
                        className="text-red-600 hover:text-red-900"
                        disabled={isDeleting}
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
          {filteredProducts.length === 0 && !isLoadingProducts && (
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
        </>
      )}

      {/* Add Product Popup */}
      <AddProductPopup
        isOpen={isAddPopupOpen}
        onClose={() => setIsAddPopupOpen(false)}
      />

      {/* Edit Product Popup */}
      <EditProductPopup
        isOpen={isEditPopupOpen}
        onClose={() => {
          setIsEditPopupOpen(false);
          setSelectedProduct(null);
        }}
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
        isLoading={isDeleting}
      />
    </div>
  );
}

export default Products;