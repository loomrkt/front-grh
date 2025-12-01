"use client";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Edit, Check, X, Loader2, Plus, Delete, ChevronUp, ChevronDown } from "lucide-react";
import Skeleton from "@/components/skeleton";
import { GetRemoteComponent } from "@/services/get-remote-component";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import { createContrat, updateContrat, deleteContrat } from "@/services/Contrat";
import { Contrat } from "@/models/employe.dto";

interface ContratInfoProps {
  id?: string; // Employee ID
  formData: Contrat[]; // Array of contracts
}

interface ErrorData {
  propertyName: string;
  errorMessage: string;
}

const ContratInfo = ({ id, formData }: ContratInfoProps) => {
  const { CustomInput } = GetRemoteComponent();
  const [contrats, setContrats] = useState<Contrat[]>(
    formData.map((contrat) => ({
      ...contrat,
      startDate: contrat.startDate ? new Date(contrat.startDate).toISOString().split("T")[0] : "",
      endDate: contrat.endDate ? new Date(contrat.endDate).toISOString().split("T")[0] : "",
    })) || []
  );
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [visibility, setVisibility] = useState<{ [key: number]: boolean }>(
    formData.reduce((acc, _, index) => ({ ...acc, [index]: true }), {})
  );
  const [errors, setErrors] = useState<{ [key: number]: ErrorData[] }>({}); // Store errors per contract index

  // Mutation for creating a contract
  const createMutation = useMutation({
    mutationFn: (contrat: Contrat) => {
      if (!id) throw new Error("Employee ID is required");
      return createContrat(id, contrat);
    },
    onSuccess: () => {
      toast.success("Contrat créé avec succès");
      setEditingIndex(null);
      setErrors((prev) => ({ ...prev, [editingIndex!]: [] })); // Clear errors on success
    },
    onError: (error: AxiosError<{ message?: string; data?: ErrorData[] }>) => {
      console.error(error);
      if (error.response?.data?.data) {
        setErrors((prev) => ({
          ...prev,
          [editingIndex!]: error.response?.data?.data || [], // Ensure a valid ErrorData[] is assigned
        }));
      }
      const errorMessage = error.response?.data?.message || "Erreur inconnue";
      toast.error(`Erreur lors de la création du contrat: ${errorMessage}`);
    },
  });

  // Mutation for updating a contract
  const updateMutation = useMutation({
    mutationFn: ({ contratId, contrat }: { contratId: string; contrat: Contrat }) => {
      return updateContrat(contratId, contrat);
    },
    onSuccess: () => {
      toast.success("Contrat mis à jour avec succès");
      setEditingIndex(null);
      setErrors((prev) => ({ ...prev, [editingIndex!]: [] })); // Clear errors on success
    },
    onError: (error: AxiosError<{ message?: string; data?: ErrorData[] }>) => {
      console.error(error);
      if (error.response?.data?.data) {
        setErrors((prev) => ({
          ...prev,
          [editingIndex!]: error.response?.data?.data || [], // Ensure a valid ErrorData[] is assigned
        }));
      }
      const errorMessage = error.response?.data?.message || "Erreur inconnue";
      toast.error(`Erreur lors de la mise à jour du contrat: ${errorMessage}`);
    },
  });

  // Mutation for deleting a contract
  const deleteMutation = useMutation({
    mutationFn: (contratId: string) => {
      return deleteContrat(contratId);
    },
    onSuccess: () => {
      toast.success("Contrat supprimé avec succès");
      setContrats((prev) => prev.filter((_, i) => i !== editingIndex));
      setEditingIndex(null);
      setErrors((prev) => ({ ...prev, [editingIndex!]: [] })); // Clear errors on success
      setVisibility((prev) => {
        const newVisibility = { ...prev };
        delete newVisibility[editingIndex!];
        return newVisibility;
      });
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      console.error(error);
      const errorMessage = error.response?.data?.message || "Erreur inconnue";
      toast.error(`Erreur lors de la suppression du contrat: ${errorMessage}`);
    },
  });

  // Handle input changes for a specific contract
  const handleChange = (index: number, field: keyof Contrat, value: string | number) => {
    if (field === "startDate" || field === "endDate") {
      if (value && typeof value === "string") {
        const selectedDate = new Date(value);
        const today = new Date();
        if (field === "startDate" && selectedDate > today) {
          setErrors((prev) => ({
            ...prev,
            [index]: [
              ...(prev[index] || []),
              { propertyName: "startDate", errorMessage: "La date de début ne peut pas être dans le futur" },
            ],
          }));
          return;
        }
        if (field === "endDate" && contrats[index].startDate && selectedDate < new Date(contrats[index].startDate)) {
          setErrors((prev) => ({
            ...prev,
            [index]: [
              ...(prev[index] || []),
              { propertyName: "endDate", errorMessage: "La date de fin ne peut pas être antérieure à la date de début" },
            ],
          }));
          return;
        }
      }
    }
    setContrats((prev) =>
      prev.map((contrat, i) =>
        i === index ? { ...contrat, [field]: value } : contrat
      )
    );
    // Clear errors for the specific field when user starts typing
    setErrors((prev) => ({
      ...prev,
      [index]: prev[index]?.filter((err) => err.propertyName.toLowerCase() !== field.toLowerCase()) || [],
    }));
  };

  // Handle adding a new contract
  const handleAddContrat = () => {
    setContrats((prev) => [
      ...prev,
      { id: "", typeContrat: "", startDate: "", endDate: "", salaryMensual: "" },
    ]);
    const newIndex = contrats.length;
    setEditingIndex(newIndex);
    setVisibility((prev) => ({ ...prev, [newIndex]: true }));
    setErrors((prev) => ({ ...prev, [newIndex]: [] })); // Initialize errors for new contract
  };

  // Handle saving a contract
  const handleSave = (index: number) => {
    const contrat = contrats[index];
    if (contrat.id) {
      updateMutation.mutate({ contratId: contrat.id, contrat });
    } else {
      createMutation.mutate(contrat);
    }
  };

  // Handle canceling edit
  const handleCancel = (index: number) => {
    if (contrats[index].id) {
      setContrats((prev) =>
        prev.map((contrat, i) =>
          i === index
            ? {
                ...formData[i],
                startDate: formData[i].startDate
                  ? new Date(formData[i].startDate).toISOString().split("T")[0]
                  : "",
                endDate: formData[i].endDate
                  ? new Date(formData[i].endDate).toISOString().split("T")[0]
                  : "",
              }
            : contrat
        )
      );
    } else {
      setContrats((prev) => prev.filter((_, i) => i !== index));
      setVisibility((prev) => {
        const newVisibility = { ...prev };
        delete newVisibility[index];
        return newVisibility;
      });
    }
    setEditingIndex(null);
    setErrors((prev) => ({ ...prev, [index]: [] })); // Clear errors on cancel
  };

  // Handle deleting a contract
  const handleDelete = (index: number) => {
    const contrat = contrats[index];
    if (contrat.id) {
      deleteMutation.mutate(contrat.id);
    } else {
      setContrats((prev) => prev.filter((_, i) => i !== index));
      setVisibility((prev) => {
        const newVisibility = { ...prev };
        delete newVisibility[index];
        return newVisibility;
      });
      setErrors((prev) => ({ ...prev, [index]: [] })); // Clear errors on delete
    }
  };

  // Toggle visibility for a specific contract
  const toggleVisibility = (index: number) => {
    setEditingIndex(null);
    setVisibility((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  // Get error message for a specific field and contract index
  const getErrorMessage = (index: number, field: string) => {
    return errors[index]?.find((err) => err.propertyName.toLowerCase() === field.toLowerCase())?.errorMessage || "";
  };

  return (
    <div className="space-y-2 mt-2 w-full">
      <div className="flex justify-between mb-2">
        <h1 className="text-2xl font-bold mb-4">Contrats</h1>
        <button
          className="flex items-center gap-1 text-sm hover:underline"
          onClick={handleAddContrat}
          disabled={editingIndex !== null}
        >
          <Plus size={16} />
          Ajouter
        </button>
      </div>

      {contrats.length === 0 && !editingIndex && (
        <p>Aucune information sur les contrats enregistrée.</p>
      )}

      {contrats.map((contrat, index) => (
        <div key={index} className="border p-4 rounded-md mb-4">
          <div className="flex justify-between mb-2 gap-2">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold">Contrat {index + 1}</h2>
              {contrat.id && editingIndex === index && (
                <button
                  className="text-sm text-red-600 hover:underline flex items-center gap-1"
                  onClick={() => handleDelete(index)}
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
                  <Delete size={16} />
                </button>
              )}
            </div>
            <div className="flex items-center gap-2">
              {editingIndex !== index ? (
                <button
                  className="text-sm hover:underline flex items-center gap-1"
                  onClick={() => setEditingIndex(index)}
                  disabled={editingIndex !== null}
                >
                  <Edit size={16} />
                </button>
              ) : null}
              {editingIndex !== index && (
                <button
                  className="text-sm hover:underline border border-black rounded-full p-1 flex items-center gap-1"
                  onClick={() => toggleVisibility(index)}
                >
                  {visibility[index] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
              )}
            </div>
          </div>

          {visibility[index] && (
            <>
              {CustomInput ? (
                <>
                  <div className="relative">
                    <CustomInput
                      type="select"
                      label="Type de contrat"
                      labelClassName="w-30"
                      placeholder="Entrez le type de contrat"
                      value={contrat.typeContrat || ""}
                      selectOptions={[
                        { value: "CDI", label: "CDI" },
                        { value: "CDD", label: "CDD" },
                        { value: "FREELANCE", label: "FREELANCE" },
                        { value: "STAGE", label: "STAGE" },
                        { value: "INTERIM", label: "INTERIM" },
                      ]}
                      onChange={(value: string) => handleChange(index, "typeContrat", value)}
                    />
                    {getErrorMessage(index, "typeContrat") && (
                      <p className="text-red-600 text-sm mt-1">{getErrorMessage(index, "typeContrat")}</p>
                    )}
                  </div>
                  <div className="relative">
                    <CustomInput
                      type="date"
                      label="Date de début"
                      labelClassName="w-30"
                      placeholder="Sélectionnez une date"
                      value={contrat.startDate}
                      onChange={(value: string) => handleChange(index, "startDate", value)}
                      datePickerOnChange={(date: Date | undefined) => {
                        if (date) {
                          handleChange(index, "startDate", date.toISOString().split("T")[0]);
                        } else {
                          handleChange(index, "startDate", "");
                        }
                      }}
                      disabled={editingIndex !== index}
                    />
                    {getErrorMessage(index, "startDate") && (
                      <p className="text-red-600 text-sm mt-1">{getErrorMessage(index, "startDate")}</p>
                    )}
                  </div>
                  <div className="relative">
                    <CustomInput
                      type="date"
                      label="Date de fin"
                      labelClassName="w-30"
                      placeholder="Sélectionnez une date"
                      value={contrat.endDate}
                      onChange={(value: string) => handleChange(index, "endDate", value)}
                      datePickerOnChange={(date: Date | undefined) => {
                        if (date) {
                          handleChange(index, "endDate", date.toISOString().split("T")[0]);
                        } else {
                          handleChange(index, "endDate", "");
                        }
                      }}
                      disabled={editingIndex !== index}
                    />
                    {getErrorMessage(index, "endDate") && (
                      <p className="text-red-600 text-sm mt-1">{getErrorMessage(index, "endDate")}</p>
                    )}
                  </div>
                  <div className="relative">
                    <CustomInput
                      type="text"
                      label="Salaire mensuel"
                      labelClassName="w-30"
                      placeholder="Entrez le salaire mensuel"
                      value={contrat.salaryMensual}
                      onChange={(value: string) => handleChange(index, "salaryMensual", parseFloat(value) || 0)}
                      disabled={editingIndex !== index}
                    />
                    {getErrorMessage(index, "salaryMensual") && (
                      <p className="text-red-600 text-sm mt-1">{getErrorMessage(index, "salaryMensual")}</p>
                    )}
                  </div>
                  {editingIndex === index && (
                    <div className="flex justify-end mt-4">
                      <div className="flex items-center gap-2">
                        <button
                          className="text-sm text-red-600 hover:underline flex items-center gap-1"
                          onClick={() => handleCancel(index)}
                          disabled={createMutation.isPending || updateMutation.isPending}
                        >
                          <X size={16} />
                        </button>
                        <button
                          className="flex items-center gap-1 text-sm hover:underline"
                          onClick={() => handleSave(index)}
                          disabled={createMutation.isPending || updateMutation.isPending}
                        >
                          {createMutation.isPending || updateMutation.isPending ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : (
                            <Check size={16} />
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton className="h-10 w-full" key={i} />
                ))
              )}
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default ContratInfo;