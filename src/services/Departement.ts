import { Departement, DepartementApiResponse } from "@/models/Departement.dto";
import axios from "axios";

const BASE_URL = "http://localhost:3000/departement";

export async function getDepartements(): Promise<DepartementApiResponse> {
  const res = await axios.get(BASE_URL);

  const apiData = res.data;

  const mappedDepartements: Departement[] = apiData.data.map((item: any): Departement => ({
    id: item.id,
    DepartmentCode: item.departmentCode,
    DepartmentName: item.departmentName,
    ParentDepartment: item.parentDepartment,
  }));

  return {
    success: apiData.success,
    code: apiData.code,
    message: apiData.message,
    meta: apiData.meta,
    data: mappedDepartements,
  };
}

export const getDepartementById = async (id: number): Promise<Departement> => {
  const res = await axios.get(`${BASE_URL}/${id}`);
  return res.data;
};

export const removeDepartementById = async (id: number) => {
  await axios.delete(`${BASE_URL}/${id}`);
};

export const addDepartement = async (departement: Departement) => {
  const res = await axios.post(BASE_URL, departement);
  return res.data;
};

export const updateDepartement = async (id: number, departement: Departement) => {
  const res = await axios.put(`${BASE_URL}/${id}`, departement);
  return res.data;
};
