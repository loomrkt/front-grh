"use client";

import Skeleton from "@/components/skeleton";
import HistoryTables from "@/features/Historiques/HistoryTables";
import { GetRemoteComponent } from "@/services/get-remote-component";
import { PaginatedResult } from "@/models/PaginatedResult";
import { getAllHistories, HistoryEntry } from "@/services/Historique";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ActionFilter = "CREATE" | "UPDATE" | "DELETE" | "ALL";

export default function Page() {
  const { PaginationControls } = GetRemoteComponent();
  const [currentPage, setCurrentPage] = useState(1);
  const [actionFilter, setActionFilter] = useState<ActionFilter>("ALL");

  const { data: Historiques } = useSuspenseQuery<PaginatedResult<HistoryEntry>>({
    queryKey: ['Historiques', currentPage, actionFilter],
    queryFn: () => getAllHistories({ 
      page: currentPage, 
      limit: 10,
      action: actionFilter === "ALL" ? undefined : actionFilter
    }),
  });

  const handleFilterChange = (value: ActionFilter) => {
    setActionFilter(value);
    setCurrentPage(1);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between w-full mb-4">
        {/* Select shadcn pour filtrer par action */}
        <div className="flex items-center gap-2">
          <label htmlFor="action-filter" className="text-sm font-medium text-gray-700">
            Filtrer par action :
          </label>
          <Select value={actionFilter} onValueChange={handleFilterChange}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Sélectionner une action" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Toutes les actions</SelectItem>
              <SelectItem value="CREATE">Créations</SelectItem>
              <SelectItem value="UPDATE">Modifications</SelectItem>
              <SelectItem value="DELETE">Suppressions</SelectItem>
            </SelectContent>
          </Select>
        </div>
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