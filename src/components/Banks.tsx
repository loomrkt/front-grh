"use client";
import { Button } from "@/components/ui/button";
import { Edit2, Save, X } from "lucide-react";
import { useState } from "react";
import { Bank } from "@/models/types";
import BankInfo from "./BankInfo";

interface BanksProps {
  bank?: Bank | null;
  index?: number;
}

const Banks = ({ bank, index }: BanksProps) => {
  const [isEditing, setIsEditing] = useState(!bank);
  const [formData, setFormData] = useState<Bank>(
    bank || {
      id: "",
      rib: "",
      iban: "",
      countryCode: "",
      bic: "",
      accountLabel: "",
    }
  );

  const handleChange = (field: keyof Bank, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    setIsEditing(false);
  };

  const handleCancel = () => {
    if (bank) {
      setFormData(bank);
    } else {
      setFormData({
        id: "",
        rib: "",
        iban: "",
        countryCode: "",
        bic: "",
        accountLabel: "",
      });
    }
    setIsEditing(false);
  };

  return (
    <div className="w-full flex flex-col items-center p-4">
      <div className="mt-4 flex justify-between items-center gap-5 self-start">
        <h2 className="text-lg font-semibold">{bank ? `Information bancaire ${index}` : "Nouvelle banque"}</h2>
        {!isEditing ? (
          <Button variant="outline" onClick={() => setIsEditing(true)}>
            <Edit2 className="h-4 w-4" />
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCancel}>
              <X className="h-4 w-4" />
            </Button>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
      <BankInfo
        isEditing={isEditing}
        formData={formData}
        handleChange={handleChange}
      />
    </div>
  );
};

export default Banks;
