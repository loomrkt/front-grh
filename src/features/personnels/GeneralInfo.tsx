import Skeleton from "@/components/skeleton";
import { remoteComponent } from "@/helpers/remote-components";
import { Contact, Identity } from "@/models/types";

interface GeneralInfoProps {
  isEditing: boolean;
  formData: {
    identity: Identity;
    contact: Contact;
    profileImage?: File | null;
  };
  handleIdentityChange: (field: keyof Identity, value: string) => void;
}

const GeneralInfo = ({
  isEditing,
  formData,
  handleIdentityChange,
}: GeneralInfoProps) => {
  const { CustomInput } = remoteComponent();

  return (
    <div className="space-y-2 mt-2 w-full">
      {CustomInput ? (
        <>
          <CustomInput
            label="Genre"
            labelClassName="w-30"
            value={formData.identity.gender}
            onChange={(value: string) => handleIdentityChange("gender", value)}
            disabled={!isEditing}
            placeholder={isEditing ? "Ex: Homme ou Femme" : ""}
          />
          <CustomInput
            label="Nationalité"
            labelClassName="w-30"
            value={formData.identity.nationality}
            onChange={(value: string) =>
              handleIdentityChange("nationality", value)
            }
            disabled={!isEditing}
            placeholder={isEditing ? "Ex: Malagasy" : ""}
          />
          <CustomInput
            label="Date de naissance"
            labelClassName="w-30"
            value={formData.identity.birthDate}
            onChange={(value: string) =>
              handleIdentityChange("birthDate", value)
            }
            disabled={!isEditing}
            placeholder={isEditing ? "Ex: 1990-01-01" : ""}
          />
          <CustomInput
            label="Lieu de naissance"
            labelClassName="w-30"
            value={formData.identity.birthPlace}
            onChange={(value: string) =>
              handleIdentityChange("birthPlace", value)
            }
            disabled={!isEditing}
            placeholder={isEditing ? "Ex: Antananarivo" : ""}
          />
        </>
      ) : (
        <>
          <Skeleton className="w-full" />
          <Skeleton className="w-full" />
          <Skeleton className="w-full" />
          <Skeleton className="w-full" />
        </>
      )}
    </div>
  );
};

export default GeneralInfo;