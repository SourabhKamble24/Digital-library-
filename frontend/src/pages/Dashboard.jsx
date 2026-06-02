import React, { useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import { Book, CheckCircle, Clock, Users, Phone } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [history, setHistory] = useState([]);
  const [adminHistory, setAdminHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    try {
      if (user?.role === 'ADMIN') {
        const res = await api.get('/borrow/all');
        setAdminHistory(res.data);
      } else {
        const res = await api.get('/borrow/history');
        setHistory(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [user]);

  const handleReturn = async (recordId) => {
    try {
      await api.post(`/borrow/return/${recordId}`);
      alert('Book returned successfully!');
      fetchHistory(); // refresh list
    } catch (err) {
      alert(err.response?.data?.msg || 'Error returning book');
    }
  };

  if (loading) return <div className="flex justify-center p-12"><div className="animate-spin h-8 w-8 border-b-2 border-blue-600 rounded-full"></div></div>;

  if (user?.role === 'ADMIN') {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
          <Users className="h-8 w-8 text-blue-600" />
          Admin Dashboard - All Issue History
        </h1>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Book Issued</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issue Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due / Return Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status & Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {adminHistory.map(record => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-gray-900">{record.user_name}</div>
                    <div className="text-sm text-gray-500">{record.user_email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {record.user_mobile ? (
                      <div className="text-sm text-gray-900 flex items-center gap-1"><Phone className="w-4 h-4 text-blue-500"/> {record.user_mobile}</div>
                    ) : (
                      <span className="text-sm text-gray-400 italic">Not provided</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{record.title}</div>
                    <div className="text-sm text-gray-500">{record.author}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(record.borrow_date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {record.status === 'BORROWED' ? (
                      <span className="text-sm font-semibold text-orange-600">
                        Due: {new Date(record.due_date).toLocaleDateString()}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-500">
                        Returned: {new Date(record.return_date).toLocaleDateString()}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {record.status === 'BORROWED' ? (
                      <div className="flex gap-2 items-center">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          Active Issue
                        </span>
                        {record.user_mobile && (
                          <a href={`tel:${record.user_mobile}`} className="inline-flex items-center gap-1 text-sm text-white bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-md transition-colors shadow-sm">
                            Call
                          </a>
                        )}
                      </div>
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Completed
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {adminHistory.length === 0 && (
            <div className="p-6 text-center text-gray-500">No issue records found.</div>
          )}
        </div>
      </div>
    );
  }

  // Student Dashboard View
  const activeIssues = history.filter(item => item.status === 'BORROWED');
  const pastIssues = history.filter(item => item.status === 'RETURNED');

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
        <Book className="h-8 w-8 text-blue-600" />
        My Books
      </h1>

      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2 flex items-center gap-2">
          <Clock className="text-orange-500" /> Currently Issued
        </h2>
        {activeIssues.length === 0 ? (
          <p className="text-gray-500 italic">You don't have any actively issued books.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeIssues.map(record => (
              <div key={record.id} className="bg-white rounded-xl shadow-sm border border-orange-100 p-5 flex flex-col relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-orange-100 text-orange-800 text-xs font-bold px-3 py-1 rounded-bl-lg">
                  Due: {new Date(record.due_date).toLocaleDateString()}
                </div>
                <div className="flex gap-4 mb-4">
                  <img src={record.cover_image || 'https://via.placeholder.com/60x90'} className="w-16 h-24 object-cover rounded shadow-sm" alt="cover" />
                  <div>
                    <h3 className="font-bold text-lg leading-tight">{record.title}</h3>
                    <p className="text-sm text-gray-600">{record.author}</p>
                  </div>
                </div>
                <button 
                  onClick={() => handleReturn(record.id)}
                  className="mt-auto w-full bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white py-2 rounded-lg font-medium transition-colors border border-blue-100 hover:border-transparent"
                >
                  Return Book
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2 flex items-center gap-2">
          <CheckCircle className="text-green-500" /> Issue History
        </h2>
        {pastIssues.length === 0 ? (
          <p className="text-gray-500 italic">No past issue history found.</p>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Book</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issued On</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Returned On</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pastIssues.map(record => (
                  <tr key={record.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{record.title}</div>
                      <div className="text-sm text-gray-500">{record.author}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(record.borrow_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(record.return_date).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};

export default Dashboard;
