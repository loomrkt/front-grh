import Skeleton from "@/components/skeleton";
import DepartementTables from "@/features/departements/DepartementTables";
import { remoteComponent } from "@/helpers/remote-components";
import { Departement } from "@/models/Departement.dto";
import { PaginatedResult } from "@/models/PaginatedResult";
import { getDepartements } from "@/services/Departement";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";

interface DepartementListeProps {
  onEdit: (id: string) => void;
}

const DepartementListe = ({ onEdit }: DepartementListeProps) => {
  const { SearchInput, PaginationControls } = remoteComponent();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
const { data: Departements } = useSuspenseQuery<PaginatedResult<Departement>>({
  queryKey: ['Departements', currentPage, searchTerm],
  queryFn: () => getDepartements({ page: currentPage, DepartmentName: searchTerm }),
});

  return (
    <div className="h-[80vh] flex flex-col">
      <div className="flex items-center justify-end w-full mb-4">
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
        <DepartementTables Departements={Departements} onEdit={onEdit} />
      </div>
      {PaginationControls ? (
        <div className="mt-4 flex items-center justify-between w-full">
          <div className="text-sm text-gray-600">
            Liste de {(Departements.meta.page - 1) * Departements.meta.limit + 1} à{' '}
            {Math.min(Departements.meta.page * Departements.meta.limit, Departements.meta.total)} sur{' '}
            {Departements.meta.total}
          </div>
          <div>
            <PaginationControls
              currentPage={currentPage}
              totalPages={Departements.meta.totalPage}
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
};

export default DepartementListe;