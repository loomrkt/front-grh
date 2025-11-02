// UserCard.tsx
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { useState } from "react";
import ProfileImage from "./ProfileImage";
import UserInfo from "./UserInfo";
import { CreateEmployeDto } from "@/models/CreateEmployeDto";
import ContactInfo from "./ContactInfo";
import PosteSelectInput from "@/components/PosteSelectInput";
import { useMutation } from "@tanstack/react-query";
import { addEmploye } from "@/services/employe";
import { toast } from "react-toastify";
import { set } from "date-fns";
import { getRemoteComponent } from "@/services/get-remote-component";
import Skeleton from "@/components/skeleton";
import { useRouter } from "next/navigation";

const UserCard = () => {
  const Router = useRouter();
  const { CustomButton } = getRemoteComponent();
  const [formData, setFormData] = useState<CreateEmployeDto>({
    FirstName: "",
    LastName: "",
    Civility: null,
    Contact: {
      PhoneNumber: [""],
      Email: [""],
    },
    PostId: "",
    DepartmentId: "",
    Gender: null,
    Avatar: {
      FormFile: null,
    },
  });
  const [errors, setErrors] = useState<
    { propertyName: string; errorMessage: string }[]
  >([]); // Add state for errors

  // useMutation hook for adding employee
  const mutation = useMutation({
    mutationFn: addEmploye,
    onSuccess: (data) => {
      toast.success("Employee added successfully!");
      setFormData({
        FirstName: "",
        LastName: "",
        Civility: null,
        Contact: {
          PhoneNumber: [""],
          Email: [""],
        },
        PostId: "",
        DepartmentId: "",
        Gender: null,
        Avatar: {
          FormFile: null,
        },
      });
      setErrors([]);
      Router.push(`/personnels/${data.data.id}`);
    },
    onError: (error: any) => {
      console.error("Error adding employee:", error);
      if (error.response?.data?.data && Array.isArray(error.response.data.data)) {
        setErrors(error.response.data.data);
      }
      toast.error(`${error.response?.data?.message || "Unknown error"}`);
    },
  });

  const handleIdentityChange = (
    field: keyof Pick<CreateEmployeDto, "FirstName" | "LastName" | "Civility" | "Gender">,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAvatarChange = (file: File | null) => {
    if (file) {
      setFormData((prev) => ({
        ...prev,
        Avatar: {
          FormFile: file,
        },
      }));
    }
  };

  const handleContactChange = (
    field: keyof CreateEmployeDto["Contact"],
    value: string[]
  ) => {
    setFormData((prev) => ({
      ...prev,
      Contact: {
        ...prev.Contact,
        [field]: value,
      },
    }));
  };

  const handlePosteChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      PostId: value || "",
    }));
  };

  const handleSave = () => {
    setErrors([]); // Clear previous errors before new submission
    mutation.mutate(formData);
  };

  return (
    <div className="w-full flex flex-col items-center overflow-scroll space-y-6">
      <div className="flex items-center gap-5">
        <ProfileImage
          initialImage={undefined}
          onFileChange={handleAvatarChange}
        />
        <UserInfo
          formData={{
            FirstName: formData.FirstName,
            LastName: formData.LastName,
            Civility: formData.Civility,
            Gender: formData.Gender
          }}
          onChange={handleIdentityChange}
        />
      </div>

      <ContactInfo
        formData={formData.Contact}
        onChange={handleContactChange}
        errors={errors}
      />

      <PosteSelectInput
        value={formData.PostId}
        onChange={handlePosteChange}
      />

      {
        CustomButton ? (
          <CustomButton
          className="self-end"
            onClick={handleSave}
            disabled={mutation.isPending}
          >
            <Save size={18} />
            {mutation.isPending ? "Saving..." : "Save"}
          </CustomButton>
        ) : (
          <Skeleton className="h-10 w-full" />
        )
      }
    </div>
  );
};

export default UserCard;