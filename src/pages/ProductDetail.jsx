import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockProducts } from '../data/mockProducts';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const product = mockProducts.find(p => p.id === id);

  if (!product) {
    return (
      <div className="flex-1 p-6 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center py-12">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Product Not Found</h2>
          <p className="text-gray-600 mb-6">The product you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/products')}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate('/products')}
          className="mb-6 flex items-center text-green-600 hover:text-green-700 font-medium"
        >
          <span className="mr-2">←</span> Back to Products
        </button>

        {/* Product Detail Card */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
            {/* Product Image */}
            <div className="relative">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-96 object-cover rounded-lg"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1546470427-227e9e3a0e6e?w=400';
                }}
              />
              {product.local_only && (
                <div className="absolute top-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                  🏠 Local Only
                </div>
              )}
            </div>

            {/* Product Info */}
            <div>
              <div className="mb-4">
                <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium mb-2">
                  {product.category}
                </span>
                {product.subcategory && (
                  <span className="inline-block ml-2 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                    {product.subcategory}
                  </span>
                )}
              </div>

              <h1 className="text-4xl font-bold text-gray-800 mb-4">{product.name}</h1>
              
              <p className="text-gray-600 text-lg mb-6">{product.description}</p>

              {/* Price */}
              <div className="mb-6 p-6 bg-green-50 rounded-lg">
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold text-green-600">₹{product.price}</span>
                  <span className="text-xl text-gray-600 ml-2">per {product.quantity_units}</span>
                </div>
              </div>

             

              {/* Availability */}
              {product.available !== undefined && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Availability</h3>
                  <div className="flex items-center">
                    <span className={`inline-block w-3 h-3 rounded-full mr-2 ${product.available ? 'bg-green-500' : 'bg-red-500'}`}></span>
                    <span className="text-gray-700">
                      {product.available ? 'In Stock' : 'Out of Stock'}
                    </span>
                    {product.availibityDate && (
                      <span className="ml-2 text-sm text-gray-500">
                        (Available from: {new Date(product.availibityDate).toLocaleDateString()})
                      </span>
                    )}
                  </div>
                </div>
              )}            
             
            </div>
          </div>

          {/* Additional Details */}
          <div className="border-t border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Product Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Product ID</h3>
                <p className="text-gray-600">{product.id}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Unit</h3>
                <p className="text-gray-600">{product.quantity_units}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Category</h3>
                <p className="text-gray-600">{product.category}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Subcategory</h3>
                <p className="text-gray-600">{product.subcategory || 'N/A'}</p>
              </div>
            </div>

            {product.off_reference && (
              <div className="mt-6">
                <h3 className="font-semibold text-gray-700 mb-2">Reference</h3>
                <a 
                  href={product.off_reference} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-green-600 hover:text-green-700 underline break-all"
                >
                  View on OpenFoodFacts
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;