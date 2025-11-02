"use client";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Edit, Check, X, Loader2, Plus, Delete, ChevronUp, ChevronDown } from "lucide-react";
import Skeleton from "@/components/skeleton";
import { getRemoteComponent } from "@/services/get-remote-component";
import { toast } from "react-toastify";
import { createEducation, updateEducationEmploye, deleteEducation } from "@/services/Education";
import { Education } from "@/models/employe.dto";

interface EducationInfoProps {
  isChildren?: boolean;
  id?: string; // Employee ID
  formData: Education[]; // Array of educations
}

interface ErrorData {
  propertyName: string;
  errorMessage: string;
}

const EducationInfo = ({ id, formData, isChildren }: EducationInfoProps) => {
  const { CustomInput } = getRemoteComponent();
  const [educations, setEducations] = useState<Education[]>(formData || []);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [visibility, setVisibility] = useState<{ [key: number]: boolean }>(
    formData.reduce((acc, _, index) => ({ ...acc, [index]: true }), {})
  );
  const [errors, setErrors] = useState<{ [key: number]: ErrorData[] }>({}); // Store errors per education index

  // Generate year options (1950 to current year + 5)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1950 + 6 }, (_, i) => 1950 + i).reverse();

  // Mutation for creating an education
  const createMutation = useMutation({
    mutationFn: (education: Education) => {
      if (!id) throw new Error("Employee ID is required");
      return createEducation(id, education, isChildren);
    },
    onSuccess: () => {
      toast.success("Éducation créée avec succès");
      setEditingIndex(null);
      setErrors((prev) => ({ ...prev, [editingIndex!]: [] })); // Clear errors on success
    },
    onError: (error: any) => {
      console.error(error);
      if (error.response?.data?.data) {
        setErrors((prev) => ({
          ...prev,
          [editingIndex!]: error.response.data.data, // Store errors for the current education
        }));
      }
      toast.error("Erreur lors de la création de l'éducation");
    },
  });

  // Mutation for updating an education
  const updateMutation = useMutation({
    mutationFn: ({ educationId, employeeId, education }: { educationId: string; employeeId: string; education: Education }) => {
      return updateEducationEmploye(educationId, employeeId, education);
    },
    onSuccess: () => {
      toast.success("Éducation mise à jour avec succès");
      setEditingIndex(null);
      setErrors((prev) => ({ ...prev, [editingIndex!]: [] })); // Clear errors on success
    },
    onError: (error: any) => {
      console.error(error);
      if (error.response?.data?.data) {
        setErrors((prev) => ({
          ...prev,
          [editingIndex!]: error.response.data.data, // Store errors for the current education
        }));
      }
      toast.error("Erreur lors de la mise à jour de l'éducation");
    },
  });

  // Mutation for deleting an education
  const deleteMutation = useMutation({
    mutationFn: (educationId: string) => {
      return deleteEducation(educationId);
    },
    onSuccess: () => {
      toast.success("Éducation supprimée avec succès");
      setEducations((prev) => prev.filter((_, i) => i !== editingIndex));
      setEditingIndex(null);
      setErrors((prev) => ({ ...prev, [editingIndex!]: [] })); // Clear errors on success
      setVisibility((prev) => {
        const newVisibility = { ...prev };
        delete newVisibility[editingIndex!];
        return newVisibility;
      });
    },
    onError: (error) => {
      console.error(error);
      toast.error("Erreur lors de la suppression de l'éducation");
    },
  });

  // Handle input changes for a specific education
  const handleChange = (index: number, field: keyof Education, value: string) => {
    setEducations((prev) =>
      prev.map((education, i) =>
        i === index ? { ...education, [field]: value } : education
      )
    );
    // Clear errors for the specific field when user starts typing
    setErrors((prev) => ({
      ...prev,
      [index]: prev[index]?.filter((err) => err.propertyName.toLowerCase() !== field.toLowerCase()) || [],
    }));
  };

  // Handle adding a new education
  const handleAddEducation = () => {
    setEducations((prev) => [
      ...prev,
      { id: "", graduation: "", etablissement: "", fieldOfStudy: "", graduationYear: new Date() },
    ]);
    const newIndex = educations.length;
    setEditingIndex(newIndex);
    setVisibility((prev) => ({ ...prev, [newIndex]: true }));
    setErrors((prev) => ({ ...prev, [newIndex]: [] })); // Initialize errors for new education
  };

  // Handle saving an education
  const handleSave = (index: number) => {
    const education = educations[index];
    if (education.id) {
      updateMutation.mutate({ educationId: education.id, employeeId: id!, education });
    } else {
      createMutation.mutate(education);
    }
  };

  // Handle canceling edit
  const handleCancel = (index: number) => {
    if (educations[index].id) {
      setEducations((prev) => prev.map((education, i) => (i === index ? formData[i] || education : education)));
    } else {
      setEducations((prev) => prev.filter((_, i) => i !== index));
      setVisibility((prev) => {
        const newVisibility = { ...prev };
        delete newVisibility[index];
        return newVisibility;
      });
    }
    setEditingIndex(null);
    setErrors((prev) => ({ ...prev, [index]: [] })); // Clear errors on cancel
  };

  // Handle deleting an education
  const handleDelete = (index: number) => {
    const education = educations[index];
    if (education.id) {
      deleteMutation.mutate(education.id);
    } else {
      setEducations((prev) => prev.filter((_, i) => i !== index));
      setVisibility((prev) => {
        const newVisibility = { ...prev };
        delete newVisibility[index];
        return newVisibility;
      });
      setErrors((prev) => ({ ...prev, [index]: [] })); // Clear errors on delete
    }
  };

  // Toggle visibility for a specific education
  const toggleVisibility = (index: number) => {
    setEditingIndex(null);
    setVisibility((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  // Get error message for a specific field and education index
  const getErrorMessage = (index: number, field: string) => {
    return errors[index]?.find((err) => err.propertyName.toLowerCase() === field.toLowerCase())?.errorMessage || "";
  };

  return (
    <div className="space-y-2 mt-2 w-full">
      <div className="flex justify-between mb-2">
        <h1 className="text-2xl font-bold mb-4">Éducation</h1>
        <button
          className="flex items-center gap-1 text-sm hover:underline"
          onClick={handleAddEducation}
          disabled={editingIndex !== null}
        >
          <Plus size={16} />
          Ajouter
        </button>
      </div>

      {educations.length === 0 && !editingIndex && (
        <p>Aucune information sur l'éducation enregistrée.</p>
      )}

      {educations.map((education, index) => (
        <div key={index} className="border p-4 rounded-md mb-4">
          <div className="flex justify-between mb-2 gap-2">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold">Éducation {index + 1}</h2>
              {education.id && editingIndex === index && (
                <button
                  className="text-sm text-red-600 hover:underline flex items-center gap-1"
                  onClick={() => handleDelete(index)}
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
                  <Delete size={16} />
                </button>
              )}
            </div>
            <div className="flex items-center gap-2">
              {editingIndex !== index ? (
                <button
                  className="text-sm hover:underline flex items-center gap-1"
                  onClick={() => setEditingIndex(index)}
                  disabled={editingIndex !== null}
                >
                  <Edit size={16} />
                </button>
              ) : null}
              {editingIndex !== index && (
                <button
                  className="text-sm hover:underline border border-black rounded-full p-1 flex items-center gap-1"
                  onClick={() => toggleVisibility(index)}
                >
                  {visibility[index] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
              )}
            </div>
          </div>

          {visibility[index] && (
            <>
              {CustomInput ? (
                <>
                  <div className="relative">
                    <CustomInput
                      label="Diplôme"
                      labelClassName="w-30"
                      placeholder="Entrez le diplôme"
                      value={education.graduation}
                      onChange={(value: string) => handleChange(index, "graduation", value)}
                      disabled={editingIndex !== index}
                    />
                    {getErrorMessage(index, "graduation") && (
                      <p className="text-red-600 text-sm mt-1">{getErrorMessage(index, "graduation")}</p>
                    )}
                  </div>
                  <div className="relative">
                    <CustomInput
                      label="Établissement"
                      labelClassName="w-30"
                      placeholder="Entrez l'établissement"
                      value={education.etablissement}
                      onChange={(value: string) => handleChange(index, "etablissement", value)}
                      disabled={editingIndex !== index}
                    />
                    {getErrorMessage(index, "etablissement") && (
                      <p className="text-red-600 text-sm mt-1">{getErrorMessage(index, "etablissement")}</p>
                    )}
                  </div>
                  <div className="relative">
                    <CustomInput
                      label="Domaine d'étude"
                      labelClassName="w-30"
                      placeholder="Entrez le domaine d'étude"
                      value={education.fieldOfStudy}
                      onChange={(value: string) => handleChange(index, "fieldOfStudy", value)}
                      disabled={editingIndex !== index}
                    />
                    {getErrorMessage(index, "fieldOfStudy") && (
                      <p className="text-red-600 text-sm mt-1">{getErrorMessage(index, "fieldOfStudy")}</p>
                    )}
                  </div>
                  <div className="relative">
                    <CustomInput
                      type="select"
                      label="Année d'obtention"
                      labelClassName="w-30"
                      value={education.graduationYear}
                      onChange={(value: string) => handleChange(index, "graduationYear", value)}
                      selectOptions={years.map((year) => ({
                        value: year.toString(),
                        label: year.toString(),
                      }))}
                      disabled={editingIndex !== index}
                    />
                    {getErrorMessage(index, "graduationYear") && (
                      <p className="text-red-600 text-sm mt-1">{getErrorMessage(index, "graduationYear")}</p>
                    )}
                  </div>
                  {editingIndex === index && (
                    <div className="flex justify-end mt-4">
                      <div className="flex items-center gap-2">
                        <button
                          className="text-sm text-red-600 hover:underline flex items-center gap-1"
                          onClick={() => handleCancel(index)}
                          disabled={createMutation.isPending || updateMutation.isPending}
                        >
                          <X size={16} />
                        </button>
                        <button
                          className="flex items-center gap-1 text-sm hover:underline"
                          onClick={() => handleSave(index)}
                          disabled={createMutation.isPending || updateMutation.isPending}
                        >
                          {createMutation.isPending || updateMutation.isPending ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : (
                            <Check size={16} />
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton className="h-10 w-full" key={i} />
                ))
              )}
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default EducationInfo;