"use client";
import Skeleton from "@/components/skeleton";
import { remoteComponent } from "@/helpers/remote-components";
import { Bank } from "@/models/types";

interface BankInfoProps {
  isEditing: boolean;
  formData: Bank;
  handleChange: (field: keyof Bank, value: string) => void;
}

const BankInfo = ({
  isEditing,
  formData,
  handleChange,
}: BankInfoProps) => {
  const { CustomInput } = remoteComponent();

  return (
    <div className="space-y-2 mt-2 w-full">
      {CustomInput ? (
        <>
          <CustomInput
            label="RIB"
            labelClassName="w-30"
            placeholder="Entrez le RIB"
            value={formData.rib}
            onChange={(e: string) => handleChange("rib", e)}
            disabled={!isEditing}
          />
          <CustomInput
            label="IBAN"
            labelClassName="w-30"
            placeholder="Entrez le IBAN"
            value={formData.iban}
            onChange={(e: string) => handleChange("iban", e)}
            disabled={!isEditing}
          />
          <CustomInput
            label="BIC"
            labelClassName="w-30"
            placeholder="Entrez le BIC"
            value={formData.bic}
            onChange={(e: string) => handleChange("bic", e)}
            disabled={!isEditing}
          />
          <CustomInput
            label="Code pays"
            labelClassName="w-30"
            placeholder="Entrez le Code pays"
            value={formData.countryCode}
            onChange={(e: string) => handleChange("countryCode", e)}
            disabled={!isEditing}
          />
          <CustomInput
            label="Libellé"
            labelClassName="w-30"
            placeholder="Entrez le libellé du compte"
            value={formData.accountLabel}
            onChange={(e: string) => handleChange("accountLabel", e)}
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
        </>
      )}
    </div>
  );
};

export default BankInfo;
