"use client";
import Skeleton from "@/components/skeleton";
import { remoteComponent } from "@/helpers/remote-components";
import { Education } from "@/models/types";

interface EducationInfoProps {
  isEditing: boolean;
  formData: Education;
  handleChange: (field: keyof Education, value: string) => void;
}

const EducationInfo = ({
  isEditing,
  formData,
  handleChange,
}: EducationInfoProps) => {
  const { CustomInput } = remoteComponent();

  return (
    <div className="space-y-2 mt-2 w-full">
      {CustomInput ? (
        <>
          <CustomInput
            label="Diplôme"
            labelClassName="w-30"
            placeholder="Entrez le diplôme obtenu"
            value={formData.graduation}
            onChange={(e: string) => handleChange("graduation", e)}
            disabled={!isEditing}
          />
          <CustomInput
            label="Domaine d'études"
            labelClassName="w-30"
            placeholder="Entrez le domaine"
            value={formData.filedOfStudy}
            onChange={(e: string) => handleChange("filedOfStudy", e)}
            disabled={!isEditing}
          />
          <CustomInput
            label="Année d'obtention"
            labelClassName="w-30"
            placeholder="Entrez l'année"
            value={formData.graduationYear}
            onChange={(e: string) => handleChange("graduationYear", e)}
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

export default EducationInfo;
