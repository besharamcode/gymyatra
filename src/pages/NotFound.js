import { Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
      <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
      <h2 className="text-3xl font-semibold mb-6">Page Not Found</h2>
      <p className="text-gray-600 text-lg mb-8 max-w-md">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Link to="/" className="btn btn-primary flex items-center">
        <FiArrowLeft className="mr-2" /> Go Back Home
      </Link>
    </div>
  );
};

export default NotFound; 