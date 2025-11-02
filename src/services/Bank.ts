import { Bank } from "@/models/employe.dto";
import axios from "axios";

const BASE_URL = `${process.env.NEXT_PUBLIC_BACKEND_API}/Bank`;

export const createBank = async (id: string, bank: Bank) => {
  const response = await axios.post(
    `${BASE_URL}/${id}`,
    {
      rib: bank.rib,
      iban: bank.iban,
      bic: bank.bic,
      countryCode: bank.countryCode,
      accountLabel: bank.accountLabel,
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

export const updateBank = async (bankId: string, bank: Bank) => {
  const response = await axios.put(
    `${BASE_URL}/${bankId}`,
    {
      rib: bank.rib,
      iban: bank.iban,
      bic: bank.bic,
      countryCode: bank.countryCode,
      accountLabel: bank.accountLabel,
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

export const deleteBank = async (bankId: string) => {
  const response = await axios.delete(`${BASE_URL}/${bankId}`, {
    headers: {
      "Content-Type": "application/json",
      Accept: "text/plain",
    },
  });
  return response.data;
};