
"use client";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Edit, Check, X, Loader2, Plus, Delete, ChevronUp, ChevronDown } from "lucide-react";
import Skeleton from "@/components/skeleton";
import { GetRemoteComponent } from "@/services/get-remote-component";
import { toast } from "react-toastify";
import { createBank, updateBank, deleteBank } from "@/services/Bank";
import { Bank } from "@/models/employe.dto";

interface BankInfoProps {
  id?: string; // Employee ID
  formData: Bank[]; // Array of banks
}

interface ErrorData {
  propertyName: string;
  errorMessage: string;
}

const BankInfo = ({ id, formData }: BankInfoProps) => {
  const { CustomInput } = GetRemoteComponent();
  const [banks, setBanks] = useState<Bank[]>(formData || []);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [visibility, setVisibility] = useState<{ [key: number]: boolean }>(
    formData.reduce((acc, _, index) => ({ ...acc, [index]: true }), {})
  );
  const [errors, setErrors] = useState<{ [key: number]: ErrorData[] }>({}); // Store errors per bank index

  // Mutation for creating a bank
  const createMutation = useMutation({
    mutationFn: (bank: Bank) => {
      if (!id) throw new Error("Employee ID is required");
      return createBank(id, bank);
    },
    onSuccess: () => {
      toast.success("Banque créée avec succès");
      setEditingIndex(null);
      setErrors((prev) => ({ ...prev, [editingIndex!]: [] })); // Clear errors on success
    },
    onError: (error: any) => {
      console.error(error);
      if (error.response?.data?.data) {
        setErrors((prev) => ({
          ...prev,
          [editingIndex!]: error.response.data.data, // Store errors for the current bank
        }));
      }
      toast.error("Erreur lors de la création de la banque");
    },
  });

  // Mutation for updating a bank
  const updateMutation = useMutation({
    mutationFn: ({ bankId, bank }: { bankId: string; bank: Bank }) => {
      return updateBank(bankId, bank);
    },
    onSuccess: () => {
      toast.success("Banque mise à jour avec succès");
      setEditingIndex(null);
      setErrors((prev) => ({ ...prev, [editingIndex!]: [] })); // Clear errors on success
    },
    onError: (error: any) => {
      console.error(error);
      if (error.response?.data?.data) {
        setErrors((prev) => ({
          ...prev,
          [editingIndex!]: error.response.data.data, // Store errors for the current bank
        }));
      }
      toast.error("Erreur lors de la mise à jour de la banque");
    },
  });

  // Mutation for deleting a bank
  const deleteMutation = useMutation({
    mutationFn: (bankId: string) => {
      return deleteBank(bankId);
    },
    onSuccess: () => {
      toast.success("Banque supprimée avec succès");
      setBanks((prev) => prev.filter((_, i) => i !== editingIndex));
      setEditingIndex(null);
      setErrors((prev) => ({ ...prev, [editingIndex!]: [] })); // Clear errors on success
      setVisibility((prev) => {
        const newVisibility = { ...prev };
        delete newVisibility[editingIndex!];
        return newVisibility;
      });
    },
    onError: (error) => {
      console.error(error);
      toast.error("Erreur lors de la suppression de la banque");
    },
  });

  // Handle input changes for a specific bank
  const handleChange = (index: number, field: keyof Bank, value: string) => {
    setBanks((prev) =>
      prev.map((bank, i) =>
        i === index ? { ...bank, [field]: value } : bank
      )
    );
    // Clear errors for the specific field when user starts typing
    setErrors((prev) => ({
      ...prev,
      [index]: prev[index]?.filter((err) => err.propertyName.toLowerCase() !== field.toLowerCase()) || [],
    }));
  };

  // Handle adding a new bank
  const handleAddBank = () => {
    setBanks((prev) => [
      ...prev,
      { id: "", rib: "", iban: "", bic: "", countryCode: "", accountLabel: "" },
    ]);
    const newIndex = banks.length;
    setEditingIndex(newIndex);
    setVisibility((prev) => ({ ...prev, [newIndex]: true }));
    setErrors((prev) => ({ ...prev, [newIndex]: [] })); // Initialize errors for new bank
  };

  // Handle saving a bank
  const handleSave = (index: number) => {
    const bank = banks[index];
    if (bank.id) {
      updateMutation.mutate({ bankId: bank.id, bank });
    } else {
      createMutation.mutate(bank);
    }
  };

  // Handle canceling edit
  const handleCancel = (index: number) => {
    if (banks[index].id) {
      setBanks((prev) => prev.map((bank, i) => (i === index ? formData[i] || bank : bank)));
    } else {
      setBanks((prev) => prev.filter((_, i) => i !== index));
      setVisibility((prev) => {
        const newVisibility = { ...prev };
        delete newVisibility[index];
        return newVisibility;
      });
    }
    setEditingIndex(null);
    setErrors((prev) => ({ ...prev, [index]: [] })); // Clear errors on cancel
  };

  // Handle deleting a bank
  const handleDelete = (index: number) => {
    const bank = banks[index];
    if (bank.id) {
      deleteMutation.mutate(bank.id);
    } else {
      setBanks((prev) => prev.filter((_, i) => i !== index));
      setVisibility((prev) => {
        const newVisibility = { ...prev };
        delete newVisibility[index];
        return newVisibility;
      });
      setErrors((prev) => ({ ...prev, [index]: [] })); // Clear errors on delete
    }
  };

  // Toggle visibility for a specific bank
  const toggleVisibility = (index: number) => {
    setEditingIndex(null);
    setVisibility((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  // Get error message for a specific field and bank index
  const getErrorMessage = (index: number, field: string) => {
    return errors[index]?.find((err) => err.propertyName.toLowerCase() === field.toLowerCase())?.errorMessage || "";
  };

  return (
    <div className="space-y-2 mt-2 w-full">
      <div className="flex justify-between mb-2">
        <h1 className="text-2xl font-bold mb-4">Banques</h1>
        <button
          className="flex items-center gap-1 text-sm hover:underline"
          onClick={handleAddBank}
          disabled={editingIndex !== null}
        >
          <Plus size={16} />
          Ajouter
        </button>
      </div>

      {banks.length === 0 && !editingIndex && (
        <p>Aucune information bancaire enregistrée.</p>
      )}

      {banks.map((bank, index) => (
        <div key={index} className="border p-4 rounded-md mb-4">
          <div className="flex justify-between mb-2 gap-2">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold">Compte {index + 1}</h2>
              {bank.id && editingIndex === index && (
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
                      label="RIB"
                      labelClassName="w-30"
                      placeholder="Entrez le RIB"
                      value={bank.rib}
                      onChange={(e: string) => handleChange(index, "rib", e)}
                      disabled={editingIndex !== index}
                    />
                    {getErrorMessage(index, "Rib") && (
                      <p className="text-red-600 text-sm mt-1">{getErrorMessage(index, "Rib")}</p>
                    )}
                  </div>
                  <div className="relative">
                    <CustomInput
                      label="IBAN"
                      labelClassName="w-30"
                      placeholder="Entrez le IBAN"
                      value={bank.iban}
                      onChange={(e: string) => handleChange(index, "iban", e)}
                      disabled={editingIndex !== index}
                    />
                    {getErrorMessage(index, "Iban") && (
                      <p className="text-red-600 text-sm mt-1">{getErrorMessage(index, "Iban")}</p>
                    )}
                  </div>
                  <div className="relative">
                    <CustomInput
                      label="BIC"
                      labelClassName="w-30"
                      placeholder="Entrez le BIC"
                      value={bank.bic}
                      onChange={(e: string) => handleChange(index, "bic", e)}
                      disabled={editingIndex !== index}
                    />
                    {getErrorMessage(index, "Bic") && (
                      <p className="text-red-600 text-sm mt-1">{getErrorMessage(index, "Bic")}</p>
                    )}
                  </div>
                  <div className="relative">
                    <CustomInput
                      label="Code pays"
                      labelClassName="w-30"
                      placeholder="Entrez le Code pays"
                      value={bank.countryCode}
                      onChange={(e: string) => handleChange(index, "countryCode", e)}
                      disabled={editingIndex !== index}
                    />
                    {getErrorMessage(index, "countryCode") && (
                      <p className="text-red-600 text-sm mt-1">{getErrorMessage(index, "countryCode")}</p>
                    )}
                  </div>
                  <div className="relative">
                    <CustomInput
                      label="Libellé"
                      labelClassName="w-30"
                      placeholder="Entrez le libellé du compte"
                      value={bank.accountLabel}
                      onChange={(e: string) => handleChange(index, "accountLabel", e)}
                      disabled={editingIndex !== index}
                    />
                    {getErrorMessage(index, "accountLabel") && (
                      <p className="text-red-600 text-sm mt-1">{getErrorMessage(index, "accountLabel")}</p>
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
                Array.from({ length: 5 }).map((_, i) => (
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

export default BankInfo;