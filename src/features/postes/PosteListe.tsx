import Skeleton from "@/components/skeleton";
import PosteTables from "@/features/postes/PosteTables";
import { GetRemoteComponent } from "@/services/get-remote-component";
import { Poste } from "@/models/Poste";
import { PaginatedResult } from "@/models/PaginatedResult";
import { getPostes } from "@/services/poste";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import FormPoste from "./FormPoste";
import { getDepartements } from "@/services/Departement";
import { Departement } from "@/models/Departement";

const PosteListe = () => {
  const { SearchInput, PaginationControls, CustomButton } = GetRemoteComponent();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [departementId, setDepartementId] = useState<string | null>(null);

  const [selectedPosteId, setSelectedPosteId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const handleEditPoste = (id: string) => {
    setSelectedPosteId(id);
    setIsDialogOpen(true);
  }

  const handleAddPoste = () => {
    setSelectedPosteId(null);
    setIsDialogOpen(true);
  };

  const handleCancel = () => {
    setSelectedPosteId(null);
    setIsDialogOpen(false);
  }

  const { data: Postes } = useSuspenseQuery<PaginatedResult<Poste>>({
    queryKey: ['Postes', currentPage, searchTerm, departementId],
    queryFn: () => getPostes({ 
      page: currentPage,
      limit: 10, 
      search: searchTerm, 
      departmentId: departementId || undefined 
    }),
  });

  const { data: Departements } = useSuspenseQuery<PaginatedResult<Departement>>({
    queryKey: ['Departements'],
    queryFn: () => getDepartements({ page: 1 }),
  });

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between w-full mb-4 gap-3">
        <div className="flex items-center gap-3 flex-1">
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
          
          <Select
            value={departementId || "all"}
            onValueChange={(value) => {
              setDepartementId(value === "all" ? null : value);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Tous les départements" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les départements</SelectItem>
              {Departements?.data?.map((dept) => (
                <SelectItem key={dept.id} value={dept.id}>
                  {dept.departmentName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {CustomButton ? (
          <CustomButton onClick={handleAddPoste}>
            <Plus className="h-4 w-4 mr-2" />
            Ajouter un poste
          </CustomButton>
        ) : (
          <Skeleton className="h-10 w-32" />
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[calc(100vw-2rem)] md:max-w-[calc(90vw-2rem)] xl:max-w-[1200px] sm:w-full p-0">
          <FormPoste
            posteId={selectedPosteId}
            onCancel={handleCancel}
          />
        </DialogContent>
      </Dialog>

      <div className="overflow-y-auto mt-4 not-md:w-[80vw]">
        <PosteTables Postes={Postes} onEdit={handleEditPoste} />
      </div>
      
      {PaginationControls ? (
        <div className="mt-4 flex items-center justify-between w-full">
          <div className="text-sm text-gray-600">
            Liste de {Postes.meta.total == 0 ? 0 : (Postes.meta.page - 1) * Postes.meta.limit + 1} à{' '}
            {Math.min(Postes.meta.page * Postes.meta.limit, Postes.meta.total)} sur{' '}
            {Postes.meta.total}
          </div>
          <div>
            <PaginationControls
              currentPage={currentPage}
              totalPages={Postes.meta.totalPage}
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

export default PosteListe;