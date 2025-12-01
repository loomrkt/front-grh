
"use client";
import { useState, useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Edit, Check, X, Loader2, Plus, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import Skeleton from "@/components/skeleton";
import { GetRemoteComponent } from "@/services/get-remote-component";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import { createChild, updateChild, deleteChild } from "@/services/Child";
import { Child, Gender } from "@/models/employe.dto";
import ProfileImage from "../ProfileImage";
import EducationInfo from "./EducationInfo";

interface ChildInfoProps {
  id?: string; // Employee ID
  formData: Child[] | null; // Array of children or null
}

interface ErrorData {
  propertyName: string;
  errorMessage: string;
}

const ChildInfo = ({ id, formData }: ChildInfoProps) => {
  // Normalize child data to ensure consistent initial state
  const normalizeChild = (child: Child): Child => ({
    ...child,
    educations: child.educations 
      ? child.educations.map((edu) => ({
          ...edu,
          graduation: edu.graduation || "",
          fieldOfStudy: edu.fieldOfStudy || "",
          etablissement: edu.etablissement || "",
          graduationYear: edu.graduationYear || "",
        }))
      : [],
    identity: {
      firstName: child.identity?.firstName || "",
      lastName: child.identity?.lastName || "",
      nationality: child.identity?.nationality || "",
      birthPlace: child.identity?.birthPlace || "",
      birthDate: child.identity?.birthDate ? new Date(child.identity.birthDate).toISOString().split("T")[0] : "",
      gender: child.identity?.gender || null,
      civility: child.identity?.civility || null,
      profil: child.identity?.profil || null,
    },
    file: child.file || { formFile: null },
  });

  const { CustomInput } = GetRemoteComponent();
  const queryClient = useQueryClient();
  const [children, setChildren] = useState<Child[]>(formData ? formData.map(normalizeChild) : []);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [visibility, setVisibility] = useState<{ [key: number]: boolean }>(
    (formData || []).reduce((acc, _, index) => ({ ...acc, [index]: true }), {})
  );
  const [errors, setErrors] = useState<{ [key: number]: ErrorData[] }>({});

  // Mutations
  const createChildMutation = useMutation({
    mutationFn: (child: Child) => {
      if (!id) throw new Error("Employee ID is required");
      return createChild(id, child);
    },
    onSuccess: (data) => {
      toast.success("Enfant créé avec succès");
      setChildren((prev) => prev.map((c, i) => (i === editingIndex ? { ...c, id: data.id } : c)));
      setEditingIndex(null);
      setErrors((prev) => ({ ...prev, [editingIndex!]: [] }));
      queryClient.invalidateQueries({ queryKey: ["children", id] });
    },
    onError: (error: AxiosError<{ message?: string; data?: ErrorData[] }>) => {
      if (error.response?.data?.data) {
        setErrors((prev) => ({
          ...prev,
          [editingIndex!]: error.response?.data?.data || [],
        }));
      }
      toast.error(`Erreur lors de la création: ${error.response?.data?.message || "Erreur inconnue"}`);
    },
  });

  const updateChildMutation = useMutation({
    mutationFn: ({ childId, child }: { childId: string; child: Child }) => updateChild(childId, child),
    onSuccess: () => {
      toast.success("Enfant mis à jour avec succès");
      setEditingIndex(null);
      setErrors((prev) => ({ ...prev, [editingIndex!]: [] }));
      queryClient.invalidateQueries({ queryKey: ["children", id] });
    },
    onError: (error: AxiosError<{ message?: string; data?: ErrorData[] }>) => {
      if (error.response?.data?.data) {
        setErrors((prev) => ({
          ...prev,
          [editingIndex!]: error.response?.data?.data || [],
        }));
      }
      toast.error(`Erreur lors de la mise à jour: ${error.response?.data?.message || "Erreur inconnue"}`);
    },
  });

  const deleteChildMutation = useMutation({
    mutationFn: (childId: string) => deleteChild(childId),
    onSuccess: () => {
      toast.success("Enfant supprimé avec succès");
      setChildren((prev) => prev.filter((_, i) => i !== editingIndex));
      setEditingIndex(null);
      setErrors((prev) => ({ ...prev, [editingIndex!]: [] }));
      setVisibility((prev) => {
        const newVisibility = { ...prev };
        delete newVisibility[editingIndex!];
        return newVisibility;
      });
      queryClient.invalidateQueries({ queryKey: ["children", id] });
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      toast.error(`Erreur lors de la suppression: ${error.response?.data?.message || "Erreur inconnue"}`);
    },
  });

  // Handle input changes
  const handleChange = useCallback(
    (
      childIndex: number,
      field: keyof Child | `identity.${keyof Child['identity']}`,
      value: string | boolean | File | null
    ) => {
      // Validation for required fields
      if (field === "identity.firstName" && !value) {
        setErrors((prev) => ({
          ...prev,
          [childIndex]: [
            ...(prev[childIndex] || []),
            { propertyName: "firstName", errorMessage: "Le prénom est requis" },
          ],
        }));
        return;
      }
      if (field === "identity.lastName" && !value) {
        setErrors((prev) => ({
          ...prev,
          [childIndex]: [
            ...(prev[childIndex] || []),
            { propertyName: "lastName", errorMessage: "Le nom est requis" },
          ],
        }));
        return;
      }
      if (field === "identity.birthDate" && typeof value === "string" && value) {
        const selectedDate = new Date(value);
        const today = new Date();
        if (selectedDate > today) {
          setErrors((prev) => ({
            ...prev,
            [childIndex]: [
              ...(prev[childIndex] || []),
              { propertyName: "birthDate", errorMessage: "La date de naissance ne peut pas être dans le futur" },
            ],
          }));
          return;
        }
      }

      setChildren((prev) =>
        prev.map((child, i) => {
          if (i !== childIndex) return child;
          if (field.startsWith("identity.")) {
            const identityField = field.split(".")[1] as keyof Child['identity'];
            return {
              ...child,
              identity: { ...child.identity, [identityField]: value },
            };
          }
          if (field === "file" && (value instanceof File || value === null)) {
            return { ...child, file: { formFile: value } };
          }
          return { ...child, [field]: value };
        })
      );

      // Clear errors for the specific field
      setErrors((prev) => ({
        ...prev,
        [childIndex]: prev[childIndex]?.filter((err) => err.propertyName.toLowerCase() !== field.split(".").pop()?.toLowerCase()) || [],
      }));
    },
    []
  );

  // Handle adding a new child
  const handleAddChild = () => {
    setChildren((prev) => [
      ...prev,
      {
        id: "",
        educations: [],
        identity: {
          firstName: "",
          lastName: "",
          civility: null,
          gender: null,
          nationality: "",
          birthPlace: "",
          birthDate: "",
          profil: null,
        },
        isDependent: false,
        file: { formFile: null },
      },
    ]);
    const newIndex = children.length;
    setEditingIndex(newIndex);
    setVisibility((prev) => ({ ...prev, [newIndex]: true }));
    setErrors((prev) => ({ ...prev, [newIndex]: [] }));
  };

  // Handle saving a child
  const handleSave = (index: number) => {
    const child = children[index];
    if (!child.identity.firstName || !child.identity.lastName) {
      setErrors((prev) => ({
        ...prev,
        [index]: [
          ...(prev[index] || []),
          ...(!child.identity.firstName ? [{ propertyName: "firstName", errorMessage: "Le prénom est requis" }] : []),
          ...(!child.identity.lastName ? [{ propertyName: "lastName", errorMessage: "Le nom est requis" }] : []),
        ],
      }));
      return;
    }
    if (child.id) {
      updateChildMutation.mutate({ childId: child.id, child });
    } else {
      createChildMutation.mutate(child);
    }
  };

  // Handle canceling edit
  const handleCancel = (index: number) => {
    if (children[index].id) {
      if (formData && formData[index]) {
        setChildren((prev) => prev.map((child, i) => (i === index ? normalizeChild(formData[i]) : child)));
      }
    } else {
      setChildren((prev) => prev.filter((_, i) => i !== index));
      setVisibility((prev) => {
        const newVisibility = { ...prev };
        delete newVisibility[index];
        return newVisibility;
      });
    }
    setEditingIndex(null);
    setErrors((prev) => ({ ...prev, [index]: [] }));
  };

  // Handle deleting a child
  const handleDelete = (index: number) => {
    const child = children[index];
    if (child.id) {
      deleteChildMutation.mutate(child.id);
    } else {
      setChildren((prev) => prev.filter((_, i) => i !== index));
      setVisibility((prev) => {
        const newVisibility = { ...prev };
        delete newVisibility[index];
        return newVisibility;
      });
      setErrors((prev) => ({ ...prev, [index]: [] }));
    }
  };

  // Toggle visibility for a specific child
  const toggleVisibility = (index: number) => {
    setEditingIndex(null);
    setVisibility((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  // Get error message for a specific field and child index
  const getErrorMessage = (index: number, field: string) => {
    return errors[index]?.find((err) => err.propertyName.toLowerCase() === field.toLowerCase())?.errorMessage || "";
  };

  // Check if any mutation is pending
  const isPending =
    createChildMutation.isPending ||
    updateChildMutation.isPending ||
    deleteChildMutation.isPending;

  const genderOptions: { value: Gender; label: string }[] = [
    { value: "FEMALE", label: "Femme" },
    { value: "MALE", label: "Homme" },
  ];

  return (
    <div className="space-y-2 mt-2 w-full">
      <div className="flex justify-between mb-2">
        <h1 className="text-2xl font-bold mb-4">Informations sur les Enfants</h1>
        <button
          className="flex items-center gap-1 text-sm hover:underline"
          onClick={handleAddChild}
          disabled={editingIndex !== null || isPending}
        >
          <Plus size={16} />
          Ajouter un enfant
        </button>
      </div>

      {children.length === 0 && !editingIndex && (
        <p className="text-gray-500">Aucune information sur les enfants enregistrée.</p>
      )}
      {children.map((child, childIndex) => (
        <div key={childIndex} className="border p-4 rounded-md mb-4 bg-white">
          <div className="flex justify-between mb-2 gap-2">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold">Enfant {childIndex + 1}</h2>
              {child.id && editingIndex === childIndex && (
                <button
                  className="text-sm text-red-600 hover:underline flex items-center gap-1"
                  onClick={() => handleDelete(childIndex)}
                  disabled={isPending}
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
            <div className="flex items-center gap-2">
              {editingIndex !== childIndex && (
                <button
                  className="text-sm hover:underline flex items-center gap-1"
                  onClick={() => setEditingIndex(childIndex)}
                  disabled={editingIndex !== null || isPending}
                >
                  <Edit size={16} />
                </button>
              )}
              <button
                className="text-sm hover:underline border border-black rounded-full p-1 flex items-center gap-1"
                onClick={() => toggleVisibility(childIndex)}
              >
                {visibility[childIndex] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
            </div>
          </div>

          {visibility[childIndex] && (
            <div className="space-y-4">
              {CustomInput ? (
                <div>
                  <div className="flex justify-center mb-10">
                    <ProfileImage
                      initialImage={child.identity.profil?.url || undefined}
                      onFileChange={(file: File | null) => handleChange(childIndex, "file", file)}
                    />
                  </div>
                  <div className="space-y-3">
                    <div className="relative">
                      <CustomInput
                        label="Prénom"
                        labelClassName="w-40 font-medium"
                        placeholder="Entrez le prénom"
                        value={child.identity.firstName}
                        onChange={(value: string) => handleChange(childIndex, "identity.firstName", value)}
                        disabled={editingIndex !== childIndex}
                      />
                      {getErrorMessage(childIndex, "firstName") && (
                        <p className="text-red-600 text-sm mt-1">{getErrorMessage(childIndex, "firstName")}</p>
                      )}
                    </div>
                    <div className="relative">
                      <CustomInput
                        label="Nom"
                        labelClassName="w-40 font-medium"
                        placeholder="Entrez le nom"
                        value={child.identity.lastName}
                        onChange={(value: string) => handleChange(childIndex, "identity.lastName", value)}
                        disabled={editingIndex !== childIndex}
                      />
                      {getErrorMessage(childIndex, "lastName") && (
                        <p className="text-red-600 text-sm mt-1">{getErrorMessage(childIndex, "lastName")}</p>
                      )}
                    </div>
                    <div className="relative">
                      <CustomInput
                        type="select"
                        label="Genre"
                        labelClassName="w-30"
                        placeholder="Sélectionnez un genre"
                        value={child.identity.gender}
                        selectOptions={genderOptions}
                        onChange={(value: string) => handleChange(childIndex, "identity.gender", value)}
                        disabled={editingIndex !== childIndex}
                      />
                      {getErrorMessage(childIndex, "gender") && (
                        <p className="text-red-600 text-sm mt-1">{getErrorMessage(childIndex, "gender")}</p>
                      )}
                    </div>
                    <div className="relative">
                      <CustomInput
                        label="Nationalité"
                        labelClassName="w-40 font-medium"
                        placeholder="Entrez la nationalité"
                        value={child.identity.nationality}
                        onChange={(value: string) => handleChange(childIndex, "identity.nationality", value)}
                        disabled={editingIndex !== childIndex}
                      />
                      {getErrorMessage(childIndex, "nationality") && (
                        <p className="text-red-600 text-sm mt-1">{getErrorMessage(childIndex, "nationality")}</p>
                      )}
                    </div>
                    <div className="relative">
                      <CustomInput
                        label="Lieu de naissance"
                        labelClassName="w-40 font-medium"
                        placeholder="Entrez le lieu de naissance"
                        value={child.identity.birthPlace}
                        onChange={(value: string) => handleChange(childIndex, "identity.birthPlace", value)}
                        disabled={editingIndex !== childIndex}
                      />
                      {getErrorMessage(childIndex, "birthPlace") && (
                        <p className="text-red-600 text-sm mt-1">{getErrorMessage(childIndex, "birthPlace")}</p>
                      )}
                    </div>
                    <div className="relative">
                      <CustomInput
                        type="date"
                        label="Date de naissance"
                        labelClassName="w-40 font-medium"
                        placeholder="Sélectionnez une date"
                        value={child.identity.birthDate}
                        onChange={(value: string) => handleChange(childIndex, "identity.birthDate", value)}
                        datePickerOnChange={(date: Date | undefined) =>
                          handleChange(
                            childIndex,
                            "identity.birthDate",
                            date ? date.toISOString().split("T")[0] : ""
                          )
                        }
                        disabled={editingIndex !== childIndex}
                      />
                      {getErrorMessage(childIndex, "birthDate") && (
                        <p className="text-red-600 text-sm mt-1">{getErrorMessage(childIndex, "birthDate")}</p>
                      )}
                    </div>
                    <div className="relative">
                      <CustomInput
                        type="checkbox"
                        label="À charge"
                        labelClassName="w-40 font-medium"
                        value={child.isDependent ? "true" : "false"}
                        onChange={(value: string) => handleChange(childIndex, "isDependent", value === "true")}
                        disabled={editingIndex !== childIndex}
                      />
                      {getErrorMessage(childIndex, "isDependent") && (
                        <p className="text-red-600 text-sm mt-1">{getErrorMessage(childIndex, "isDependent")}</p>
                      )}
                    </div>
                  </div>
                  <div className="md:col-span-2 mt-10">
                    {child.id ? (
                      <EducationInfo id={child.id} formData={child.educations || []} isChildren={true} />
                    ) : (
                      <p className="text-sm text-gray-500">
                        Veuillez enregistrer l'enfant avant d'ajouter des informations sur l'éducation.
                      </p>
                    )}
                  </div>
                  {editingIndex === childIndex && (
                    <div className="flex justify-end mt-4">
                      <div className="flex items-center gap-2">
                        <button
                          className="text-sm text-red-600 hover:underline flex items-center gap-1"
                          onClick={() => handleCancel(childIndex)}
                          disabled={isPending}
                        >
                          <X size={16} />
                        </button>
                        <button
                          className="flex items-center gap-1 text-sm hover:underline"
                          onClick={() => handleSave(childIndex)}
                          disabled={isPending}
                        >
                          {isPending ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : (
                            <Check size={16} />
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <Skeleton className="h-10 w-full" key={i} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ChildInfo;