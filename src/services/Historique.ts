import axios from "axios";
import { PaginatedResult } from "@/models/PaginatedResult";
import { Result } from "@/models/Result";

export interface HistoryEntry {
  id: string;
  entityName: string;
  operation: "CREATE" | "UPDATE" | "DELETE";
  entityId: string;
  timestamp: string;
}

export interface HistoryEntryDetail {
  id: string;
  entityName: string;
  operation: "CREATE" | "UPDATE" | "DELETE";
  entityId: string;
  timestamp: string;
  oldValue: any;
  newValue: any;
}

export interface GetHistoriesParams {
  search?: string;
  name?: string;
  limit?: number;
  page?: number;
  action?: string;
  entityName?: string;
}

const BASE_URL = `${process.env.NEXT_PUBLIC_BACKEND_API}/Historique`;

/**
 * Récupère la liste complète des historiques sans filtre.
 */
export async function getAllHistories(
  params?: GetHistoriesParams
): Promise<PaginatedResult<HistoryEntry>> {
  const res = await axios.get(BASE_URL, {
    params,
  });
  console.log("Fetched all histories:", res.data);
  return res.data;
}

/**
 * Récupère un historique spécifique par son ID.
 */
export async function getHistoryById(id: string): Promise<Result<HistoryEntryDetail>> {
  const res = await axios.get(`${BASE_URL}/${id}`);
  console.log(`Fetched history with ID ${id}:`, res.data);
  return res.data;
}