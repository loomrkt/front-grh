
"use client";
import Skeleton from "@/components/skeleton";
import { GetRemoteComponent } from "@/services/get-remote-component";
import Image from "next/image";
import { useEffect } from "react";
import useDepartmentStore from "@/Stores/departmentStore";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import DepartmentSelectInput from "@/components/DepartmentSelectInput";

interface FormDepartementProps {
  departmentId?: string | null;
  onCancel?: () => void;
}

const FormDepartement = ({ departmentId, onCancel }: FormDepartementProps) => {
  const { CustomInput, CustomButton } = GetRemoteComponent();

  const {
    mode,
    setMode,
    loadDepartment,
    submitForm,
    departmentCode,
    departmentName,
    parentDepartmentId,
    setField,
    cancelUpdate,
  } = useDepartmentStore();

  // Gestion mode create/update et chargement des données
  useEffect(() => {
    if (departmentId) {
      setMode("update", departmentId);
      loadDepartment(departmentId);
    } else {
      setMode("create");
      setField("departmentCode", "");
      setField("departmentName", "");
      setField("parentDepartmentId", "");
    }
  }, [departmentId, setMode, loadDepartment, setField]);

  // Fonction pour gérer le changement des champs
  const handleChange = (
    field: "departmentCode" | "departmentName" | "parentDepartmentId",
    value: string
  ) => {
    setField(field, value);
  };

  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await submitForm(queryClient);
      toast.success(mode === "create" ? "Département créé avec succès" : "Département mis à jour avec succès");
      if (onCancel) {
        onCancel();
      }
    } catch (error: any) {
      toast.error(error.response.data.message || "Une erreur est survenue lors de la soumission");
    }
  };

  // Gestion de l'annulation
  const handleCancel = () => {
    cancelUpdate();
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full p-10 bg-[#F4F4FC] rounded-2xl max-w-7xl mx-auto flex not-md:flex-col gap-4 md:flex-row items-center justify-between"
    >
      {/* Côté gauche : illustration */}
      <div className="hidden md:w-[45%] md:flex flex-col justify-center items-center">
        <div>
          <Image
            src="/departement.png"
            alt="Département Icon"
            width={1000}
            height={600}
            className="h-auto w-66 mt-10"
          />
        </div>
      </div>

      {/* Côté droit : formulaire */}
      <div className="flex-1 flex flex-col gap-4 bg-white rounded-lg p-6 h-full">
        <h1 className="text-2xl font-semibold mb-4 text-center w-full">
          {mode === "create" ? "Créer votre Département" : "Modifier le Département"}
        </h1>

        {CustomInput ? (
          <>
            <CustomInput
              label="Code du Département"
              placeholder="Entrez le code"
              labelClassName="w-40"
              value={departmentCode || ""}
              onChange={(value: string) => handleChange("departmentCode", value)}
            />
            <CustomInput
              label="Nom du Département"
              placeholder="Entrez le nom"
              labelClassName="w-40"
              value={departmentName || ""}
              onChange={(value: string) => handleChange("departmentName", value)}
            />
            <DepartmentSelectInput
              value={parentDepartmentId || "root"}
              onChange={(val) => handleChange("parentDepartmentId", val)}
            />
          </>
        ) : (
          <>
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </>
        )}

        {/* Boutons d’envoi et d’annulation */}
        <div className="flex items-center justify-end mt-4 w-full space-x-2">
          {CustomButton ? (
            <>
              <CustomButton type="submit">
                {mode === "create" ? "Ajouter" : "Mettre à jour"}
              </CustomButton>
              {mode === "update" && (
                <CustomButton
                  type="button"
                  className="bg-gray-500 text-white hover:bg-gray-600 cursor-pointer"
                  onClick={handleCancel}
                >
                  Annuler
                </CustomButton>
              )}
            </>
          ) : (
            <>
              <Skeleton className="h-10 w-32" />
              {mode === "update" && <Skeleton className="h-10 w-32" />}
            </>
          )}
        </div>
      </div>
    </form>
  );
};

export default FormDepartement;