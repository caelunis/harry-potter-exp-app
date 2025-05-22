import { useSelector } from 'react-redux';

const Profile = () => {
  const { user, loading: authLoading } = useSelector((state) => state.auth);
  const { favorites, loading: favoritesLoading } = useSelector((state) => state.favorites);

  if (authLoading || favoritesLoading) {
    return <div className="container mx-auto p-6 text-center">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="container mx-auto p-6 text-center text-gray-200">
        Please log in to view your profile.
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold text-hufflepuff-yellow mb-6">Profile</h2>
      <div className="card mb-6">
        <p><strong>Username:</strong> {user.username}</p>
        <p><strong>House:</strong> {user.house}</p>
      </div>
      <h3 className="text-2xl font-semibold text-hufflepuff-yellow mb-4">Favorites</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {favorites.characters.map(character => (
          <div key={character.id} className="card bg-gray-800 p-4 rounded-lg shadow-lg">
            <h4 className="text-lg font-semibold text-yellow-500">{character.name}</h4>
            <p className="text-white"><strong>House:</strong> {character.house || 'Unknown'}</p>
          </div>
        ))}
        {favorites.spells.map(spell => (
          <div key={spell.id} className="card bg-gray-800 p-4 rounded-lg shadow-lg">
            <h4 className="text-lg font-semibold text-yellow-500">{spell.name}</h4>
            <p className="text-white">{spell.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profile;