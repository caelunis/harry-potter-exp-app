import { Link } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/authSlice'

const Navbar = () => {
  const { user, loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch()
  
  if (loading) {
    return <div className="bg-gray-900 bg-opacity-80 p-4 text-center text-gray-200">Loading...</div>;
  }

  return (
    <nav className="bg-gray-800 p-4 flex justify-between items-center">
      <div className="text-2xl font-bold text-yellow-400">
        Hogwarts Compendium
      </div>
      <div className="space-x-4">
        <Link to="/" className="text-gray-300 hover:text-yellow-400">
          Home
        </Link>
        <Link to="/characters" className="text-gray-300 hover:text-yellow-400">
          Characters
        </Link>
        <Link to="/spells" className="text-gray-300 hover:text-yellow-400">
          Spells
        </Link>
        {user ? (
          <>
            <Link to="/profile" className="text-gray-300 hover:text-yellow-400">
              Profile
            </Link>
            <button
              onClick={() => dispatch(logout())}
              className="text-gray-300 hover:text-yellow-400"
            >
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" className="text-gray-300 hover:text-yellow-400">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
