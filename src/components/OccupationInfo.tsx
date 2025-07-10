"use client";
import Skeleton from "@/components/skeleton";
import { remoteComponent } from "@/helpers/remote-components";
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
  const { CustomInput } = remoteComponent();

  return (
    <div className="space-y-2 mt-2 w-full">
      {CustomInput ? (
        <>
          <CustomInput
            label="Statut"
            labelClassName="w-30"
            placeholder="Entrez le statut"
            value={formData.status}
            onChange={(e: string) => handleChange("status", e)}
            disabled={!isEditing}
          />
          <CustomInput
            label="Poste"
            labelClassName="w-30"
            placeholder="Entrez le poste"
            value={formData.position}
            onChange={(e: string) => handleChange("position", e)}
            disabled={!isEditing}
          />
          <CustomInput
            label="Responsable"
            labelClassName="w-30"
            placeholder="Entrez le nom du responsable"
            value={formData.supervisor}
            onChange={(e: string) => handleChange("supervisor", e)}
            disabled={!isEditing}
          />
        </>
      ) : (
        <>
          <Skeleton className="w-full" />
          <Skeleton className="w-full" />
          <Skeleton className="w-full" />
        </>
      )}
    </div>
  );
};

export default OccupationInfo;
