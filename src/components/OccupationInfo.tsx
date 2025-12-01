"use client";
import Skeleton from "@/components/skeleton";
import { GetRemoteComponent } from "@/services/get-remote-component";
import { Occupation as OccupationType } from "@/models/types";

interface OccupationInfoProps {
  isEditing: boolean;
  formData: OccupationType;
  handleChange: (field: keyof OccupationType, value: string) => void;
}

const OccupationInfo = ({
  isEditing,
  formData,
  handleChange,
}: OccupationInfoProps) => {
  const { CustomInput } = GetRemoteComponent();

  // Liste des champs obligatoires
  const requiredFields: (keyof OccupationType)[] = ["status", "position"];

  // Fonction pour vérifier si un champ est vide et obligatoire
  const isFieldInvalid = (field: keyof OccupationType) => {
    return requiredFields.includes(field) && !formData[field];
  };

  return (
    <div className="space-y-2 mt-2 w-full">
      {CustomInput ? (
        <>
          <CustomInput
            label="Statut"
            labelClassName="w-30"
            placeholder="Entrez le statut"
            value={formData.status}
            onChange={(value: string) => handleChange("status", value)}
            disabled={!isEditing}
            error={isEditing && isFieldInvalid("status") ? "Ce champ est requis" : undefined}
          />
          <CustomInput
            label="Poste"
            labelClassName="w-30"
            placeholder="Entrez le poste"
            value={formData.position}
            onChange={(value: string) => handleChange("position", value)}
            disabled={!isEditing}
            error={isEditing && isFieldInvalid("position") ? "Ce champ est requis" : undefined}
          />
          <CustomInput
            label="Responsable"
            labelClassName="w-30"
            placeholder="Entrez le nom du responsable"
            value={formData.supervisor}
            onChange={(value: string) => handleChange("supervisor", value)}
            disabled={!isEditing}
            error={isEditing && isFieldInvalid("supervisor") ? "Ce champ est requis" : undefined}
          />
        </>
      ) : (
        <div className="flex flex-col space-y-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      )}
    </div>
  );
};

export default OccupationInfo;