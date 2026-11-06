import { MdChevronLeft, MdChevronRight } from 'react-icons/md';
import '../../styles/controls.css';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

type PageItem = number | 'gap';

// Always shows the first page, the last page and the pages next to the current one
const getPageItems = (currentPage: number, totalPages: number): PageItem[] => {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const visiblePages = [1, totalPages, currentPage - 1, currentPage, currentPage + 1]
    .filter((page, index, pages) => page >= 1 && page <= totalPages && pages.indexOf(page) === index)
    .sort((first, second) => first - second);

  const items: PageItem[] = [];
  visiblePages.forEach((page, index) => {
    if (index > 0 && page - visiblePages[index - 1] > 1) items.push('gap');
    items.push(page);
  });
  return items;
};

function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <nav className="pagination" aria-label="Pagination">
      <ul className="pagination-list">
        <li>
          <button
            type="button"
            className="pagination-button"
            aria-label="Previous page"
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
          >
            <MdChevronLeft aria-hidden="true" />
          </button>
        </li>

        {getPageItems(currentPage, totalPages).map((item, index) =>
          item === 'gap' ? (
            <li key={`gap-${index}`} className="pagination-gap" aria-hidden="true">
              …
            </li>
          ) : (
            <li key={item}>
              <button
                type="button"
                className="pagination-button"
                aria-label={`Page ${item}`}
                aria-current={item === currentPage ? 'page' : undefined}
                onClick={() => onPageChange(item)}
              >
                {item}
              </button>
            </li>
          ),
        )}

        <li>
          <button
            type="button"
            className="pagination-button"
            aria-label="Next page"
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(currentPage + 1)}
          >
            <MdChevronRight aria-hidden="true" />
          </button>
        </li>
      </ul>
    </nav>
  );
}

export default Pagination;