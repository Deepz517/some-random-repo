import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

function HomePage() {
  const { user, logout } = useAuth();

  return (
    <div>
      <h1>Welcome to RentRoll</h1>
      {user ? (
        <div>
          <p>Welcome, {user.role}</p>
          {user.role === 'LANDLORD' && <Link to="/landlord/dashboard">Go to Dashboard</Link>}
          {user.role === 'TENANT' && <Link to="/tenant/dashboard">Go to Dashboard</Link>}
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <Link to="/login">Login</Link>
      )}
    </div>
  );
}

export default HomePage;
