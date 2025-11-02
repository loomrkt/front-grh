"use client";
import { getRemoteComponent } from "@/services/get-remote-component";
import { TableColumn } from "@/helpers/types/TableColumn";
import { Poste } from "@/models/Poste";
import { PaginatedResult } from "@/models/PaginatedResult";
import { removePosteById } from "@/services/poste";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

type PosteTablesProps = {
  Postes: PaginatedResult<Poste>;
  onEdit: (id: string) => void;
};

const PosteTables = ({ Postes, onEdit }: PosteTablesProps) => {
  const { AppTable } = getRemoteComponent();
  const queryClient = useQueryClient();
  
  // Mutation pour la suppression
  const deleteMutation = useMutation({
    mutationFn: (posteId: string) => {
      return removePosteById(posteId);
    },
    onSuccess: () => {
      // Invalider le cache pour refetch les données
      queryClient.invalidateQueries({ 
        queryKey: ["Postes"]
      });
      toast.success("Poste supprimé avec succès");
    },
    onError: (error: any) => {
      console.error("Erreur lors de la suppression:", error);
      toast.error("Erreur lors de la suppression du poste");
    },
  });

  const HandleEdit = (poste: Poste) => {
    onEdit(poste.postId);
  };

  const HandleDelete = (poste: Poste) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer le poste "${poste.postId}" ?`)) {
      deleteMutation.mutate(poste.postId);
    }
  };

  const columns: TableColumn<Poste>[] = [
    { key: "posteCode", header: "Poste code" },
    { key: "posteTitle", header: "Nom du poste" },
    { key: "departmentName", header: "Département" },
  ];

  const paginatedData = Postes.data;

  const TableSkeleton = () => (
    <div className="mt-4 shadow-md rounded-lg overflow-hidden">
      <div className="grid grid-cols-4 gap-4 p-4 bg-gray-100">
        {columns.map((_, index) => (
          <div key={index} className="h-6 bg-gray-200 animate-pulse rounded" />
        ))}
      </div>
      {Array.from({ length: 10 }).map((_, rowIndex) => (
        <div key={rowIndex} className="grid grid-cols-4 gap-4 p-4 border-t">
          {columns.map((_, colIndex) => (
            <div key={colIndex} className="h-6 bg-gray-200 animate-pulse rounded" />
          ))}
        </div>
      ))}
    </div>
  );

  if (!Postes || Postes.meta.total === 0) {
    return <p className="text-center mt-8">Aucun poste trouvé.</p>;
  }

  return (
    <div className="mt-4 max-w-7xl mx-auto">
      {AppTable ? (
        <AppTable
          columns={columns}
          data={paginatedData}
          className="shadow-md rounded-lg"
          align="leftCenterRight"
          useActionButtons={true}
          onClickEdit={HandleEdit}
          onClickDelete={HandleDelete}
        />
      ) : (
        <TableSkeleton />
      )}
    </div>
  );
};

export default PosteTables;