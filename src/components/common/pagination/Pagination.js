// Pagination.jsx
import React from "react";

const Pagination = ({ currentPage, paginate, moviesPerPage, items }) => {
  const totalPages = Math.ceil(items.length / moviesPerPage);

  const renderPageNumbers = () => {
    const pageNumbers = [];

    for (let i = 1; i <= totalPages; i++) {
      const isFirstPage = i === 1;
      const isLastPage = i === totalPages;
      const isCurrentPage = currentPage === i;

      if (
        isFirstPage ||
        isLastPage ||
        (i >= currentPage - 2 && i <= currentPage + 2)
      ) {
        pageNumbers.push(
          <li
            key={i}
            onClick={() => paginate(i)}
            className={isCurrentPage ? "active" : ""}
          >
            {i}
          </li>
        );
      } else if (i === 2 || i === totalPages - 1) {
        pageNumbers.push(
          <li key={i} className="dots">
            ...
          </li>
        );
      }
    }

    return pageNumbers;
  };

  return (
    <section className="pagination">
      <div className="button-container">
        <ul className="pages">
          <button
            className="prev"
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            style={{ display: currentPage === 1 ? "none" : "block" }}
          >
            Prev
          </button>
          {renderPageNumbers()}
          <button
            className="next"
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            style={{
              display: currentPage === totalPages ? "none" : "block",
            }}
          >
            Next
          </button>
        </ul>
      </div>
    </section>
  );
};

export default Pagination;
