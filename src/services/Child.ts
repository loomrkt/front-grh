// src/services/Child.ts
import axios from "axios";
import { Child, Education } from "@/models/employe.dto";

const API_BASE_URL = "https://localhost:5443/api";

// Helper function to create FormData for child
const createChildFormData = (child: Child): FormData => {
  const formData = new FormData();
  formData.append("Identity.FirstName", child.identity.firstName || "");
  formData.append("Identity.LastName", child.identity.lastName || "");
  formData.append("Identity.BirthDate", child.identity.birthDate || "");
  formData.append("Identity.BirthPlace", child.identity.birthPlace || "");
  formData.append("Identity.Gender", child.identity.gender || "");
  formData.append("Identity.Nationality", child.identity.nationality || "");
  formData.append("isDependent", String(child.isDependent));
  if (child.file?.formFile) {
    formData.append("File.FormFile", child.file.formFile);
  }
  return formData;
};

// Helper function to create FormData for education
const createEducationFormData = (education: Education): FormData => {
  const formData = new FormData();
  formData.append("Etablissement", education.etablissement || "");
  formData.append("Graduation", education.graduation || "");
  formData.append("FieldOfStudy", education.fieldOfStudy || "");
  formData.append("GraduationYear", education.graduationYear ? new Date(education.graduationYear).getFullYear().toString() : "0");
  return formData;
};

// Create a child
export const createChild = async (employeeId: string, child: Child): Promise<{ id: string }> => {
  const formData = createChildFormData(child);
  const response = await axios.post<{ id: string }>(
    `${API_BASE_URL}/Child/${employeeId}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        accept: "text/plain",
      },
    }
  );
  return response.data;
};

// Update a child
export const updateChild = async (childId: string, child: Child): Promise<void> => {
  const formData = createChildFormData(child);
  await axios.put(
    `${API_BASE_URL}/Child/${childId}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        accept: "text/plain",
      },
    }
  );
};

// Delete a child
export const deleteChild = async (childId: string): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/Child/${childId}`, {
    headers: {
      accept: "text/plain",
    },
  });
};

// Create an education for a child
export const createEducation = async (childId: string, education: Education): Promise<{ id: string }> => {
  const formData = createEducationFormData(education);
  const response = await axios.post<{ id: string }>(
    `${API_BASE_URL}/Educations/Child/${childId}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        accept: "text/plain",
      },
    }
  );
  return response.data;
};

// Update an education for a child
export const updateEducation = async (childId: string, educationId: string, education: Education): Promise<void> => {
  const formData = createEducationFormData(education);
  await axios.put(
    `${API_BASE_URL}/Educations/Child/${childId}/${educationId}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        accept: "text/plain",
      },
    }
  );
};

// Delete an education for a child
export const deleteEducation = async (childId: string, educationId: string): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/Educations/Child/${childId}/${educationId}`, {
    headers: {
      accept: "text/plain",
    },
  });
};