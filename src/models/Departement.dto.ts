export interface Departement {
  id: number;
  DepartmentCode: string;
  DepartmentName: string;
  ParentDepartment: string;
}


export interface DepartementApiResponse {
  success: boolean;
  code: number;
  message: string;
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPage: number;
  };
  data: Departement[];
}