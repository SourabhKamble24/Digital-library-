import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { Trash2, ShoppingBag } from 'lucide-react';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      const res = await api.get('/cart');
      setCartItems(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleRemove = async (cartItemId) => {
    try {
      await api.delete(`/cart/${cartItemId}`);
      setCartItems(cartItems.filter(item => item.cart_item_id !== cartItemId));
    } catch (err) {
      alert('Error removing item');
    }
  };

  const handleCheckout = async () => {
    try {
      await api.post('/borrow/checkout');
      alert('Checkout successful! Books borrowed for 14 days.');
      navigate('/dashboard');
    } catch (err) {
      alert(err.response?.data?.msg || 'Error during checkout');
    }
  };

  if (loading) return <div className="flex justify-center p-12"><div className="animate-spin h-8 w-8 border-b-2 border-blue-600 rounded-full"></div></div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
        <ShoppingBag className="h-8 w-8 text-blue-600" />
        Your Cart
      </h1>

      {cartItems.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-xl shadow-sm border border-gray-100">
          <p className="text-xl text-gray-500 mb-4">Your cart is empty.</p>
          <button 
            onClick={() => navigate('/')}
            className="text-blue-600 font-medium hover:underline"
          >
            Go browse some books!
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <ul className="divide-y divide-gray-200">
            {cartItems.map((item) => (
              <li key={item.cart_item_id} className="p-6 flex items-center gap-6 hover:bg-gray-50 transition-colors">
                <img 
                  src={item.cover_image || 'https://via.placeholder.com/60x90?text=No+Cover'} 
                  alt={item.title} 
                  className="w-16 h-24 object-cover rounded shadow-sm"
                />
                <div className="flex-grow">
                  <h3 className="text-lg font-bold text-gray-900">{item.title}</h3>
                  <p className="text-gray-600">{item.author}</p>
                </div>
                <button
                  onClick={() => handleRemove(item.cart_item_id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                  title="Remove"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </li>
            ))}
          </ul>
          <div className="bg-gray-50 p-6 border-t border-gray-200 flex justify-between items-center">
            <span className="text-lg font-medium text-gray-700">
              Total Books: {cartItems.length}
            </span>
            <button
              onClick={handleCheckout}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-bold shadow-md transition-colors"
            >
              Checkout & Borrow
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
