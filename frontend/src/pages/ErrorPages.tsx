import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export const NotFoundPage = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
    <div className="text-center">
      <h1 className="text-9xl font-bold text-gray-200 dark:text-gray-800">404</h1>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-4">Page not found</h2>
      <p className="text-gray-500 dark:text-gray-400 mt-2 mb-6">
        The page you're looking for doesn't exist.
      </p>
      <Link to="/dashboard">
        <Button>Go to Dashboard</Button>
      </Link>
    </div>
  </div>
);

export const UnauthorizedPage = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
    <div className="text-center">
      <h1 className="text-9xl font-bold text-gray-200 dark:text-gray-800">403</h1>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-4">Access Denied</h2>
      <p className="text-gray-500 dark:text-gray-400 mt-2 mb-6">
        You don't have permission to access this page.
      </p>
      <Link to="/dashboard">
        <Button>Go to Dashboard</Button>
      </Link>
    </div>
  </div>
);
