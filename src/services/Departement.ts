import { CreateDepartmentDto } from "@/models/CreateDepartmentDto";
import { Departement } from "@/models/Departement";
import { DepartementDto } from "@/models/DepartementDto";
import { PaginatedResult } from "@/models/PaginatedResult";
import { Result } from "@/models/Result";
import { UpdateDepartmentDto } from "@/models/UpdateDepartmentDto";
import axios from "axios";

const BASE_URL = `${process.env.NEXT_PUBLIC_BACKEND_API}/Department`;


interface GetDepartmentsParams {
  page?: number;
  limit?: number;
  search?: string;
}

export async function getDepartements(params?: GetDepartmentsParams): Promise<PaginatedResult<Departement>> {
  const res = await axios.get(BASE_URL, {
    params,
  });
  return res.data;
}

export async function getDepartementsList(): Promise<PaginatedResult<Departement>> {
  const res = await axios.get(BASE_URL);
  return res.data;
}


// ✅ Nouvelle fonction pour récupérer les départements sous forme hiérarchique
export async function getDepartementHierarchie(
  id?: string | null,
  depth?: number | null
): Promise<Result<Departement>> {
  const params: Record<string, string | number | null> = { Depth: depth ?? null };

  if (id) {
    params.id = id;
  }

  const res = await axios.get(`${BASE_URL}/hierarchy`, { params });
  return res.data;
}

// Récupérer un département par ID
export const getDepartementById = async (id: string): Promise<Result<DepartementDto>> => {
  const res = await axios.get(`${BASE_URL}/${id}`);
  return res.data;
};

// Supprimer un département par ID
export const removeDepartementById = async (id: string) => {
  await axios.delete(`${BASE_URL}/${id}`);
};

// Ajouter un nouveau département
export const addDepartement = async (departement: CreateDepartmentDto) => {
  const payload = {
    ...departement,
    parentDepartmentId: departement.parentDepartmentId === "" ? null : departement.parentDepartmentId,
  };
  const res = await axios.post(BASE_URL, payload);
  return res.data;
};

// Mettre à jour un département existant
export const updateDepartement = async (id: string, departement: UpdateDepartmentDto) => {
  const payload = {
    departmentCode: departement.departmentCode || null,
    departmentName: departement.departmentName || null,
    parentDepartmentId: departement.parentDepartmentId === "" ? null : departement.parentDepartmentId,
  };
  const res = await axios.put(`${BASE_URL}/${id}`, payload);
  return res.data;
};
