import { Result } from '@/models/Result';
import { CreateEmployeDto } from "@/models/CreateEmployeDto";
import { Address, CivilStatus, Employe, Identity } from "@/models/employe.dto";
import { PaginatedResult } from "@/models/PaginatedResult";
import axios from "axios";

const BASE_URL = `${process.env.NEXT_PUBLIC_BACKEND_API}/Employee`;

interface Params {
  page?: number;
  limit?: number;
  search?: string;
}

export async function getEmployes(params?:Params): Promise<PaginatedResult<Employe>> {
  const res = await axios.get(`${BASE_URL}`,
    {
    params,
  }
  );
  return res.data;
}

export async function getEmployeById(id: string): Promise<Result<Employe>> {
  const res = await axios.get<Result<Employe>>(`${BASE_URL}/${id}`);
  return res.data;
};

export const removeEmployeById = async (id: number) => {
  await axios.delete(`${BASE_URL}/${id}`);
};

// Function to create FormData from CreateEmployeDto
const createFormData = (employe: CreateEmployeDto): FormData => {
  const formData = new FormData();
  
  // Append simple fields
  formData.append("FirstName", employe.FirstName);
  formData.append("LastName", employe.LastName);
  formData.append("Civility", employe.Civility || "");
  formData.append("PostId", employe.PostId);
  formData.append("DepartmentId", employe.DepartmentId);
  formData.append("Gender", employe.Gender || "");

  // Append contact fields (arrays)
  employe.Contact.PhoneNumber.forEach((phone, index) => {
    formData.append(`Contact.PhoneNumber[${index}]`, phone);
  });
  employe.Contact.Email.forEach((email, index) => {
    formData.append(`Contact.Email[${index}]`, email);
  });

  // Append avatar file
  if (employe.Avatar.FormFile && employe.Avatar.FormFile.name) {
    formData.append("Avatar.FormFile", employe.Avatar.FormFile);
  }

  return formData;
};

// API function to add employee
export const addEmploye = async (employe: CreateEmployeDto) => {
  const formData = createFormData(employe);
  const res = await axios.post(BASE_URL, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const updateEmploye = async (id: string, employe: Identity) => {
  const res = await axios.put(`${BASE_URL}/${id}`, employe);
  return res.data;
};


export const updateEmployeIdentity = async (id: string, employe: Identity) => {
  const formData = new FormData();

  formData.append("FirstName", employe.firstName || "");
  formData.append("LastName", employe.lastName || "");
  formData.append("Gender", employe.gender || "");
  formData.append("BirthDate", employe.birthDate ? new Date(employe.birthDate).toISOString() : "");
  formData.append("BirthPlace", employe.birthPlace || "");
  formData.append("Nationality", employe.nationality || "");

  console.log("FormData for identity update:", formData);
  const res = await axios.put(`${BASE_URL}/identity/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Accept: "text/plain",
    },
  });

  return res.data;
};

export const updateEmployeAddress = async (id: string, address: Address) => {
  const formData = new FormData();

  // Correspond exactement aux champs du curl (EmployeeAdress.X)
  formData.append("EmployeeAdress.LotNumber", address.lotNumber);
  formData.append("EmployeeAdress.City", address.city);
  formData.append("EmployeeAdress.PostalCode", address.postalCode);
  formData.append("EmployeeAdress.District", address.district);
  formData.append("EmployeeAdress.Municipality", address.municipality);
  formData.append("EmployeeAdress.Region", address.region);
  formData.append("EmployeeAdress.Country", address.country);

  const response = await axios.put(
    `${BASE_URL}/adress/${id}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        Accept: "text/plain",
      },
    }
  );

  return response.data;
};


export const updateProfileImage = async (id: string, file: File) => {
  const formData = new FormData();
  formData.append("Image.FormFile", file);

  const response = await axios.put(`${BASE_URL}/profil/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Accept: "text/plain",
    },
  });

  return response.data;
}


export const updateCivilStatus = async (id: string, civilStatus: CivilStatus) => {
  const formData = new FormData();

  // Helper function to append non-empty values
  const appendIfValid = (key: string, value: string | null | undefined) => {
    if (value !== null && value !== undefined && value !== "") {
      formData.append(key, value);
    }
  };

  // Append all required fields matching the curl command
  appendIfValid("LastName", civilStatus.spouseLastName);
  appendIfValid("FirstName", civilStatus.spouseFirstName);
  appendIfValid("Gender", civilStatus.gender);
  appendIfValid("MaritalStatus", civilStatus.maritalStatus);
  appendIfValid("BirthPlace", civilStatus.birthPlace);
  appendIfValid("Nationality", civilStatus.nationality);

  // Handle birth date
  if (civilStatus.birthDate) {
    try {
      const birthDate = new Date(civilStatus.birthDate);
      if (!isNaN(birthDate.getTime())) {
        formData.append("BirthDate", birthDate.toISOString());
      }
    } catch (error) {
      console.error("Invalid birth date format:", civilStatus.birthDate);
    }
  }

  // Handle phone numbers - join with comma as per curl
  if (civilStatus.phoneNumber?.length) {
    const validPhoneNumbers = civilStatus.phoneNumber.filter(phone => phone?.trim());
    if (validPhoneNumbers.length > 0) {
      formData.append("PhoneNumber", validPhoneNumbers.join(","));
    }
  }

  // Handle email - join with comma as per curl
  if (civilStatus.email?.length) {
    const validEmails = civilStatus.email.filter(email => email?.trim());
    if (validEmails.length > 0) {
      formData.append("Email", validEmails.join(","));
    }
  }

  try {
    const response = await axios.put(
      `${BASE_URL}/CivilStatus/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Accept: "text/plain",
        },
      }
    );
    return response.data;
  } catch (error: any) {
    console.error("Failed to update civil status:", error.message);
    throw new Error(`Failed to update civil status: ${error.response?.data?.message || error.message}`);
  }
};