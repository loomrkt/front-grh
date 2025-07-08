export interface Poste {
  id: number;
  posteCode: string;
  posteTitle: string;
  departementName: string;
}


export interface PosteApiResponse {
  success: boolean;
  code: number;
  message: string;
  meta: {
    total: number;
    page: number;
    limit: number;
  };
  data: Poste[];
}