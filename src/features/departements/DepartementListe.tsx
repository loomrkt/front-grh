import Skeleton from "@/components/skeleton";
import DepartementTables from "@/features/departements/DepartementTables";
import { getRemoteComponent } from "@/services/get-remote-component";
import { Departement } from "@/models/Departement";
import { PaginatedResult } from "@/models/PaginatedResult";
import { getDepartements } from "@/services/Departement";
import { useSuspenseQuery } from "@tanstack/react-query";
import { use, useState } from "react";
import FormDepartement from "./FormDepartement";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import Link from "next/link";

const DepartementListe = () => {
  const { CustomButton, SearchInput, PaginationControls } = getRemoteComponent();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const { data: Departements } = useSuspenseQuery<PaginatedResult<Departement>>({
    queryKey: ['Departements', currentPage, searchTerm],
    queryFn: () => getDepartements({ page: currentPage, limit:10, search: searchTerm }),
  });
  // Changement: null pour l'ajout, string pour l'édition
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleEditDepartment = (id: string) => {
    setSelectedDepartmentId(id);
    setIsDialogOpen(true);
  };

  const handleAddDepartment = () => {
    setSelectedDepartmentId(null); // null pour un nouvel ajout
    setIsDialogOpen(true);
  };

  const handleCancel = () => {
    setSelectedDepartmentId(null);
    setIsDialogOpen(false);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="not-md:flex-col items-end md:flex-row flex md:items-center md:justify-between gap-5 w-full mb-4">
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
        <div className="flex items-center gap-2">
          {CustomButton ? (
            <Link href="/departements/hierarchie">
              <CustomButton>
                Hierachy
              </CustomButton>
            </Link>
          ) : (
            <Skeleton className="h-10 w-32" />
          )}
          {
            CustomButton ? (
              <CustomButton onClick={handleAddDepartment}>
                <Plus className="h-4 w-4 mr-2" />
                Ajouter un département
              </CustomButton>
            ) : (
              <Skeleton className="h-10 w-32" />
            )
          }
        </div>
      </div>
      
      <Dialog open={isDialogOpen} onOpenChange={handleCancel}>
        <DialogContent className="sm:max-w-[calc(100vw-2rem)] md:max-w-[calc(90vw-2rem)] xl:max-w-[1200px] sm:w-full p-0">
          <FormDepartement 
            departmentId={selectedDepartmentId} 
            onCancel={handleCancel} 
          />
        </DialogContent>
      </Dialog>
      
      <div className="overflow-y-auto mt-4 not-md:w-[80vw]">
        <DepartementTables Departements={Departements} onEdit={handleEditDepartment} />
      </div>
      
      {PaginationControls ? (
        <div className="mt-4 flex items-center justify-between w-full">
          <div className="text-sm text-gray-600">
            Liste de {Departements.meta.total == 0 ? 0 : (Departements.meta.page - 1) * Departements.meta.limit + 1} à{' '}
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