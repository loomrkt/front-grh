import { Contrat } from "@/models/employe.dto";
import axios from "axios";

const BASE_URL = `${process.env.NEXT_PUBLIC_BACKEND_API}/Contrat`;

export const createContrat = async (id: string, contrat: Contrat) => {
  const response = await axios.post(
    `${BASE_URL}/${id}`,
    {
      typeContrat: contrat.typeContrat,
      startDate: contrat.startDate,
      endDate: contrat.endDate,
      salaryMensual: contrat.salaryMensual,
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

export const updateContrat = async (contratId: string, contrat: Contrat) => {
  const response = await axios.put(
    `${BASE_URL}/${contratId}`,
    {
      typeContrat: contrat.typeContrat,
      startDate: contrat.startDate,
      endDate: contrat.endDate,
      salaryMensual: contrat.salaryMensual,
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

export const deleteContrat = async (contratId: string) => {
  const response = await axios.delete(`${BASE_URL}/${contratId}`, {
    headers: {
      "Content-Type": "application/json",
      Accept: "text/plain",
    },
  });
  return response.data;
};