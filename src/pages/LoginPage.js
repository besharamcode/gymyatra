import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { FiMail, FiLock, FiLogIn } from 'react-icons/fi';
import { login, reset } from '../redux/authSlice';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const { email, password } = formData;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    // Redirect when logged in
    if (isSuccess || user) {
      navigate(user?.user?.role === 'admin' ? '/admin/dashboard' : '/user/dashboard');
    }

    dispatch(reset());
  }, [isError, isSuccess, user, message, navigate, dispatch]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const userData = {
      email,
      password,
    };

    dispatch(login(userData));
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh]">
      <div className="w-full max-w-md p-8 card">
        <h1 className="text-3xl font-bold text-center mb-8">Welcome Back</h1>
        
        <form onSubmit={onSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="email">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-gray-400">
                <FiMail />
              </span>
              <input
                type="email"
                className="form-input pl-10"
                id="email"
                name="email"
                value={email}
                onChange={onChange}
                placeholder="Enter your email"
                required
              />
            </div>
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 mb-2" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-gray-400">
                <FiLock />
              </span>
              <input
                type="password"
                className="form-input pl-10"
                id="password"
                name="password"
                value={password}
                onChange={onChange}
                placeholder="Enter password"
                required
              />
            </div>
          </div>
          
          <button
            type="submit"
            className="btn btn-primary w-full flex justify-center items-center"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Log In'}
            {!isLoading && <FiLogIn className="ml-2" />}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary hover:underline">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 