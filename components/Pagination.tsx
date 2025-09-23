import {
  Pagination as PaginationComponent,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
}

interface Props {
  pagination: PaginationMeta;
  changePage: (page: number) => void;
}

export default function Pagination({ pagination, changePage }: Props) {
  const { total, page, limit } = pagination;

  const totalPages = Math.ceil(total / limit);

  const hasNextPage = totalPages > 0 && page < totalPages;
  const hasPreviousPage = totalPages > 0 && page > 1;

  const handlePrevious = () => {
    if (hasPreviousPage) {
      changePage(page - 1);
    }
  };

  const handleNext = () => {
    if (hasNextPage) {
      changePage(page + 1);
    }
  };

  const handlePageChange = (pageNumber: number) => {
    if (pageNumber !== page) {
      changePage(pageNumber);
    }
  };

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  const maxPageNum = 5;
  const pageNumLimit = Math.floor(maxPageNum / 2);

  const activePages = pageNumbers.slice(
    Math.max(0, page - 1 - pageNumLimit),
    Math.min(page - 1 + pageNumLimit + 1, pageNumbers.length)
  );

  const renderPages = () => {
    const renderedPages = activePages.map((pageNumber) => (
      <PaginationItem key={pageNumber}>
        <PaginationLink
          className={`cursor-pointer ${page === pageNumber ? "bg-button" : ""}`}
          onClick={() => handlePageChange(pageNumber)}
        >
          {pageNumber}
        </PaginationLink>
      </PaginationItem>
    ));

    if (activePages[0] > 1) {
      renderedPages.unshift(
        <PaginationEllipsis
          key="ellipsis-start"
          onClick={() => changePage(activePages[0] - 1)}
        />
      );
    }

    if (activePages[activePages.length - 1] < pageNumbers.length) {
      renderedPages.push(
        <PaginationEllipsis
          key="ellipsis-end"
          onClick={() => changePage(activePages[activePages.length - 1] + 1)}
        />
      );
    }

    return renderedPages;
  };

  return (
    <>
      {totalPages > 1 && (
        <PaginationComponent className="mt-4">
          <PaginationContent>
            {hasPreviousPage && (
              <PaginationItem className="cursor-pointer">
                <PaginationPrevious onClick={handlePrevious} />
              </PaginationItem>
            )}

            {renderPages()}

            {hasNextPage && (
              <PaginationItem className="cursor-pointer">
                <PaginationNext onClick={handleNext} />
              </PaginationItem>
            )}
          </PaginationContent>
        </PaginationComponent>
      )}
    </>
  );
}
