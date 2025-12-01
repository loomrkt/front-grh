"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Edit, Check, X, Loader2, User, ChevronDown, ChevronUp } from "lucide-react";
import Skeleton from "@/components/skeleton";
import { GetRemoteComponent } from "@/services/get-remote-component";
import { Identity } from "@/models/employe.dto";
import { updateEmployeIdentity } from "@/services/employe";
import { toast } from "react-toastify";
import { AxiosError } from "axios";

interface IdentityInfoProps {
  id: string;
  formData: Identity;
}

const IdentityInfo = ({ id, formData }: IdentityInfoProps) => {
  const { CustomInput } = GetRemoteComponent();

  // State for toggling visibility
  const [isVisible, setIsVisible] = useState(true);

  // Initialize data, ensuring birthDate is in YYYY-MM-DD format
  const [data, setData] = useState<Identity>({
    ...formData,
    birthDate: formData.birthDate
      ? new Date(formData.birthDate).toISOString().split("T")[0]
      : "",
  });
  const [isEditing, setIsEditing] = useState(false);

  const mutation = useMutation({
    mutationFn: () => updateEmployeIdentity(id, data),
    onSuccess: () => {
      setIsEditing(false);
      toast.success("Informations mises à jour avec succès");
    },
    onError: (error) => {
      const errorMessage =
        (error as AxiosError<{ message?: string }>)?.response?.data?.message ||
        "Erreur inconnue";
      toast.error(`Erreur lors de la mise à jour: ${errorMessage}`);
    },
  });

  const handleChange = (field: keyof Identity, value: string) => {
    if (field === "birthDate" && value) {
      const selectedDate = new Date(value);
      const today = new Date();
      if (selectedDate > today) {
        toast.error("La date de naissance ne peut pas être dans le futur");
        return;
      }
    }
    setData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    mutation.mutate();
  };

  const handleCancel = () => {
    setData({
      ...formData,
      birthDate: formData.birthDate
        ? new Date(formData.birthDate).toISOString().split("T")[0]
        : "",
    });
    setIsEditing(false);
  };

  // Toggle visibility
  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  return (
    <div className="space-y-2 w-full">
      <div className="flex justify-between cursor-pointer mb-2" onClick={toggleVisibility}>
        <h1 className="text-2xl font-bold mb-4 flex items-center">
          <User size={24} className="inline mr-2" />
          Identité
        </h1>
        <div className="flex items-center gap-2">
          {!isEditing ? (
            <button
              className="text-sm hover:underline flex items-center gap-1"
              onClick={(e) => {
                e.stopPropagation(); // Prevent click from bubbling to parent div
                setIsEditing(true);
              }}
            >
              <Edit size={16} />
            </button>
          ) : null}
          <button
            className="text-sm hover:underline border border-black rounded-full p-1 flex items-center gap-1"
          >
            {isVisible ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>

      {isVisible ? (
        <>
          {CustomInput ? (
            <>
              <CustomInput
                label="Nom"
                labelClassName="w-30"
                placeholder="Entrez le nom"
                value={data.lastName == "null" ? "" : data.lastName}
                onChange={(value: string) => handleChange("lastName", value)}
                disabled={!isEditing}
              />
              <CustomInput
                label="Prénom"
                labelClassName="w-30"
                placeholder="Entrez le prénom"
                value={data.firstName == "null" ? "" : data.firstName}
                onChange={(value: string) => handleChange("firstName", value)}
                disabled={!isEditing}
              />
              <CustomInput
                type="date"
                label="Date de naissance"
                labelClassName="w-30"
                placeholder="Sélectionnez une date"
                value={data.birthDate}
                onChange={(value: string) => handleChange("birthDate", value)}
                datePickerOnChange={(date: Date | undefined) => {
                  if (date) {
                    const today = new Date();
                    if (date > today) {
                      toast.error("La date de naissance ne peut pas être dans le futur");
                      return;
                    }
                    handleChange("birthDate", date.toISOString().split("T")[0]);
                  } else {
                    handleChange("birthDate", "");
                  }
                }}
                disabled={!isEditing}
              />
              <CustomInput
                label="Lieu de naissance"
                labelClassName="w-30"
                placeholder="Entrez le lieu"
                value={data.birthPlace == "null" ? "" : data.birthPlace}
                onChange={(value: string) => handleChange("birthPlace", value)}
                disabled={!isEditing}
              />
              <CustomInput
                label="Nationalité"
                labelClassName="w-30"
                placeholder="Entrez la nationalité"
                value={data.nationality == "null" ? "" : data.nationality}
                onChange={(value: string) => handleChange("nationality", value)}
                disabled={!isEditing}
              />
            </>
          ) : (
            Array.from({ length: 7 }).map((_, i) => (
              <Skeleton className="h-10 w-full" key={i} />
            ))
          )}
          <div className="flex justify-end mt-4">
            {isEditing && (
              <div className="flex items-center gap-2">
                <button
                  className="text-sm text-red-600 hover:underline flex items-center gap-1"
                  onClick={handleCancel}
                  disabled={mutation.isPending}
                >
                  <X size={16} />
                </button>
                <button
                  className="flex items-center gap-1 text-sm hover:underline"
                  onClick={handleSave}
                  disabled={mutation.isPending}
                >
                  {mutation.isPending ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Check size={16} />
                  )}
                </button>
              </div>
            )}
          </div>
        </>
      ) : null}
    </div>
  );
};

export default IdentityInfo;