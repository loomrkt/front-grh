"use client";
import { useState } from "react";
import { Edit2, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import OccupationInfo from "./OccupationInfo";
import { Occupation as OccupationType } from "@/models/types";

interface OccupationProps {
  occupation?: OccupationType | null;
}

const Occupation = ({ occupation }: OccupationProps) => {
  const [isEditing, setIsEditing] = useState(!occupation);
  const [formData, setFormData] = useState<OccupationType>(
    occupation || {
      status: "",
      position: "",
      supervisor: "",
    }
  );

  const handleChange = (field: keyof OccupationType, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    console.log(occupation ? "Poste modifié :" : "Poste ajouté :", formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    if (occupation) {
      setFormData(occupation);
    } else {
      setFormData({
        status: "",
        position: "",
        supervisor: "",
      });
    }
    setIsEditing(false);
  };

  return (
    <div className="w-full flex flex-col items-center p-4">
      <div className="mt-4 flex justify-between items-center gap-5 self-start">
        <h2 className="text-lg font-semibold">
          {occupation ? "Poste occupé" : "Nouveau poste"}
        </h2>
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

      <OccupationInfo
        isEditing={isEditing}
        formData={formData}
        handleChange={handleChange}
      />
    </div>
  );
};

export default Occupation;
