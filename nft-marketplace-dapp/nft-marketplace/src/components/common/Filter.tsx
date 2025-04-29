import React, { useState } from 'react';
import Button from '../common/Button';

interface FilterProps {
  onFilterChange: (filters: FilterValues) => void;
}

export interface FilterValues {
  priceRange: [number, number];
  sortBy: 'newest' | 'oldest' | 'priceHighToLow' | 'priceLowToHigh';
  status: 'all' | 'forSale' | 'notForSale';
}

const defaultFilters: FilterValues = {
  priceRange: [0, 100],
  sortBy: 'newest',
  status: 'all'
};

const Filter: React.FC<FilterProps> = ({ onFilterChange }) => {
  const [filters, setFilters] = useState<FilterValues>(defaultFilters);
  const [isOpen, setIsOpen] = useState(false);

  const handleFilterChange = (
    key: keyof FilterValues,
    value: FilterValues[keyof FilterValues]
  ) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
  };

  const handlePriceChange = (index: number, value: number) => {
    const newPriceRange = [...filters.priceRange] as [number, number];
    newPriceRange[index] = value;
    handleFilterChange('priceRange', newPriceRange);
  };

  const applyFilters = () => {
    onFilterChange(filters);
    setIsOpen(false);
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Filters</h3>
        <Button 
          onClick={() => setIsOpen(!isOpen)}
          variant="outline"
          className="text-sm py-1 px-2"
        >
          {isOpen ? 'Hide Filters' : 'Show Filters'}
        </Button>
      </div>

      {isOpen && (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 mb-2">Price Range (ETH)</label>
            <div className="flex space-x-4">
              <input
                type="number"
                min="0"
                step="0.01"
                value={filters.priceRange[0]}
                onChange={(e) => handlePriceChange(0, parseFloat(e.target.value))}
                className="w-1/2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                placeholder="Min"
              />
              <input
                type="number"
                min="0"
                step="0.01"
                value={filters.priceRange[1]}
                onChange={(e) => handlePriceChange(1, parseFloat(e.target.value))}
                className="w-1/2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                placeholder="Max"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 mb-2">Sort By</label>
            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value as FilterValues['sortBy'])}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="priceHighToLow">Price: High to Low</option>
              <option value="priceLowToHigh">Price: Low to High</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 mb-2">Status</label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value as FilterValues['status'])}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All</option>
              <option value="forSale">For Sale</option>
              <option value="notForSale">Not For Sale</option>
            </select>
          </div>

          <div className="flex space-x-4">
            <Button onClick={applyFilters} className="flex-1">
              Apply Filters
            </Button>
            <Button onClick={resetFilters} variant="outline" className="flex-1">
              Reset
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
export default Filter;