import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({
  currentPage = 1,
  totalItems = 0,
  pageSize = 10,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalItems / pageSize) || 1;

  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3 bg-white border-t border-amber-100/80 rounded-b-2xl">
      <div className="text-xs sm:text-sm text-gray-500">
        Menampilkan <span className="font-semibold text-gray-700">{startItem}</span> - <span className="font-semibold text-gray-700">{endItem}</span> dari <span className="font-semibold text-gray-700">{totalItems}</span> data
      </div>

      <div className="flex items-center space-x-1 sm:space-x-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-1.5 sm:px-3 sm:py-1.5 rounded-lg border border-amber-200 text-xs sm:text-sm font-medium text-gray-600 hover:bg-amber-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center"
          title="Halaman Sebelumnya"
        >
          <ChevronLeft className="w-4 h-4 sm:mr-1" />
          <span className="hidden sm:inline">Sebelumnya</span>
        </button>

        <div className="flex items-center space-x-1">
          {getPageNumbers().map((page, idx) =>
            page === '...' ? (
              <span key={`dots-${idx}`} className="px-2 py-1 text-gray-400 text-xs">
                ...
              </span>
            ) : (
              <button
                key={`page-${page}`}
                onClick={() => onPageChange(page)}
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg text-xs sm:text-sm font-semibold transition-colors ${
                  currentPage === page
                    ? 'bg-[#E8913A] text-white shadow-sm'
                    : 'text-gray-600 hover:bg-amber-50 border border-transparent'
                }`}
              >
                {page}
              </button>
            )
          )}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-1.5 sm:px-3 sm:py-1.5 rounded-lg border border-amber-200 text-xs sm:text-sm font-medium text-gray-600 hover:bg-amber-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center"
          title="Halaman Berikutnya"
        >
          <span className="hidden sm:inline">Berikutnya</span>
          <ChevronRight className="w-4 h-4 sm:ml-1" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
