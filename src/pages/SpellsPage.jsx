import { useState, useEffect } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { fetchFavorites, saveFavorite, removeFavoriteFromStore, isFavorite } from '../store/favoritesSlice';

import { getSpells } from '../api/api.js';

const Spells = () => {
  const [spells, setSpells] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user, loading: authLoading } = useSelector((state) => state.auth);
  const { favorites, loading: favoritesLoading } = useSelector((state) => state.favorites);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getSpells();
        setSpells(data);
      } catch (err) {
        setError('Failed to load spells. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (user?.uid) {
      dispatch(fetchFavorites(user.uid));
    }
  }, [user?.uid, dispatch]);

  const filteredSpells = spells.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return <div className="container mx-auto p-6 text-center text-gray-200">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold text-hufflepuff-yellow mb-6">Spells</h2>
      <input
        type="text"
        placeholder="Search spells..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="p-2 bg-gray-700 text-gray-200 rounded-lg mb-6 w-full sm:w-1/2 focus:ring-2 focus:ring-hufflepuff-yellow"
        disabled={loading}
      />
      {loading && <p className="text-gray-200 text-center">Loading...</p>}
      {error && <p className="text-red-500 text-center">{error}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSpells.map(spell => (
          <div key={spell.id} className="bg-gray-800 p-4 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold text-yellow-400">{spell.name}</h3>
            <p className="text-gray-200">{spell.description}</p>
            {user && (
              <button
                onClick={() => isFavorite('spells', spell.id)({ favorites: favorites })
                  ? dispatch(removeFavoriteFromStore(user.uid, 'spells', spell.id))
                  : dispatch(saveFavorite(user.uid, 'spells', spell))}
                className="mt-2 bg-yellow-500 text-gray-900 p-2 rounded hover:bg-yellow-600 cursor-pointer"
                disabled={loading}
              >
                {isFavorite('spells', spell.id)({ favorites: favorites }) ? 'Remove from Favorites' : 'Add to Favorites'}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Spells;