import { Departement, DepartementApiResponse } from "@/models/Departement.dto";
import axios from "axios";

const BASE_URL = "http://localhost:3000/departement";

// Fonction pour récupérer la liste plate des départements
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

// ✅ Nouvelle fonction pour récupérer les départements sous forme hiérarchique
export async function getDepartementHierarchie(): Promise<DepartementApiResponse> {
  const res = await axios.get(`${BASE_URL}/hierarchie`);
  const apiData = res.data;

  const mapHierarchy = (item: any): Departement => ({
    id: item.id,
    DepartmentCode: item.departmentCode,
    DepartmentName: item.departmentName,
    ParentDepartment: item.parentDepartment,
    DepartmentsFils: item.departmentsFils?.map(mapHierarchy) || [],
  });

  const mappedHierarchie: Departement[] = apiData.data.map(mapHierarchy);

  return {
    success: apiData.success,
    code: apiData.code,
    message: apiData.message,
    meta: apiData.meta,
    data: mappedHierarchie,
  };
}

// Récupérer un département par ID
export const getDepartementById = async (id: number): Promise<Departement> => {
  const res = await axios.get(`${BASE_URL}/${id}`);
  return res.data;
};

// Supprimer un département par ID
export const removeDepartementById = async (id: number) => {
  await axios.delete(`${BASE_URL}/${id}`);
};

// Ajouter un nouveau département
export const addDepartement = async (departement: Departement) => {
  const res = await axios.post(BASE_URL, departement);
  return res.data;
};

// Mettre à jour un département existant
export const updateDepartement = async (id: number, departement: Departement) => {
  const res = await axios.put(`${BASE_URL}/${id}`, departement);
  return res.data;
};
