import { Poste, PosteApiResponse } from "@/models/Poste.dto";
import axios from "axios";

const BASE_URL = "http://localhost:3000/poste";

export async function getPostes(): Promise<PosteApiResponse> {
  const res = await axios.get(BASE_URL);

  const apiData = res.data;

  const mappedPostes: Poste[] = apiData.data.map((item: any): Poste => ({
    id: item.id,
    posteCode: item.posteCode,
    posteTitle: item.posteTitle,
    departementName: item.departementName,
  }));

  return {
    success: apiData.success,
    code: apiData.code,
    message: apiData.message,
    meta: apiData.meta,
    data: mappedPostes,
  };
}

export const getPosteById = async (id: string): Promise<Poste> => {
  const res = await axios.get<Poste>(`${BASE_URL}/${id}`);
  return res.data;
};

export const removePosteById = async (id: number) => {
  await axios.delete(`${BASE_URL}/${id}`);
};

export const addPoste = async (poste: Poste) => {
  const res = await axios.post(BASE_URL, poste);
  return res.data;
};

export const updatePoste = async (id: number, poste: Poste) => {
  const res = await axios.put(`${BASE_URL}/${id}`, poste);
  return res.data;
};
