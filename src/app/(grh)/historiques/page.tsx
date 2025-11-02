"use client";

import Skeleton from "@/components/skeleton";
import HistoryTables from "@/features/Historiques/HistoryTables";
import { getRemoteComponent } from "@/services/get-remote-component";
import { PaginatedResult } from "@/models/PaginatedResult";
import { getAllHistories, HistoryEntry } from "@/services/Historique";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";

export default function Page() {
      const { SearchInput, PaginationControls, CustomButton } = getRemoteComponent();
        const [searchTerm, setSearchTerm] = useState("");
        const [currentPage, setCurrentPage] = useState(1);

          const { data: Historiques } = useSuspenseQuery<PaginatedResult<HistoryEntry>>({
            queryKey: ['Historiques', currentPage, searchTerm],
            queryFn: () => getAllHistories({ page: currentPage, limit: 10, search: searchTerm }),
        });
    return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between w-full mb-4">
        {SearchInput ? (
          <div className="w-[250px]">
            <SearchInput
              value={searchTerm}
              onChange={setSearchTerm} 
            />
          </div>
        ) : (
          <Skeleton className="h-10 w-[250px]" />
        )}
        </div>
        <div className="overflow-y-auto mt-4 not-md:w-[80vw]">
            <HistoryTables histories={Historiques} />
        </div>
        {PaginationControls ? (
        <div className="mt-4 flex items-center justify-between w-full">
          <div className="text-sm text-gray-600">
            Liste de {Historiques.meta.total == 0 ? 0 : (Historiques.meta.page - 1) * Historiques.meta.limit + 1} à{' '}
            {Math.min(Historiques.meta.page * Historiques.meta.limit, Historiques.meta.total)} sur{' '}
            {Historiques.meta.total}
          </div>
          <div>
            <PaginationControls
              currentPage={currentPage}
              totalPages={Historiques.meta.totalPage}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      ) : (
        <div className="mt-4 flex items-center justify-between w-full">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-10 w-64" />
        </div>
      )}
    </div>
    );
}

