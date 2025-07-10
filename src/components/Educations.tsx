"use client";
import { Button } from "@/components/ui/button";
import { Edit2, Save, X } from "lucide-react";
import { useState } from "react";
import { Education } from "@/models/types";
import EducationInfo from "./EducationInfo";

interface EducationsProps {
  education: Education | null;
  index?: number;
}

const Educations = ({ education, index }: EducationsProps) => {
  const [isEditing, setIsEditing] = useState(!education);
  const [formData, setFormData] = useState<Education>(
    education || {
      graduation: "",
      filedOfStudy: "",
      graduationYear: "",
    }
  );

  const handleChange = (field: keyof Education, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    console.log(education ? "Éducation mise à jour :" : "Nouvelle éducation :", formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    if (education) {
      setFormData(education);
    } else {
      setFormData({
        graduation: "",
        filedOfStudy: "",
        graduationYear: "",
      });
    }
    setIsEditing(false);
  };

  return (
    <div className="w-fit flex flex-col items-center p-4">
      <div className="mt-4 flex justify-between items-center gap-5 self-start">
        <h2 className="text-lg font-semibold">{education ? `Éducation${index}` : "Nouvelle éducation"}</h2>
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
      <EducationInfo
        isEditing={isEditing}
        formData={formData}
        handleChange={handleChange}
      />
    </div>
  );
};

export default Educations;
