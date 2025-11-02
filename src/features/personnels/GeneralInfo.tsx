import Skeleton from "@/components/skeleton";
import { getRemoteComponent } from "@/services/get-remote-component";
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
  const { CustomInput } = getRemoteComponent();

  return (
    <div className="space-y-2 mt-2 w-full">
      {CustomInput ? (
        <>
          <CustomInput
            label="Telephone"
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