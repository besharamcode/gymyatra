import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FiMenu, FiX, FiLogOut, FiUser } from 'react-icons/fi';
import { logout, reset } from '../redux/authSlice';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate('/login');
  };

  return (
    <nav className="bg-primary text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-2xl font-bold">
            GymTrack
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {user ? (
              <>
                {user.user.role === 'admin' ? (
                  <>
                    <Link to="/admin/dashboard" className="hover:text-gray-200">
                      Dashboard
                    </Link>
                    <Link to="/admin/users" className="hover:text-gray-200">
                      Users
                    </Link>
                    <Link to="/admin/exercises" className="hover:text-gray-200">
                      Exercises
                    </Link>
                    <Link to="/admin/diet-plans" className="hover:text-gray-200">
                      Diet Plans
                    </Link>
                    <Link to="/admin/workout-plans" className="hover:text-gray-200">
                      Workout Plans
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/user/dashboard" className="hover:text-gray-200">
                      Dashboard
                    </Link>
                    <Link to="/user/workout-plan" className="hover:text-gray-200">
                      My Plan
                    </Link>
                    <Link to="/user/progress" className="hover:text-gray-200">
                      Progress
                    </Link>
                  </>
                )}
                <div className="flex items-center space-x-4">
                  <Link to={user.user.role === 'admin' ? '/admin/profile' : '/user/profile'} className="flex items-center hover:text-gray-200">
                    <FiUser className="mr-1" />
                    {user.user.name}
                  </Link>
                  <button
                    onClick={onLogout}
                    className="flex items-center bg-red-600 hover:bg-red-700 px-3 py-1 rounded"
                  >
                    <FiLogOut className="mr-1" /> Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-gray-200">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-white text-primary hover:bg-gray-100 px-4 py-2 rounded"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={toggleMenu} className="text-white focus:outline-none">
              {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-4">
            {user ? (
              <>
                {user.user.role === 'admin' ? (
                  <>
                    <Link
                      to="/admin/dashboard"
                      className="block hover:text-gray-200 py-2"
                      onClick={toggleMenu}
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/admin/users"
                      className="block hover:text-gray-200 py-2"
                      onClick={toggleMenu}
                    >
                      Users
                    </Link>
                    <Link
                      to="/admin/exercises"
                      className="block hover:text-gray-200 py-2"
                      onClick={toggleMenu}
                    >
                      Exercises
                    </Link>
                    <Link
                      to="/admin/diet-plans"
                      className="block hover:text-gray-200 py-2"
                      onClick={toggleMenu}
                    >
                      Diet Plans
                    </Link>
                    <Link
                      to="/admin/workout-plans"
                      className="block hover:text-gray-200 py-2"
                      onClick={toggleMenu}
                    >
                      Workout Plans
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to="/user/dashboard"
                      className="block hover:text-gray-200 py-2"
                      onClick={toggleMenu}
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/user/workout-plan"
                      className="block hover:text-gray-200 py-2"
                      onClick={toggleMenu}
                    >
                      My Plan
                    </Link>
                    <Link
                      to="/user/progress"
                      className="block hover:text-gray-200 py-2"
                      onClick={toggleMenu}
                    >
                      Progress
                    </Link>
                  </>
                )}
                <Link
                  to={user.user.role === 'admin' ? '/admin/profile' : '/user/profile'}
                  className="block hover:text-gray-200 py-2"
                  onClick={toggleMenu}
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    onLogout();
                    toggleMenu();
                  }}
                  className="flex items-center bg-red-600 hover:bg-red-700 px-3 py-2 rounded w-full"
                >
                  <FiLogOut className="mr-1" /> Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block hover:text-gray-200 py-2"
                  onClick={toggleMenu}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block bg-white text-primary hover:bg-gray-100 px-4 py-2 rounded"
                  onClick={toggleMenu}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar; 