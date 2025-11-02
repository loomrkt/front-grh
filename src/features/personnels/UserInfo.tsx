import Skeleton from "@/components/skeleton";
import { getRemoteComponent } from "@/services/get-remote-component";
import { Civility, Gender } from "@/models/employe.dto";

interface UserInfoProps {
  formData: {
    FirstName: string;
    LastName: string;
    Civility: Civility| null;
    Gender: Gender | null;
  };
  onChange: (field: keyof UserInfoProps["formData"], value: string) => void;
}

const UserInfo = ({ formData, onChange }: UserInfoProps) => {
  const { CustomInput } = getRemoteComponent();

  const civilityOptions: { value: Civility; label: string }[] = [
    { value: "Mme", label: "Mme" },
    { value: "Mr", label: "Mr" },
    { value: "Mlle", label: "Mlle" },
  ];

  const genderOptions: { value: Gender; label: string }[] = [
    { value: "FEMALE", label: "Femme" },
    { value: "MALE", label: "Homme" },
  ];

  if (!CustomInput) return (
    <div className="flex flex-col gap-2">
      <Skeleton className="h-10 w-52" />
      <Skeleton className="h-10 w-52" />
      <Skeleton className="h-10 w-52" />
    </div>
  );

  return (
    <div className="text-center mt-2 space-y-2 w-full">
      <div className="flex flex-col gap-2">
        <CustomInput
          label="Nom"
          labelClassName="w-30"
          value={formData.LastName}
          onChange={(value: string) => onChange("LastName", value)}
          placeholder="Ex: Doe"
        />
        <CustomInput
          label="Prénom"
          labelClassName="w-30"
          value={formData.FirstName}
          onChange={(value: string) => onChange("FirstName", value)}
          placeholder="Ex: John"
        />
        <CustomInput
          type="select"
          label="Civilité"
          placeholder="..."
          labelClassName="w-40"
          value={formData.Civility}
          onChange={(value: Civility) => onChange("Civility", value)} // <-- typage précis ici
          selectOptions={civilityOptions}
        />
        <CustomInput
          type="select"
          label="Genre"
          placeholder="..."
          labelClassName="w-40"
          value={formData.Gender}
          onChange={(value: Gender) => onChange("Gender", value)} // <-- typage précis ici
          selectOptions={genderOptions}
        />
      </div>
    </div>
  );
};

export default UserInfo;
