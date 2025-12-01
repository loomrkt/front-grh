"use client";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Edit, Check, X, Loader2, MapPin, ChevronUp, ChevronDown } from "lucide-react";
import Skeleton from "@/components/skeleton";
import { GetRemoteComponent } from "@/services/get-remote-component";
import { Address } from "@/models/employe.dto";
import { updateEmployeAddress } from "@/services/employe";
import { toast } from "react-toastify";

interface AddressInfoProps {
  id: string;
  formData: Address | null; // Allow formData to be null
}

// Default address object for when formData is null
const defaultAddress: Address = {
  lotNumber: "",
  city: "",
  postalCode: "",
  district: "",
  municipality: "",
  region: "",
  country: "",
};

const AddressInfo = ({ id, formData }: AddressInfoProps) => {
  const { CustomInput } = GetRemoteComponent();

  // State for toggling visibility
  const [isVisible, setIsVisible] = useState(true);

  // Initialize state with formData or defaultAddress if formData is null
  const [data, setData] = useState(formData ?? defaultAddress);
  const [isEditing, setIsEditing] = useState(false);

  const mutation = useMutation({
    mutationFn: () => updateEmployeAddress(id, data),
    onSuccess: () => {
      setIsEditing(false);
      toast.success("Adresse mise à jour avec succès");
    },
    onError: (error) => {
      console.error(error);
      toast.error("Erreur lors de la mise à jour de l'adresse");
    },
  });

  const handleChange = (field: keyof Address, value: string) => {
    setData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    mutation.mutate();
  };

  const handleCancel = () => {
    setData(formData ?? defaultAddress); // Reset to formData or defaultAddress
    setIsEditing(false);
  };

  // Toggle visibility
  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  return (
    <div className="space-y-2 w-full">
      <div className="flex justify-between mb-2">
        <h1 className="text-2xl font-bold mb-4 flex items-center">
          <MapPin size={24} className="inline mr-2" />
          Adresse
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
                label="Numéro de lot"
                labelClassName="w-30"
                placeholder="Entrez le numéro de lot"
                value={data.lotNumber}
                onChange={(e: string) => handleChange("lotNumber", e)}
                disabled={!isEditing}
              />
              <CustomInput
                label="Ville"
                labelClassName="w-30"
                placeholder="Entrez la ville"
                value={data.city}
                onChange={(e: string) => handleChange("city", e)}
                disabled={!isEditing}
              />
              <CustomInput
                label="Code postal"
                labelClassName="w-30"
                placeholder="Entrez le code postal"
                value={data.postalCode}
                onChange={(e: string) => handleChange("postalCode", e)}
                disabled={!isEditing}
              />
              <CustomInput
                label="District"
                labelClassName="w-30"
                placeholder="Entrez le district"
                value={data.district}
                onChange={(e: string) => handleChange("district", e)}
                disabled={!isEditing}
              />
              <CustomInput
                label="Municipalité"
                labelClassName="w-30"
                placeholder="Entrez la municipalité"
                value={data.municipality}
                onChange={(e: string) => handleChange("municipality", e)}
                disabled={!isEditing}
              />
              <CustomInput
                label="Région"
                labelClassName="w-30"
                placeholder="Entrez la région"
                value={data.region}
                onChange={(e: string) => handleChange("region", e)}
                disabled={!isEditing}
              />
              <CustomInput
                label="Pays"
                labelClassName="w-30"
                placeholder="Entrez le pays"
                value={data.country}
                onChange={(e: string) => handleChange("country", e)}
                disabled={!isEditing}
              />
            </>
          ) : (
            Array.from({ length: 7 }).map((_, i) => (
              <Skeleton className="h-10 w-full" key={i} />
            ))
          )}
          <div className="flex justify-end mt-4">
              {
                isEditing ? (
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
                ) : null
              }
          </div>
        </>
      ) : null}
    </div>
  );
};

export default AddressInfo;