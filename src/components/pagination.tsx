import React from "react";

// types for props
type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

// This component receives current page, total pages, and page change handler
const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {

  // Generate page numbers dynamically
  const getPages = () => {
    let pages = [];

    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <div className="flex gap-2 mt-4">

      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 border rounded"
      >
        Prev
      </button>

      {getPages().map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-1 border rounded ${
            currentPage === page ? "bg-info text-white bg-orange" : ""
          }`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 border rounded"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;