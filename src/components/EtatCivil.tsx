"use client";
import { useState } from "react";
import { GetRemoteComponent } from "@/services/get-remote-component";
import { Button } from "./ui/button";
import { Edit2, Save, X } from "lucide-react";
import { CivilStatus, MaritalStatus } from "@/models/types";

interface EtatCivilProps {
  civilStatus: CivilStatus;
}

const EtatCivil = ({ civilStatus }: EtatCivilProps) => {
  const { CustomInput } = GetRemoteComponent();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(civilStatus);

  const handleChange = (field: keyof CivilStatus, value: string | MaritalStatus) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData(civilStatus);
    setIsEditing(false);
  };

  return (
    <div className="w-fit flex flex-col items-center p-4 border rounded-lg shadow-sm">
      <div className="mt-4 flex justify-start items-center gap-5 self-start w-full">
        <h2 className="text-lg font-semibold">État Civil</h2>
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
      <div className="space-y-2 mt-2 w-full">
        {CustomInput && (
          <>
            <CustomInput 
              label="Situation familiale" 
              labelClassName="w-30" 
              value={formData.maritalStatus}
              readOnly={!isEditing}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => isEditing && handleChange('maritalStatus', e.target.value as MaritalStatus)}
            />
            
            {formData.maritalStatus === "MARRIED" && formData.spouseIdentity && (
              <>
                <CustomInput 
                  label="Nom du conjoint" 
                  labelClassName="w-30" 
                  value={formData.spouseIdentity.lastName}
                  readOnly={!isEditing}
                />
                
                <CustomInput 
                  label="Prénom du conjoint" 
                  labelClassName="w-30" 
                  value={formData.spouseIdentity.firstName}
                  readOnly={!isEditing}
                />
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default EtatCivil;