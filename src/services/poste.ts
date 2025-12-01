import { Departement } from '@/models/Departement';
import { CreatePosteDto } from "@/models/CreatePosteDto";
import { PaginatedResult } from "@/models/PaginatedResult";
import { Poste } from "@/models/Poste";
import { PosteDto } from "@/models/PosteDto";
import { Result } from "@/models/Result";
import { UpdatePosteDto } from "@/models/UpdatePosteDto";
import axios from "axios";

const BASE_URL = `${process.env.NEXT_PUBLIC_BACKEND_API}/Poste`;

interface GetDepartmentsParams {
  page?: number;
  limit?: number;
  search?: string;
  departmentId?: string;
}

export async function getPostes(params?:GetDepartmentsParams): Promise<PaginatedResult<Poste>> {
  const res = await axios.get(BASE_URL,{
    params,
  });
  return res.data;
}

export async function getPostesList(): Promise<PaginatedResult<Poste>> {
  const res = await axios.get(BASE_URL);
  return res.data;
}

export const getPosteById = async (id: string): Promise<Result<PosteDto>> => {
  const res = await axios.get(`${BASE_URL}/${id}`);
  return res.data;
};

export const removePosteById = async (id: string) => {
  await axios.delete(`${BASE_URL}/${id}`);
};

export const addPoste = async (poste: CreatePosteDto) => {
  const payload = {
    ...poste,
    departmentId: poste.departementId || null
  };
  const res = await axios.post(BASE_URL, payload);
  return res.data;
};

export const updatePoste = async (id: string, poste: UpdatePosteDto) => {
  const payload = {
    posteCode: poste.posteCode || null,
    posteTitle: poste.posteTitle || null,
    departmentId: poste.departementId || null
  };
  const res = await axios.put(`${BASE_URL}/${id}`, payload);
  return res.data;
};
