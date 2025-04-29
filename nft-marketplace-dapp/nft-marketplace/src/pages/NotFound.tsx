import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';

const NotFound: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
      <h1 className="text-6xl font-bold text-indigo-600 mb-4">404</h1>
      <h2 className="text-3xl font-semibold text-gray-800 dark:text-white mb-4">Page Not Found</h2>
      <p className="text-lg text-gray-600 dark:text-gray-300 text-center mb-8">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link to="/">
        <Button>
          Return to Home
        </Button>
      </Link>
    </div>
  );
};

export default NotFound;