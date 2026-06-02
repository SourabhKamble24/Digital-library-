import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { BookOpen, ShoppingCart, User, LogOut } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-md border-b-4 border-blue-600 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo Section */}
          <Link to="/" className="flex items-center gap-2">
            <BookOpen className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900 tracking-tight">
              Digital<span className="text-blue-600">Library</span>
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-6">
            <Link to="/" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
              Browse Books
            </Link>
            
            {user ? (
              <>
                <Link to="/cart" className="text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-1">
                  <ShoppingCart className="h-5 w-5" />
                  <span className="font-medium">Cart</span>
                </Link>
                <Link to="/dashboard" className="text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-1">
                  <User className="h-5 w-5" />
                  <span className="font-medium">{user.role === 'ADMIN' ? 'Admin Dashboard' : 'My Books'}</span>
                </Link>
                <button 
                  onClick={handleLogout}
                  className="ml-4 flex items-center gap-1 bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-md font-medium transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium transition-colors">
                  Login
                </Link>
                <Link to="/signup" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md font-medium transition-colors shadow-sm">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
