"use client";
import { Button } from "@/components/ui/button";
import { Edit2, Save, X } from "lucide-react";
import { useState } from "react";
import { Child, Identity } from "@/models/types";
import IdentityInfo from "./IdentityInfo";

interface ChildProps {
  child: Child | null;
    index?: number;
}

const ChildComponent = ({ child,index }: ChildProps) => {
  const [isEditing, setIsEditing] = useState(!child);
  const [formData, setFormData] = useState<Child>(
    child || {
      id: "",
      isDependent: false,
      identity: {
        firstName: "",
        lastName: "",
        civility: "",
        gender: "MALE",
        birthDate: "",
        birthPlace: "",
        nationality: "",
      },
    }
  );

  const handleIdentityChange = (field: keyof Identity, value: string) => {
    setFormData((prev) => ({
      ...prev,
      identity: {
        ...prev.identity,
        [field]: value,
      },
    }));
  };

  const handleDependencyChange = (value: boolean) => {
    setFormData((prev) => ({
      ...prev,
      isDependent: value,
    }));
  };

  const handleSave = () => {
    console.log(child ? "Enfant modifié :" : "Nouvel enfant :", formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    if (child) {
      setFormData(child);
    } else {
      setFormData({
        id: "",
        isDependent: false,
        identity: {
          firstName: "",
          lastName: "",
          civility: "",
          gender: "MALE",
          birthDate: "",
          birthPlace: "",
          nationality: "",
        },
      });
    }
    setIsEditing(false);
  };

  return (
    <div className="w-fit flex flex-col items-center p-4">
      <div className="mt-4 flex justify-between items-center gap-5 self-start">
        <h2 className="text-lg font-semibold">{child ? `Enfant ${index}` : "Nouvel enfant"}</h2>
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

      <IdentityInfo
        isEditing={isEditing}
        formData={formData.identity}
        handleChange={handleIdentityChange}
      />

      {isEditing && (
        <div className="mt-4 flex items-center gap-2 self-start">
          <label className="text-sm font-medium">À charge :</label>
          <input
            type="checkbox"
            checked={formData.isDependent}
            onChange={(e) => handleDependencyChange(e.target.checked)}
          />
        </div>
      )}

      {!isEditing && (
        <p className="mt-2 self-start text-sm">
          <span className="font-medium">À charge :</span> {formData.isDependent ? "Oui" : "Non"}
        </p>
      )}
    </div>
  );
};

export default ChildComponent;
