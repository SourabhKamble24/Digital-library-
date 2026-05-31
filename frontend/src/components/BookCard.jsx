import React from 'react';
import { ShoppingCart } from 'lucide-react';

const BookCard = ({ book, onAddToCart }) => {
  const isAvailable = book.available_copies > 0;
  
  // Fix for OpenLibrary returning 1x1 blank images instead of 404
  let imageUrl = book.cover_image;
  if (imageUrl && imageUrl.includes('covers.openlibrary.org')) {
    imageUrl = `${imageUrl}?default=false`;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300 flex flex-col h-full">
      <div className="h-48 bg-gray-100 flex items-center justify-center p-4">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={book.title} 
            className="h-full object-contain drop-shadow-md"
            onError={(e) => { 
              e.target.onerror = null; 
              e.target.src = 'https://via.placeholder.com/150x200?text=No+Cover';
            }}
          />
        ) : (
          <div className="text-gray-400 flex flex-col items-center">
            <span className="text-sm">No Cover</span>
          </div>
        )}
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <div className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
          {book.category_name}
        </div>
        <h3 className="text-lg font-bold text-gray-900 leading-tight mb-1 line-clamp-2">
          {book.title}
        </h3>
        <p className="text-sm text-gray-600 mb-3">{book.author}</p>
        
        <div className="mt-auto pt-4 flex items-center justify-between border-t border-gray-100">
          <div className="flex flex-col">
            <span className="text-xs text-gray-500">Available</span>
            <span className={`font-semibold ${isAvailable ? 'text-green-600' : 'text-red-500'}`}>
              {book.available_copies} / {book.total_copies}
            </span>
          </div>
          
          <button 
            onClick={() => onAddToCart(book.id)}
            disabled={!isAvailable}
            className={`p-2 rounded-full flex items-center justify-center transition-colors ${
              isAvailable 
                ? 'bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white' 
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
            title={isAvailable ? "Add to Cart" : "Out of Stock"}
          >
            <ShoppingCart className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
