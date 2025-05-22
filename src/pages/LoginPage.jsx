import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { login } from '../store/authSlice'

const LoginPage = () => {
  const { loading, error } = useSelector((state) => state.auth);
  const dispatch = useDispatch()
  const navigate = useNavigate();

  const [username, setUsername] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username) return;
    try {
      await dispatch(login(username));
      navigate('/profile');
    } catch (error) {
      console.log('error:', error)
    }
  };

  if (loading) {
    return <div className="container mx-auto p-6 text-center text-gray-200">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h2 className="text-2xl text-yellow-400 mb-4">Login</h2>
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter username"
          className="w-full p-2 mb-4 bg-gray-700 text-white rounded"
          disabled={loading}
        />
        <button
          onClick={handleSubmit}
          className="w-full bg-yellow-500 text-gray-900 p-2 rounded hover:bg-yellow-600"
          disabled={loading || !username}
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
