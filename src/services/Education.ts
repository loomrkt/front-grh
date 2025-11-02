import { Education } from "@/models/employe.dto";
import axios from "axios";

const BASE_URL = `${process.env.NEXT_PUBLIC_BACKEND_API}/Educations`;

export const createEducation = async (id: string, education: Education, isChild: boolean = false) => {
  const formData = new FormData();
  formData.append('Etablissement', education.etablissement);
  formData.append('Graduation', education.graduation);
  formData.append('FieldOfStudy', education.fieldOfStudy);
  formData.append('ObtentionYear', education.graduationYear.toString());

  const endpoint = isChild ? `${BASE_URL}/child/${id}` : `${BASE_URL}/${id}`;

  const response = await axios.post(
    endpoint,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
        Accept: 'text/plain',
      },
    }
  );
  return response.data;
};

export const updateEducationEmploye = async (educationId: string, employeeId: string, education: Education) => {
  const response = await axios.put(
    `${BASE_URL}/${educationId}/${employeeId}`,
    {
      etablissement: education.etablissement,
      graduation: education.graduation,
      fieldOfStudy: education.fieldOfStudy,
      graduationYear: Number(education.graduationYear),
    },
    {
      headers: {
        "Content-Type": "application/json",
        Accept: "text/plain",
      },
    }
  );
  return response.data;
};

export const deleteEducation = async (educationId: string) => {
  const response = await axios.delete(`${BASE_URL}/${educationId}`, {
    headers: {
      "Content-Type": "application/json",
      Accept: "text/plain",
      },
    }
  );
  return response.data;
};