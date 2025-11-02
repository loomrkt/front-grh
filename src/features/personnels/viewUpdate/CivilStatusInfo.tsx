"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Edit, Check, X, Loader2, Users2, ChevronUp, ChevronDown } from "lucide-react";
import Skeleton from "@/components/skeleton";
import { getRemoteComponent } from "@/services/get-remote-component";
import { CivilStatus, Gender, Civility, CivilStatusType } from "@/models/employe.dto";
import { updateCivilStatus } from "@/services/employe";
import { toast } from "react-toastify";
import { AxiosError } from "axios";

interface CivilStatusInfoProps {
  id: string;
  formData?: CivilStatus; // Make formData optional
}

const CivilStatusInfo = ({ id, formData }: CivilStatusInfoProps) => {
  const { CustomInput } = getRemoteComponent();
  
  // State for toggling visibility
  const [isVisible, setIsVisible] = useState(true);

  // Default CivilStatus object to use when formData is null/undefined
  const defaultCivilStatus: CivilStatus = {
    maritalStatus: "SINGLE",
    spouseLastName: "",
    spouseFirstName: "",
    profil: { name: "", url: null, contentType: "", extension: "" },
    gender: null,
    birthDate: "",
    birthPlace: "",
    nationality: "",
    phoneNumber: [],
    email: [],
  };

  // Initialize data, ensuring birthDate is in YYYY-MM-DD format or empty string
  const [data, setData] = useState<CivilStatus>(
    formData
      ? {
          ...formData,
          birthDate:
            formData.birthDate && typeof formData.birthDate === "string"
              ? new Date(formData.birthDate).toISOString().split("T")[0]
              : "",
          email: formData.email || [],
          phoneNumber: formData.phoneNumber || [],
        }
      : defaultCivilStatus
  );
  const [isEditing, setIsEditing] = useState(false);

  const mutation = useMutation({
    mutationFn: () => updateCivilStatus(id, data),
    onSuccess: () => {
      setIsEditing(false);
      toast.success("État civil mis à jour avec succès");
    },
    onError: (error) => {
      const errorMessage =
        (error as AxiosError<{ message?: string }>)?.response?.data?.message ||
        "Erreur inconnue";
      toast.error(`Erreur lors de la mise à jour: ${errorMessage}`);
    },
  });

  const handleChange = (
    field: keyof CivilStatus,
    value: string | string[] | Gender | Civility | null
  ) => {
    if (field === "birthDate" && typeof value === "string" && value) {
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

  const handleCancel = () => {
    setData(
      formData
        ? {
            ...formData,
            birthDate:
              formData.birthDate && typeof formData.birthDate === "string"
                ? new Date(formData.birthDate).toISOString().split("T")[0]
                : "",
            email: formData.email || [],
            phoneNumber: formData.phoneNumber || [],
          }
        : defaultCivilStatus
    );
    setIsEditing(false);
  };

  const handleSave = () => {
    // If not married, clear spouse-related fields
    if (data.maritalStatus !== "MARRIED") {
      setData((prev) => ({
        ...prev,
        spouseLastName: "",
        spouseFirstName: "",
        gender: null,
        civility: null,
        birthDate: "",
        birthPlace: "",
        nationality: "",
        phoneNumber: [],
        email: [],
      }));
    }
    mutation.mutate();
  };

  // Determine if spouse fields should be disabled
  const isSpouseFieldsDisabled = !isEditing || data.maritalStatus !== "MARRIED";


  const EtatCivilOptions: { value: CivilStatusType; label: string }[] = [
      { value: "SINGLE", label: "Célibataire" },
        { value: "MARRIED", label: "Marié(e)" },
        { value: "DIVORCED", label: "Divorcé(e)" },
        { value: "WIDOWED", label: "Veuf/Veuve" },
  ];

  // Toggle visibility
  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  }

  return (
    <div className="space-y-2 mt-2 w-full">
      <div className="flex justify-between mb-2">
        <h1 className="text-2xl font-bold mb-4 flex items-center">
          <Users2 size={24} className="inline mr-2" />
          État Civil
        </h1>
        <div className="flex items-center gap-2">
          {!isEditing ? (
            <button
              className="text-sm hover:underline flex items-center gap-1"
              onClick={() => setIsEditing(true)}
            >
              <Edit size={16} />
            </button>
          ) : null}
          <button
            className="text-sm hover:underline border border-black rounded-full p-1 flex items-center gap-1"
            onClick={toggleVisibility}
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
                type="select"
                label="État civil"
                labelClassName="w-30"
                placeholder="..."
                value={data.maritalStatus}
                selectOptions={EtatCivilOptions}
                onChange={(value: string) => handleChange("maritalStatus", value)}
                disabled={!isEditing}
              />
              <CustomInput
                label="Nom du conjoint"
                labelClassName="w-30"
                placeholder="Entrez le nom du conjoint"
                value={data.spouseLastName || ""}
                onChange={(value: string) => handleChange("spouseLastName", value)}
                disabled={isSpouseFieldsDisabled}
              />
              <CustomInput
                label="Prénom du conjoint"
                labelClassName="w-30"
                placeholder="Entrez le prénom du conjoint"
                value={data.spouseFirstName || ""}
                onChange={(value: string) => handleChange("spouseFirstName", value)}
                disabled={isSpouseFieldsDisabled}
              />
              <CustomInput
                type="select"
                label="Genre"
                labelClassName="w-30"
                placeholder="Sélectionnez le genre"
                value={data.gender || ""}
                selectOptions={[
                  { value: "MALE", label: "Homme" },
                  { value: "FEMALE", label: "Femme" },
                ]}
                onChange={(value: string) => handleChange("gender", value as Gender)}
                disabled={isSpouseFieldsDisabled}
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
                disabled={isSpouseFieldsDisabled}
              />
              <CustomInput
                label="Lieu de naissance"
                labelClassName="w-30"
                placeholder="Entrez le lieu"
                value={data.birthPlace || ""}
                onChange={(value: string) => handleChange("birthPlace", value)}
                disabled={isSpouseFieldsDisabled}
              />
              <CustomInput
                label="Nationalité"
                labelClassName="w-30"
                placeholder="Entrez la nationalité"
                value={data.nationality || ""}
                onChange={(value: string) => handleChange("nationality", value)}
                disabled={isSpouseFieldsDisabled}
              />
              <CustomInput
                label="Téléphone"
                labelClassName="w-30"
                placeholder="Entrez le numéro de téléphone"
                value={data.phoneNumber?.[0] || ""}
                onChange={(value: string) => handleChange("phoneNumber", [value])}
                disabled={isSpouseFieldsDisabled}
              />
              <CustomInput
                label="Email"
                labelClassName="w-30"
                placeholder="Entrez l'email"
                value={data.email?.[0] || ""}
                onChange={(value: string) => handleChange("email", [value])}
                disabled={isSpouseFieldsDisabled}
              />
            </>
          ) : (
            Array.from({ length: 10 }).map((_, i) => (
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

export default CivilStatusInfo;