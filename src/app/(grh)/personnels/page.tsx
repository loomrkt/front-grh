'use client';
import PersonnelsTables from "@/features/personnels/PersonnelsTables";
import { getRemoteComponent } from "@/services/get-remote-component";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getEmployes } from "@/services/employe";
import Skeleton from "@/components/skeleton";
import Link from "next/link";

export default function page() {
  const { SearchInput, CustomButton, PaginationControls } = getRemoteComponent();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const { data: employes } = useSuspenseQuery({
    queryKey: ["employes", currentPage, searchTerm],
    queryFn: () => getEmployes({ page: currentPage, limit: 10, search: searchTerm }),
  });

  return (
    <section className="h-full flex flex-col max-w-7xl m-auto">
      <div className="flex items-center justify-between w-full">
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
        {CustomButton ? (
          <div>
            <Link href="/personnels/add">
              <CustomButton>
                <Plus />
                Ajouter
              </CustomButton>
            </Link>
          </div>
        ) : (
          <Skeleton className="h-10 w-32" />
        )}
      </div>

      <div className="flex-1 overflow-y-auto mt-4 not-md:w-[80vw]">
        <PersonnelsTables employes={employes} />
      </div>

      {PaginationControls ? (
        <div className="mt-4 flex items-center justify-between w-full">
          <div className="text-sm text-gray-600">
            Liste de {employes.meta.total == 0 ? 0 : (employes.meta.page - 1) * employes.meta.limit + 1} à{' '}
            {Math.min(employes.meta.page * employes.meta.limit, employes.meta.total)} sur {employes.meta.total}
          </div>

          <div>
            <PaginationControls
              currentPage={currentPage}
              totalPages={employes.meta.totalPage}
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
    </section>
  );
}