"use client";
import Skeleton from "@/components/skeleton";
import { remoteComponent } from "@/helpers/remote-components";
import { Address } from "@/models/types";

interface AdresseInfoProps {
  isEditing: boolean;
  formData: Address;
  handleChange: (field: keyof Address, value: string) => void;
}

const AdresseInfo = ({
  isEditing,
  formData,
  handleChange,
}: AdresseInfoProps) => {
  const { CustomInput } = remoteComponent();

  return (
    <div className="space-y-2 mt-2 w-full">
      {CustomInput ? (
        <>
          <CustomInput
            label="Lot"
            labelClassName="w-30"
            placeholder="Entrez le lot"
            value={formData.lotNumber}
            onChange={(e: string) => handleChange("lotNumber", e)}
            disabled={!isEditing}
          />
          <CustomInput
            label="Code postale"
            labelClassName="w-30"
            placeholder="Entrez le code postale"
            value={formData.postalCode}
            onChange={(e: string) => handleChange("postalCode", e)}
            disabled={!isEditing}
          />
          <CustomInput
            label="Ville"
            labelClassName="w-30"
            placeholder="Entrez la ville"
            value={formData.city}
            onChange={(e: string) => handleChange("city", e)}
            disabled={!isEditing}
          />
          <CustomInput
            label="District"
            labelClassName="w-30"
            placeholder="Entrez le district"
            value={formData.district}
            onChange={(e: string) => handleChange("district", e)}
            disabled={!isEditing}
          />
          <CustomInput
            label="Commune"
            labelClassName="w-30"
            placeholder="Entrez la commune"
            value={formData.municipality}
            onChange={(e: string) => handleChange("municipality", e)}
            disabled={!isEditing}
          />
          <CustomInput
            label="Région"
            labelClassName="w-30"
            placeholder="Entrez la région"
            value={formData.region}
            onChange={(e: string) => handleChange("region", e)}
            disabled={!isEditing}
          />
          <CustomInput
            label="Pays"
            labelClassName="w-30"
            placeholder="Entrez le pays"
            value={formData.country}
            onChange={(e: string) => handleChange("country", e)}
            disabled={!isEditing}
          />
        </>
      ) : (
        <>
          <Skeleton className="w-full" />
          <Skeleton className="w-full" />
          <Skeleton className="w-full" />
          <Skeleton className="w-full" />
          <Skeleton className="w-full" />
          <Skeleton className="w-full" />
          <Skeleton className="w-full" />
        </>
      )}
    </div>
  );
};

export default AdresseInfo;
