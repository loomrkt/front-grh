"use client";
import { getRemoteComponent } from "@/services/get-remote-component";
import { TableColumn } from "@/helpers/types/TableColumn";
import { Departement } from "@/models/Departement";
import { PaginatedResult } from "@/models/PaginatedResult";
import { removeDepartementById } from "@/services/Departement";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

type DepartementTablesProps = {
  Departements: PaginatedResult<Departement>;
  onEdit: (id: string) => void;
};

const DepartementTables = ({ Departements, onEdit }: DepartementTablesProps) => {
  const { AppTable } = getRemoteComponent();
  const queryClient = useQueryClient();

  // Mutation pour la suppression
  const deleteMutation = useMutation({
    mutationFn: (departementId: string) => {
      return removeDepartementById(departementId);
    },
    onSuccess: () => {
      // Invalider le cache pour refetch les données
      queryClient.invalidateQueries({ queryKey: ['Departements'] });
      toast.success("Département supprimé avec succès");
    },
    onError: (error: any) => {
      console.error("Erreur lors de la suppression:", error);
      toast.error("Erreur lors de la suppression du département");
    },
  });

  const HandleEdit = (departement: Departement) => {
    onEdit(departement.id);
  };

  const HandleDelete = (departement: Departement) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer le département "${departement.departmentName}" ?`)) {
      deleteMutation.mutate(departement.id);
    }
  };

  const columns: TableColumn<Departement>[] = [
    { key: "departmentCode", header: "Departement code" },
    { key: "departmentName", header: "Nom du Departement" },
    { key: "parentDepartment", header: "Département" },
  ];

  const paginatedData = Departements.data;

  const TableSkeleton = () => (
    <div className="mt-4 shadow-md rounded-lg overflow-hidden">
      <div className="grid grid-cols-5 gap-4 p-4 bg-gray-100">
        {columns.map((_, index) => (
          <div key={index} className="h-6 bg-gray-200 animate-pulse rounded" />
        ))}
      </div>
      {Array.from({ length: 10 }).map((_, rowIndex) => (
        <div key={rowIndex} className="grid grid-cols-5 gap-4 p-4 border-t">
          {columns.map((_, colIndex) => (
            <div key={colIndex} className="h-6 bg-gray-200 animate-pulse rounded" />
          ))}
        </div>
      ))}
    </div>
  );

  if (!Departements || Departements.meta.total === 0) {
    return <p className="text-center mt-8">Aucun personnel trouvé.</p>
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

export default DepartementTables;