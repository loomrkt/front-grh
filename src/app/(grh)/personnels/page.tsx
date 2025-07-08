'use client';
import PersonnelsTables from "@/features/personnels/PersonnelsTables";
import { remoteComponent } from "@/helpers/remote-components";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getEmployes } from "@/services/employe";

// Skeleton component for loading states
const Skeleton = ({ className }: { className: string }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

export default function page() {
  const { SearchInput, CustomButton, PaginationControls } = remoteComponent();
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  
  const { data: employes } = useSuspenseQuery({
    queryKey: ["employes"],
    queryFn: getEmployes,
  });

  return (
    <section className="h-full flex flex-col">
      <div className="flex items-center justify-between w-full">
        {SearchInput ? (
          <div className="w-[250px]">
            <SearchInput />
          </div>
        ) : (
          <Skeleton className="h-10 w-[250px]" />
        )}
        {CustomButton ? (
          <div>
            <CustomButton onClick={() => router.push('/personnels/add')}>
              <Plus />
              Ajouter
            </CustomButton>
          </div>
        ) : (
          <Skeleton className="h-10 w-32" />
        )}
      </div>

      <div className="flex-1 overflow-y-auto mt-4">
        <PersonnelsTables currentPage={currentPage} />
      </div>

      {PaginationControls ? (
        <div className="mt-4 flex items-center justify-between w-full">
          <div className="text-sm text-gray-600">
            Liste de {(employes.meta.page - 1) * employes.meta.limit + 1} à{' '}
            {Math.min(employes.meta.page * employes.meta.limit, employes.meta.total)} sur {employes.meta.total}
          </div>

          <div>
            <PaginationControls
              currentPage={currentPage}
              totalPages={employes.meta.total}
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