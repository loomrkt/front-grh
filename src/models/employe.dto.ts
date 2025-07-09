export interface Employe {
  id: number;
  nom: string;
  poste: string;
  email: string;
  telephone: string;
  departement: string;
}


export interface EmployeApiResponse {
  success: boolean;
  code: number;
  message: string;
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPage: number;
  };
  data: Employe[]; // Après mapping
}