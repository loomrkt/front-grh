import { remoteComponent } from "@/helpers/remote-components";
import { Contact, Identity } from "@/models/types";

interface UserInfoProps {
  isEditing: boolean;
  formData: {
    identity: Identity;
    contact: Contact;
  };
  handleIdentityChange: (field: keyof Identity, value: string) => void;
  handleContactChange: (field: keyof Contact, index: number, value: string) => void;
}

const UserInfo = ({
  isEditing,
  formData,
  handleIdentityChange,
  handleContactChange,
}: UserInfoProps) => {
  const { CustomInput } = remoteComponent();

  return (
    <div className="text-center mt-2 space-y-2">
      {isEditing && CustomInput ? (
        <div className="flex flex-col gap-2">
          <CustomInput
            label="Prénom"
            labelClassName="w-30"
            value={formData.identity.firstName}
            onChange={(value: string) => handleIdentityChange("firstName", value)}
            placeholder="Ex: John"
          />
          <CustomInput
            label="Nom"
            labelClassName="w-30"
            value={formData.identity.lastName}
            onChange={(value: string) => handleIdentityChange("lastName", value)}
            placeholder="Ex: Doe"
          />
          <CustomInput
            label="Civilité"
            labelClassName="w-30"
            value={formData.identity.civility}
            onChange={(value: string) => handleIdentityChange("civility", value)}
            placeholder="Ex: Monsieur/Madame"
          />
          <CustomInput
            label="Téléphone"
            labelClassName="w-30"
            value={formData.contact.phoneNumber[0]}
            onChange={(value: string) =>
              handleContactChange("phoneNumber", 0, value)
            }
            placeholder="Ex: +261 xx xx xxx xx"
          />
          <CustomInput
            label="Email"
            labelClassName="w-30"
            value={formData.contact.email[0]}
            onChange={(value: string) => handleContactChange("email", 0, value)}
            placeholder="Ex: xxxxxx@gmail.com"
          />
        </div>
      ) : (
        <>
          <h2 className="text-lg font-semibold w-[200px]">
            {formData.identity.civility} {formData.identity.firstName} {formData.identity.lastName}
          </h2>
          <p className="text-gray-500">
            {formData.contact.phoneNumber[0] || "+261 xx xx xxx xx"}
          </p>
          <p className="text-gray-500">
            {formData.contact.email[0] || "xxxxxx@gmail.com"}
          </p>
        </>
      )}
    </div>
  );
};

export default UserInfo;