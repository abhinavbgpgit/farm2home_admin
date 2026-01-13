import React, { useState, useMemo } from 'react';
import {
  useGetFarmersQuery,
  useDeleteFarmerMutation,
} from '../store/api/farmersApi';
import DeleteConfirmDialog from '../components/DeleteConfirmDialog';

function Farmers() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [confirmDeleteFarmer, setConfirmDeleteFarmer] = useState({
    id: null,
    name: '',
    isOpen: false,
  });

  const itemsPerPage = 10;

  // RTK Query hooks
  const { data: farmers = [], isLoading, isError, error } = useGetFarmersQuery();
  const [deleteFarmer, { isLoading: isDeleting }] = useDeleteFarmerMutation();

  // Filter farmers based on search
  const filteredFarmers = useMemo(() => {
    return farmers.filter(farmer =>
      farmer.farmer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      farmer.farm_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      farmer.village?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      farmer.district?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      farmer.state?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      farmer.mobile?.includes(searchTerm) ||
      farmer.whatsapp?.includes(searchTerm)
    );
  }, [farmers, searchTerm]);

  // Pagination logic
  const totalPages = Math.ceil(filteredFarmers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentFarmers = filteredFarmers.slice(startIndex, endIndex);

  // Reset to page 1 when search changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Delete farmer confirmation helpers
  const openDeleteConfirmation = (farmer) => {
    setConfirmDeleteFarmer({
      id: farmer.id,
      name: farmer.farmer_name || 'this farmer',
      isOpen: true,
    });
  };

  const closeDeleteConfirmation = () => {
    setConfirmDeleteFarmer({
      id: null,
      name: '',
      isOpen: false,
    });
  };

  const confirmDeleteFarmerAction = async () => {
    if (!confirmDeleteFarmer.id) return;

    try {
      await deleteFarmer(confirmDeleteFarmer.id).unwrap();
      closeDeleteConfirmation();
      // Show success message
      alert('Farmer deleted successfully');
    } catch (err) {
      console.error('Failed to delete farmer:', err);
      alert('Failed to delete farmer. Please try again.');
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex-1 p-6 bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⏳</div>
          <h3 className="text-xl font-semibold text-gray-700">Loading farmers...</h3>
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
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Error loading farmers</h3>
          <p className="text-gray-500">{error?.data?.message || 'Please try again later'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 bg-gray-50">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Farmers</h1>
        <p className="text-gray-600">Manage farmer profiles and information</p>
      </div>

      {/* Search Bar */}
      <div className="mb-6 bg-white rounded-lg shadow-sm p-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search farmers by name, farm, location, or mobile..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl">
            🔍
          </span>
        </div>
      </div>

      {/* Farmers Count */}
      <div className="mb-4 flex justify-between items-center">
        <p className="text-gray-600">
          Showing <span className="font-semibold text-gray-800">{currentFarmers.length}</span> of{' '}
          <span className="font-semibold text-gray-800">{filteredFarmers.length}</span> farmers
        </p>
        {totalPages > 1 && (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Farmers Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sr. No.</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profile</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Farmer Name</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Farm Name</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mobile</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">WhatsApp</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Experience</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Farm Size</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {currentFarmers.map((farmer, index) => (
              <tr key={farmer.id} className="hover:bg-gray-50">
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                  {startIndex + index + 1}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <img
                    src={farmer.profile_photo || 'https://images.unsplash.com/photo-1595152772835-219674b2a8a6?w=100&h=100&fit=crop'}
                    alt={farmer.farmer_name}
                    className="w-12 h-12 object-cover rounded-full"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1595152772835-219674b2a8a6?w=100&h=100&fit=crop';
                    }}
                  />
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {farmer.farmer_name || '-'}
                  </div>
                  <div className="text-xs text-gray-500">ID: {farmer.userId || farmer.id}</div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                  {farmer.farm_name || '-'}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{farmer.village || '-'}</div>
                  <div className="text-xs text-gray-500">
                    {farmer.district ? `${farmer.district}, ` : ''}{farmer.state || ''}
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                  {farmer.mobile || '-'}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                  {farmer.whatsapp || '-'}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                  {farmer.experience_years ? `${farmer.experience_years} years` : '-'}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                  {farmer.farm_size ? `${farmer.farm_size} acres` : '-'}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex flex-col space-y-1">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      farmer.is_completed
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {farmer.is_completed ? '✓ Complete' : '⚠ Incomplete'}
                    </span>
                    {farmer.agreed_to_terms && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        ✓ Terms
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(farmer.createdAt)}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => openDeleteConfirmation(farmer)}
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
      {currentFarmers.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">👨‍🌾</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No farmers found</h3>
          <p className="text-gray-500">
            {searchTerm
              ? 'Try adjusting your search terms'
              : 'No farmers registered yet'}
          </p>
        </div>
      )}

      {/* Pagination Controls (Bottom) */}
      {totalPages > 1 && currentFarmers.length > 0 && (
        <div className="mt-6 flex justify-center items-center space-x-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={confirmDeleteFarmer.isOpen}
        onClose={closeDeleteConfirmation}
        onConfirm={confirmDeleteFarmerAction}
        categoryName={confirmDeleteFarmer.name}
        isLoading={isDeleting}
      />
    </div>
  );
}

export default Farmers;