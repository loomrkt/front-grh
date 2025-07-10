"use client";
import Skeleton from "@/components/skeleton";
import { remoteComponent } from "@/helpers/remote-components";
import { Identity } from "@/models/types";

interface IdentityInfoProps {
  isEditing: boolean;
  formData: Identity;
  handleChange: (field: keyof Identity, value: string) => void;
}

const IdentityInfo = ({
  isEditing,
  formData,
  handleChange,
}: IdentityInfoProps) => {
  const { CustomInput } = remoteComponent();

  return (
    <div className="space-y-2 mt-2 w-full">
      {CustomInput ? (
        <>
          <CustomInput
            label="Nom"
            labelClassName="w-30"
            placeholder="Entrez le nom"
            value={formData.lastName}
            onChange={(e: string) => handleChange("lastName", e)}
            disabled={!isEditing}
          />
          <CustomInput
            label="Prénom"
            labelClassName="w-30"
            placeholder="Entrez le prénom"
            value={formData.firstName}
            onChange={(e: string) => handleChange("firstName", e)}
            disabled={!isEditing}
          />
          <CustomInput
            label="Civilité"
            labelClassName="w-30"
            placeholder="Entrez la civilité"
            value={formData.civility}
            onChange={(e: string) => handleChange("civility", e)}
            disabled={!isEditing}
          />
          <CustomInput
            label="Genre"
            labelClassName="w-30"
            placeholder="MALE / FEMALE"
            value={formData.gender}
            onChange={(e: string) => handleChange("gender", e)}
            disabled={!isEditing}
          />
          <CustomInput
            label="Date de naissance"
            labelClassName="w-30"
            placeholder="YYYY-MM-DD"
            value={formData.birthDate}
            onChange={(e: string) => handleChange("birthDate", e)}
            disabled={!isEditing}
          />
          <CustomInput
            label="Lieu de naissance"
            labelClassName="w-30"
            placeholder="Entrez le lieu"
            value={formData.birthPlace}
            onChange={(e: string) => handleChange("birthPlace", e)}
            disabled={!isEditing}
          />
          <CustomInput
            label="Nationalité"
            labelClassName="w-30"
            placeholder="Entrez la nationalité"
            value={formData.nationality}
            onChange={(e: string) => handleChange("nationality", e)}
            disabled={!isEditing}
          />
        </>
      ) : (
        <>
          <Skeleton className="w-full" />
          <Skeleton className="w-full" />
          <Skeleton className="w-full" />
          <Skeleton className="w-full" />
          <Skeleton className="w-full" />
          <Skeleton className="w-full" />
          <Skeleton className="w-full" />
        </>
      )}
    </div>
  );
};

export default IdentityInfo;
