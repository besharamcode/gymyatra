import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = ({ children, isAdmin = false }) => {
  const { user } = useSelector((state) => state.auth);

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (isAdmin && user.user.role !== 'admin') {
    return <Navigate to="/user/dashboard" />;
  }

  return children;
};

export default PrivateRoute; 