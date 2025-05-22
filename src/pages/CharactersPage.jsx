import { useState, useEffect } from "react";

import { useSelector, useDispatch } from "react-redux";
import {fetchFavorites, saveFavorite, removeFavoriteFromStore, isFavorite} from "../store/favoritesSlice";

import { getCharacters, getStudents, getStaff } from "../api/api";

const CharactersPage = () => {
  const [characters, setCharacters] = useState([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { user, loading: authLoading } = useSelector((state) => state.auth);
  const { favorites, loading: favoritesLoading } = useSelector(
    (state) => state.favorites
  );
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        switch (filter) {
          case "students":
            getStudents().then((data) => setCharacters(data));
            break;
          case "staff":
            getStaff().then((data) => setCharacters(data));
            break;
          default:
            getCharacters.then((data) => setCharacters(data));
        }
      } catch (error) {
        setError("Failed to load characters. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [filter]);

  useEffect(() => {
    if (user?.uid) {
      dispatch(fetchFavorites(user.uid));
    }
  }, [user?.uid, dispatch]);

  const filteredCharacters = characters.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return <div className="container mx-auto p-6 text-center">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl text-yellow-400 mb-4">Characters</h2>
      <div className="flex mb-4">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="p-2 bg-gray-700 text-white rounded mr-4"
        >
          <option value="all">All Characters</option>
          <option value="students">Students</option>
          <option value="staff">Staff</option>
        </select>
        <input
          type="text"
          placeholder="Search characters..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 bg-gray-700 text-white rounded"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filteredCharacters.map((character) => (
          <div
            key={character.id}
            className="bg-gray-800 p-4 rounded-lg shadow-lg"
          >
            {character.image && (
              <img
                src={character.image}
                alt={character.name}
                className="w-full h-100 object-cover rounded mb-4"
              />
            )}
            <h3 className="text-xl text-yellow-400">{character.name}</h3>
            <p className="text-white">
              <strong>House:</strong> {character.house || "Unknown"}
            </p>
            <p className="text-white">
              <strong>Species:</strong> {character.species}
            </p>
            <p className="text-white">
              <strong>Ancestry:</strong> {character.ancestry}
            </p>
            <p className="text-white">
              <strong>Wand:</strong> {character.wand.wood},{" "}
              {character.wand.core}, {character.wand.length}"
            </p>
            {user && (
              <button
                onClick={() => isFavorite('characters', character.id)({ favorites: favorites })
                  ? dispatch(removeFavoriteFromStore(user.uid, 'characters', character.id))
                  : dispatch(saveFavorite(user.uid, 'characters', character))}
                className="mt-2 bg-yellow-500 text-gray-900 p-2 rounded hover:bg-yellow-600"
              >
                {isFavorite('characters', character.id)({ favorites: favorites })
                  ? "Remove from Favorites"
                  : "Add to Favorites"}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CharactersPage;
