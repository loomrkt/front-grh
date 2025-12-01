"use client";
import { GetRemoteComponent } from "@/services/get-remote-component";
import { TableColumn } from "@/helpers/types/TableColumn";
import { Departement } from "@/models/Departement";
import { PaginatedResult } from "@/models/PaginatedResult";
import { removeDepartementById } from "@/services/Departement";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type DepartementTablesProps = {
  Departements: PaginatedResult<Departement>;
  onEdit: (id: string) => void;
};

const DepartementTables = ({ Departements, onEdit }: DepartementTablesProps) => {
  const { AppTable } = GetRemoteComponent();
  const queryClient = useQueryClient();
  const [departementToDelete, setDepartementToDelete] = useState<Departement | null>(null);

  // Mutation pour la suppression
  const deleteMutation = useMutation({
    mutationFn: (departementId: string) => {
      return removeDepartementById(departementId);
    },
    onSuccess: () => {
      // Invalider le cache pour refetch les données
      queryClient.invalidateQueries({ queryKey: ['Departements'] });
      toast.success("Département supprimé avec succès");
      setDepartementToDelete(null);
    },
    onError: (error: any) => {
      console.error("Erreur lors de la suppression:", error);
      toast.error("Erreur lors de la suppression du département");
      setDepartementToDelete(null);
    },
  });

  const HandleEdit = (departement: Departement) => {
    onEdit(departement.id);
  };

  const HandleDelete = (departement: Departement) => {
    setDepartementToDelete(departement);
  };

  const confirmDelete = () => {
    if (departementToDelete) {
      deleteMutation.mutate(departementToDelete.id);
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
    <>
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

      <AlertDialog open={!!departementToDelete} onOpenChange={() => setDepartementToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer le département "{departementToDelete?.departmentName}" (Code: {departementToDelete?.departmentCode}) ?
              Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default DepartementTables;