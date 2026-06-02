import React, { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { BookOpen } from 'lucide-react';

const Auth = () => {
  const location = useLocation();
  const isLogin = location.pathname === '/login';
  
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'MEMBER', mobile_no: '' });
  const [error, setError] = useState('');
  
  const { login, signup } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        await signup(formData.name, formData.email, formData.password, formData.role, formData.mobile_no);
      }
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.msg || 'An error occurred');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        
        {/* Header / Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => navigate('/login')}
            className={`flex-1 py-4 text-center font-semibold text-lg transition-colors ${
              isLogin ? 'bg-white text-blue-600 border-b-2 border-blue-600' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => navigate('/signup')}
            className={`flex-1 py-4 text-center font-semibold text-lg transition-colors ${
              !isLogin ? 'bg-white text-blue-600 border-b-2 border-blue-600' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
            }`}
          >
            Register
          </button>
        </div>

        <div className="p-8">
          <div className="text-center mb-8">
            <BookOpen className="mx-auto h-10 w-10 text-blue-600 mb-4" />
            <h2 className="text-2xl font-extrabold text-gray-900">
              {isLogin ? 'Welcome back to Digital Library' : 'Create your Library Account'}
            </h2>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            {!isLogin && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Full Name</label>
                  <input
                    name="name"
                    type="text"
                    required
                    className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Role</label>
                  <select
                    name="role"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={formData.role}
                    onChange={handleChange}
                  >
                    <option value="MEMBER">Student</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </div>
                {formData.role === 'MEMBER' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Mobile No</label>
                    <input
                      name="mobile_no"
                      type="tel"
                      required
                      className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={formData.mobile_no}
                      onChange={handleChange}
                    />
                  </div>
                )}
              </>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Email address</label>
              <input
                name="email"
                type="email"
                required
                className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                name="password"
                type="password"
                required
                className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                {isLogin ? 'Sign in with Email' : 'Register with Email'}
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
};

export default Auth;
