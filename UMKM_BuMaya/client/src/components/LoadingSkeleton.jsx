import React from 'react';

const LoadingSkeleton = ({ rows = 5 }) => {
  return (
    <div className="w-full bg-white rounded-2xl p-6 border border-amber-100 shadow-sm animate-pulse space-y-4">
      <div className="h-6 bg-amber-100/60 rounded-md w-1/4"></div>
      <div className="space-y-3 pt-2">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center space-x-4">
            <div className="h-4 bg-amber-50 rounded w-1/12"></div>
            <div className="h-4 bg-amber-50 rounded w-4/12"></div>
            <div className="h-4 bg-amber-50 rounded w-2/12"></div>
            <div className="h-4 bg-amber-50 rounded w-3/12"></div>
            <div className="h-4 bg-amber-50 rounded w-2/12"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LoadingSkeleton;
