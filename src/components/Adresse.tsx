"use client";
import { Button } from "@/components/ui/button";
import { Edit2, Save, X } from "lucide-react";
import { useState } from "react";
import { Address } from "@/models/types";
import AdresseInfo from "./AddressInfo";

interface AdresseProps {
  address: Address | null;
}

const Adresse = ({ address }: AdresseProps) => {
  const [isEditing, setIsEditing] = useState(!address); // Start in editing mode if address is null (creation)
  const [formData, setFormData] = useState<Address>(
    address || {
        city: "",
        country: "",
        postalCode: "",
        district: "",
        lotNumber: "",
        municipality: "",
        region: "",
    }
  );

  const handleChange = (field: keyof Address, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    console.log(address ? "Adresse sauvegardée :" : "Adresse créée :", formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    if (address) {
      setFormData(address);
    } else {
      setFormData({
        city: "",
        country: "",
        postalCode: "",
        district: "",
        lotNumber: "",
        municipality: "",
        region: "",
      });
    }
    setIsEditing(false);
  };

  return (
    <div className="w-fit flex flex-col items-center p-4">
      <div className="mt-4 flex justify-between items-center gap-5 self-start">
        <h2 className="text-lg font-semibold">{address ? "Adresse" : "Nouvelle Adresse"}</h2>
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
      <AdresseInfo
        isEditing={isEditing}
        formData={formData}
        handleChange={handleChange}
      />
    </div>
  );
};

export default Adresse;