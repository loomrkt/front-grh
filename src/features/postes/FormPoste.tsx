"use client";
import Skeleton from "@/components/skeleton";
import { getRemoteComponent } from "@/services/get-remote-component";
import Image from "next/image";
import { useEffect } from "react";
import usePosteStore from "@/Stores/posteStore";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import DepartmentSelectInput from "@/components/DepartmentSelectInput";

interface FormPosteProps {
  posteId?: string | null;
  onCancel?: () => void;
}

const FormPoste = ({ posteId, onCancel }: FormPosteProps) => {
  const { CustomInput, CustomButton } = getRemoteComponent();

  const {
    mode,
    setMode,
    loadPoste,
    submitForm,
    posteCode,
    posteTitle,
    departementId,
    setField,
    cancelUpdate,
  } = usePosteStore();

  // Gestion mode create/update et chargement des données
  useEffect(() => {
    if (posteId) {
      setMode("update", posteId);
      loadPoste(posteId);
    } else {
      setMode("create");
      setField("posteCode", "");
      setField("posteTitle", "");
      setField("departementId", "");
    }
  }, [posteId, setMode, loadPoste, setField]);

  // Fonction pour gérer le changement des champs
  const handleChange = (
    field: "posteCode" | "posteTitle" | "departementId",
    value: string
  ) => {
    setField(field, value);
  };

  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await submitForm(queryClient);
      toast.success(mode === "create" ? "Poste créé avec succès" : "Poste mis à jour avec succès");
      if (onCancel) {
        onCancel();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Une erreur est survenue lors de la soumission");
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
      className="w-full not-md:h-[90vh] p-6 bg-[#F4F4FC] rounded-2xl max-w-7xl mx-auto flex not-md:flex-col gap-4 md:flex-row items-center justify-between"
    >
      {/* Côté gauche : illustration */}
      <div className="not-md:w-full md:w-[45%] flex flex-col justify-center items-center">
        <div>
          <p className="uppercase font-light self-start not-md:hidden md:block">Ajouter un Poste</p>
          <Image
            src="/poste.png"
            alt="Poste Icon"
            width={1000}
            height={600}
            className="h-auto w-66 mt-10 not-md:hidden md:block"
          />
        </div>
      </div>

      {/* Côté droit : formulaire */}
      <div className="flex-1 flex flex-col gap-4 bg-white rounded-lg p-6 h-full justify-center">
        <h1 className="text-2xl font-semibold mb-4 text-center w-full">
          {mode === "create" ? "Créer votre Poste" : "Modifier le Poste"}
        </h1>

        {CustomInput ? (
          <>
            <CustomInput
              label="Code du Poste"
              placeholder="Entrez le code du poste"
              labelClassName="w-40"
              value={posteCode || ""}
              onChange={(value: string) => handleChange("posteCode", value)}
            />
            <CustomInput
              label="Nom du Poste"
              placeholder="Entrez le nom du poste"
              labelClassName="w-40"
              value={posteTitle || ""}
              onChange={(value: string) => handleChange("posteTitle", value)}
            />
            <DepartmentSelectInput
                value={departementId || "root"}
                onChange={(val) => handleChange("departementId", val)}
            />
          </>
        ) : (
          <>
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </>
        )}

        {/* Boutons d'envoi et d'annulation */}
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

export default FormPoste;