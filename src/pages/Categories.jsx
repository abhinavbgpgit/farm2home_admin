import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useUpdateCategoryStatusMutation,
} from '../store/api/categoriesApi';
import AddCategoryPopup from '../components/AddCategoryPopup';
import DeleteConfirmDialog from '../components/DeleteConfirmDialog';

function Categories() {
  const navigate = useNavigate();
  const [isAddPopupOpen, setIsAddPopupOpen] = useState(false);
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmDeleteCategory, setConfirmDeleteCategory] = useState({
    id: null,
    name: '',
    isOpen: false,
  });

  // RTK Query hooks
  const { data: categories = [], isLoading, isError, error } = useGetCategoriesQuery();
  const [createCategory] = useCreateCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();
  const [updateCategoryStatus] = useUpdateCategoryStatusMutation();

  // Filter categories based on search
  const filteredCategories = categories
    .filter(category =>
      category.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .slice() // copy before sort
    .sort((a, b) => (a.display_order || 0) - (b.display_order || 0));

  // Add new category
  const handleAddCategory = async (newCategory) => {
    try {
      const categoryData = {
        name: newCategory.name,
        description: newCategory.description,
        image_url: newCategory.image_url || null,
        display_order: newCategory.display_order || 1,
        is_active: newCategory.isActive !== undefined ? newCategory.isActive : true,
      };
      await createCategory(categoryData).unwrap();
      setIsAddPopupOpen(false);
    } catch (err) {
      console.error('Failed to create category:', err);
      alert('Failed to create category. Please try again.');
    }
  };

  // Edit category
  const handleEditCategory = async (updatedCategory) => {
    try {
      const categoryData = {
        id: updatedCategory.id,
        name: updatedCategory.name,
        description: updatedCategory.description,
        image_url: updatedCategory.image_url || null,
        display_order: updatedCategory.display_order || 1,
        is_active: updatedCategory.isActive !== undefined ? updatedCategory.isActive : true,
      };
      await updateCategory(categoryData).unwrap();
      setEditingCategory(null);
      setIsEditPopupOpen(false);
    } catch (err) {
      console.error('Failed to update category:', err);
      alert('Failed to update category. Please try again.');
    }
  };

  // Delete category confirmation helpers
  const openDeleteConfirmation = (category) => {
    setConfirmDeleteCategory({
      id: category.id,
      name: category.name,
      isOpen: true,
    });
  };

  const closeDeleteConfirmation = () => {
    setConfirmDeleteCategory({
      id: null,
      name: '',
      isOpen: false,
    });
  };

  const confirmDeleteCategoryAction = async () => {
    if (!confirmDeleteCategory.id) return;

    try {
      await deleteCategory(confirmDeleteCategory.id).unwrap();
      closeDeleteConfirmation();
    } catch (err) {
      console.error('Failed to delete category:', err);
      alert('Failed to delete category. Please try again.');
    }
  };

  // Toggle category active status
  const handleToggleActive = async (categoryId, currentStatus) => {
    try {
      await updateCategoryStatus({
        id: categoryId,
        is_active: !currentStatus,
      }).unwrap();
    } catch (err) {
      console.error('Failed to update category status:', err);
      alert('Failed to update category status. Please try again.');
    }
  };

  // Open edit popup
  const openEditPopup = (category) => {
    setEditingCategory({
      id: category.id,
      name: category.name,
      description: category.description,
      image_url: category.image_url,
      display_order: category.display_order,
      isActive: category.is_active,
    });
    setIsEditPopupOpen(true);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex-1 p-6 bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⏳</div>
          <h3 className="text-xl font-semibold text-gray-700">Loading categories...</h3>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="flex-1 p-6 bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Error loading categories</h3>
          <p className="text-gray-500">{error?.data?.message || 'Please try again later'}</p>
        </div>
      </div>
    );
  }

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

      {/* Categories Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider w-20">
                Sr. No.
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider w-80">
                Image
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                Category Name
              </th>
              {/* <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700 uppercase tracking-wider w-32">
                Status
              </th> */}
              <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700 uppercase tracking-wider w-40">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredCategories.map((category, index) => (
              <tr key={category.id} className="hover:bg-gray-50 transition-colors duration-150">
                <td className="px-6 py-5 whitespace-nowrap">
                  <span className="text-sm font-medium text-gray-700">{index + 1}</span>
                </td>
                <td className=" py-5 whitespace-nowrap ">
                  <img
                    src={category.image_url || 'https://images.unsplash.com/photo-1546470427-227e9e3a0e6e?w=100&h=100&fit=crop'}
                    alt={category.name}
                    className="w-32 object-cover rounded-lg shadow-sm border border-gray-200"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1546470427-227e9e3a0e6e?w=100&h=100&fit=crop';
                    }}
                  />
                </td>
                <td className="px-6 py-5">
                  <div
                    className="text-sm font-semibold text-gray-900 mb-1 cursor-pointer hover:text-blue-600"
                    onClick={() => {
                      const normalize = (s) =>
                        String(s || '')
                          .toLowerCase()
                          .replace(/[^a-z0-9]+/g, '_')
                          .replace(/^_+|_+$/g, '');
                      const cat = normalize(category.slug || category.name);
                      navigate(`/products?category=${encodeURIComponent(cat)}`);
                    }}
                  >
                    {category.name}
                  </div>
                  {/* <div className="text-sm text-gray-600 line-clamp-2">{category.description}</div> */}
                </td>
                {/* <td className="px-6 py-5 whitespace-nowrap text-center">
                  <button
                    onClick={() => handleToggleActive(category.id, category.is_active)}
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                      category.is_active
                        ? 'bg-green-100 text-green-800 hover:bg-green-200'
                        : 'bg-red-100 text-red-800 hover:bg-red-200'
                    }`}
                  >
                    {category.is_active ? 'Active' : 'Inactive'}
                  </button>
                </td> */}
                <td className="px-6 py-5 whitespace-nowrap text-center">
                  <div className="flex items-center justify-center gap-3">
                    <button
                      onClick={() => openEditPopup(category)}
                      className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-white hover:bg-blue-600 border border-blue-600 rounded-lg transition-all duration-200"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => openDeleteConfirmation(category)}
                      className="px-4 py-2 text-sm font-medium text-red-600 hover:text-white hover:bg-red-600 border border-red-600 rounded-lg transition-all duration-200"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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

      <DeleteConfirmDialog
        isOpen={confirmDeleteCategory.isOpen}
        onClose={closeDeleteConfirmation}
        onConfirm={confirmDeleteCategoryAction}
        categoryName={confirmDeleteCategory.name}
      />
    </div>
  );
}

export default Categories;