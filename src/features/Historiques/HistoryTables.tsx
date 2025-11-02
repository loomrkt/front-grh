"use client";
import { getRemoteComponent } from "@/services/get-remote-component";
import { TableColumn } from "@/helpers/types/TableColumn";
import { PaginatedResult } from "@/models/PaginatedResult";
import { HistoryEntry, HistoryEntryDetail, getHistoryById } from "@/services/Historique";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { JSX, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

// Extend HistoryEntry to include formattedTimestamp
type ExtendedHistoryEntry = HistoryEntry & { formattedTimestamp: string };

type HistoryTablesProps = {
  histories: PaginatedResult<HistoryEntry>;
  queryKey?: string[];
};

const HistoryTables = ({ histories, queryKey = ["histories"] }: HistoryTablesProps) => {
  const { AppTable } = getRemoteComponent();
  const queryClient = useQueryClient();
  const [selectedHistoryId, setSelectedHistoryId] = useState<string | null>(null);

  // Query to fetch details of the selected history entry
  const { data: historyDetail, isLoading: isLoadingDetail } = useQuery({
    queryKey: ["historyDetail", selectedHistoryId],
    queryFn: () => getHistoryById(selectedHistoryId!),
    enabled: !!selectedHistoryId,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      throw new Error("Suppression de l'historique non implémentée.");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      toast.success("Historique supprimé avec succès");
    },
    onError: (error: any) => {
      console.error("Erreur :", error);
      toast.error("Erreur lors de la suppression");
    },
  });

  const handleEdit = (history: HistoryEntry) => {
    console.log("Pas d'édition pour les historiques : ", history.id);
  };

  const handleDelete = (history: HistoryEntry) => {
    if (window.confirm(`Supprimer cette entrée d'historique ?`)) {
      deleteMutation.mutate(history.id);
    }
  };

  // Function to handle row click
  const handleRowClick = (history: ExtendedHistoryEntry) => {
    setSelectedHistoryId(history.id);
  };

  const columns: TableColumn<ExtendedHistoryEntry>[] = [
    { key: "operation", header: "Action" },
    { key: "entityName", header: "Entité" },
    { key: "formattedTimestamp", header: "Date d'action" },
  ];

  // Map data to include formattedTimestamp
  const paginatedData: ExtendedHistoryEntry[] = histories.data.map((history) => ({
    ...history,
    formattedTimestamp: (() => {
      try {
        const date = new Date(history.timestamp);
        return format(date, "dd/MM/yyyy HH:mm", { locale: fr });
      } catch (error) {
        console.error("Erreur de formatage de la date :", error);
        return history.timestamp as string;
      }
    })(),
  }));

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

  // Function to format values in a user-readable way, excluding null/undefined
  const formatValue = (value: any): JSX.Element => {
    if (value === null || value === undefined) {
      return <span className="text-muted-foreground">Aucune donnée</span>;
    }
    if (typeof value === "object") {
      // Handle specific case for Employe entity
      if (value.Adress || value.Identity || value.Contact || value.CivilStatus) {
        const sections: JSX.Element[] = [];
        const addSection = (sectionName: string, data: any) => {
          const validEntries = Object.entries(data).filter(
            ([_, val]) => val !== null && val !== undefined && (!Array.isArray(val) || val.length > 0),
          );
          if (validEntries.length > 0) {
            sections.push(
              <div key={sectionName}>
                <h4 className="font-medium text-sm">{sectionName}</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {validEntries.map(([key, val]) => (
                    <li key={key} className="text-sm">
                      <span className="font-medium">{key}:</span>{" "}
                      {Array.isArray(val) ? val.join(", ") : String(val)}
                    </li>
                  ))}
                </ul>
              </div>,
            );
          }
        };

        if (value.Adress) addSection("Adresse", value.Adress);
        if (value.Identity) addSection("Identité", value.Identity);
        if (value.Contact) addSection("Contact", value.Contact);
        if (value.CivilStatus) addSection("État Civil", value.CivilStatus);

        // Handle top-level fields (e.g., Id, Matricule)
        const topLevelEntries = Object.entries(value)
          .filter(([key]) => !["Adress", "Identity", "Contact", "CivilStatus"].includes(key))
          .filter(([_, val]) => val !== null && val !== undefined && (!Array.isArray(val) || val.length > 0));
        if (topLevelEntries.length > 0) {
          sections.push(
            <div key="topLevel">
              <ul className="list-disc pl-5 space-y-1">
                {topLevelEntries.map(([key, val]) => (
                  <li key={key} className="text-sm">
                    <span className="font-medium">{key}:</span>{" "}
                    {Array.isArray(val) ? val.join(", ") : String(val)}
                  </li>
                ))}
              </ul>
            </div>,
          );
        }

        return sections.length > 0 ? (
          <div className="space-y-2">{sections}</div>
        ) : (
          <span className="text-muted-foreground">Aucune donnée</span>
        );
      }

      // General case for other objects
      const validEntries = Object.entries(value).filter(
        ([_, val]) => val !== null && val !== undefined && (!Array.isArray(val) || val.length > 0),
      );
      if (validEntries.length === 0) {
        return <span className="text-muted-foreground">Aucune donnée</span>;
      }
      return (
        <ul className="list-disc pl-5 space-y-1">
          {validEntries.map(([key, val]) => (
            <li key={key} className="text-sm">
              <span className="font-medium">{key}:</span>{" "}
              {Array.isArray(val) ? val.join(", ") : String(val)}
            </li>
          ))}
        </ul>
      );
    }
    return <span>{String(value)}</span>;
  };

  // Function to get changed fields for UPDATE operations
  const getChangedFields = (oldValue: any, newValue: any): { old: any; new: any } => {
    if (typeof oldValue !== "object" || typeof newValue !== "object") {
      return { old: oldValue, new: newValue };
    }
    const changed: { old: Record<string, any>; new: Record<string, any> } = { old: {}, new: {} };

    // Helper function to compare nested objects
    const compareObjects = (oldObj: any, newObj: any, prefix: string = "") => {
      for (const key in newObj) {
        const oldVal = oldObj ? oldObj[key] : undefined;
        const newVal = newObj[key];
        if (typeof newVal === "object" && newVal !== null && !Array.isArray(newVal)) {
          compareObjects(oldVal, newVal, `${prefix}${key}.`);
        } else if (JSON.stringify(oldVal) !== JSON.stringify(newVal)) {
          changed.old[`${prefix}${key}`] = oldVal;
          changed.new[`${prefix}${key}`] = newVal;
        }
      }
    };

    // Compare top-level fields
    for (const key in newValue) {
      if (["Adress", "Identity", "Contact", "CivilStatus"].includes(key)) {
        compareObjects(oldValue[key], newValue[key], `${key}.`);
      } else if (JSON.stringify(oldValue[key]) !== JSON.stringify(newValue[key])) {
        changed.old[key] = oldValue[key];
        changed.new[key] = newValue[key];
      }
    }

    return Object.keys(changed.new).length > 0 ? changed : { old: oldValue, new: newValue };
  };

  if (!histories || histories.meta.total === 0) {
    return <p className="text-center mt-8">Aucune entrée d'historique trouvée.</p>;
  }

  return (
    <>
      <div className="mt-4 max-w-7xl mx-auto">
        {AppTable ? (
          <AppTable
            columns={columns}
            data={paginatedData}
            className="shadow-md rounded-lg cursor-pointer"
            align="leftCenterRight"
            useActionButtons={false}
            onClickEdit={handleEdit}
            onClickDelete={handleDelete}
            onRowClick={handleRowClick}
          />
        ) : (
          <TableSkeleton />
        )}
      </div>

      <Dialog open={!!selectedHistoryId} onOpenChange={(open) => !open && setSelectedHistoryId(null)}>
        <DialogContent className="sm:max-w-[calc(100vw-2rem)] md:max-w-[calc(90vw-2rem)] xl:max-w-[1200px] sm:w-full">
          <DialogHeader>
            <DialogTitle>Détails de l'historique</DialogTitle>
            <DialogDescription>
              Informations détaillées sur les modifications apportées
            </DialogDescription>
          </DialogHeader>

          <div className="overflow-y-auto w-[70vw]">
            {isLoadingDetail ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <span className="ml-3 text-muted-foreground">Chargement des détails...</span>
              </div>
            ) : historyDetail ? (
              <div className="space-y-6">
                {/* General Information */}
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3">Informations générales</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="font-medium text-sm text-muted-foreground">Action:</span>
                      <p className="text-sm">
                        <span
                          className={`px-2 py-1 rounded-md text-xs font-medium ${
                            historyDetail.data.operation === "CREATE"
                              ? "bg-green-100 text-green-800"
                              : historyDetail.data.operation === "UPDATE"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {historyDetail.data.operation}
                        </span>
                      </p>
                    </div>
                    <div>
                      <span className="font-medium text-sm text-muted-foreground">Entité:</span>
                      <p className="text-sm">{historyDetail.data.entityName}</p>
                    </div>
                    <div className="col-span-2">
                      <span className="font-medium text-sm text-muted-foreground">Date:</span>
                      <p className="text-sm">
                        {format(new Date(historyDetail.data.timestamp), "dd/MM/yyyy HH:mm:ss", {
                          locale: fr,
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Comparison of Values */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Old Value */}
                  <div className="border rounded-lg">
                    <div className="bg-destructive/10 p-3 border-b">
                      <h3 className="text-sm font-semibold text-destructive">Ancienne valeur</h3>
                    </div>
                    <div className="p-4">
                      {historyDetail.data.operation === "UPDATE"
                        ? formatValue(getChangedFields(historyDetail.data.oldValue, historyDetail.data.newValue).old)
                        : formatValue(historyDetail.data.oldValue)}
                    </div>
                  </div>

                  {/* New Value */}
                  <div className="border rounded-lg">
                    <div className="bg-green-50 p-3 border-b">
                      <h3 className="text-sm font-semibold text-green-700">Nouvelle valeur</h3>
                    </div>
                    <div className="p-4">
                      {historyDetail.data.operation === "UPDATE"
                        ? formatValue(getChangedFields(historyDetail.data.oldValue, historyDetail.data.newValue).new)
                        : formatValue(historyDetail.data.newValue)}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Erreur lors du chargement des détails.</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default HistoryTables;