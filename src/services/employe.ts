import { Employe, EmployeApiResponse } from "@/models/employe.dto";
import axios from "axios";

const BASE_URL = "http://localhost:3000/employe";

export async function getEmployes(): Promise<EmployeApiResponse> {
  const res = await axios.get(BASE_URL);

  const apiData = res.data;

  const mappedEmployes: Employe[] = apiData.data.map((item: any): Employe => ({
    id: item.id,
    nom: item.Nom,
    poste: item.Poste,
    departement: item["Département"],
    email: item.Email,
    telephone: item["Téléphone"],
  }));

  return {
    success: apiData.success,
    code: apiData.code,
    message: apiData.message,
    meta: apiData.meta,
    data: mappedEmployes,
  };
}

export const getEmployeById = async (id: string): Promise<Employe> => {
  const res = await axios.get<Employe>(`${BASE_URL}/${id}`);
  return res.data;
};

export const removeEmployeById = async (id: number) => {
  await axios.delete(`${BASE_URL}/${id}`);
};

export const addEmploye = async (employe: Employe) => {
  const res = await axios.post(BASE_URL, employe);
  return res.data;
};

export const updateEmploye = async (id: number, employe: Employe) => {
  const res = await axios.put(`${BASE_URL}/${id}`, employe);
  return res.data;
};
