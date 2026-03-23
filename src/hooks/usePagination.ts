import { useState, useMemo } from "react";

interface UsePaginationOptions {
  defaultPageSize?: number;
  pageSizeOptions?: number[];
}

export function usePagination<T>(
  data: T[],
  options: UsePaginationOptions = {}
) {
  const { defaultPageSize = 10, pageSizeOptions = [10, 20, 50, 100] } = options;
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);

  const totalItems = data.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  // Reset to page 1 when data changes significantly
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedData = useMemo(() => {
    const start = (safeCurrentPage - 1) * pageSize;
    return data.slice(start, start + pageSize);
  }, [data, safeCurrentPage, pageSize]);

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  return {
    paginatedData,
    currentPage: safeCurrentPage,
    pageSize,
    totalPages,
    totalItems,
    pageSizeOptions,
    goToPage,
    setPageSize: handlePageSizeChange,
  };
}
