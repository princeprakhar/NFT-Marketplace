// src/components/common/EmptyState.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import Button from './Button';

interface EmptyStateProps {
  title?: string;
  message?: string;
  actionLink?: string;
  actionText?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ 
  title = 'No items found', 
  message = 'There are no items to display at the moment.', 
  actionLink,
  actionText
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="text-gray-400 text-5xl mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
      </div>
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">{title}</h2>
      <p className="text-gray-600 dark:text-gray-300 mb-6">{message}</p>
      {actionLink && actionText && (
        <Link to={actionLink}>
          <Button>
            {actionText}
          </Button>
        </Link>
      )}
    </div>
  );
};

export default EmptyState;