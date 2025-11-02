"use client";
import { useState } from "react";
import { Edit2, Save, X, Plus, Delete } from "lucide-react";
import { Button } from "@/components/ui/button";
import EducationInfo from "./EducationInfo";
import { Education as EducationType } from "@/models/types";

interface EducationsProps {
  educations?: EducationType[] | null;
  onSave?: (data: EducationType[]) => void;
}

const Educations = ({ educations, onSave }: EducationsProps) => {

  const handleChange = (field: keyof EducationType, value: string) => {
  };

  const handleSave = (index: number) => {
  };

  const handleCancel = (index: number) => {

  };

  const handleAddEducation = () => {
  };

  const handleDeleteEducation = (index: number) => {
  };

  return (
    <div className="w-full flex flex-col items-center p-4">
      <div className="mt-4 flex justify-between items-center gap-5 self-start w-full">
        <h2 className="text-lg font-semibold">
          {"Nouvelle éducation"}
        </h2>
        <Button variant="outline" onClick={handleAddEducation}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
          <div className="w-full mt-4 rounded-md">
            <div className="flex justify-between items-center gap-5">
              <h3 className="text-md font-semibold">Éducation</h3>
            </div>
            <EducationInfo
              isEditing={true}
              formData={{filedOfStudy:"",graduation:"", graduationYear:""}}
              handleChange={(field, value) => handleChange(field, value)}
            />
          </div>
    </div>
  );
};

export default Educations;