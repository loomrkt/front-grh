export interface Departement {
  id: string;
  DepartmentCode: string;
  DepartmentName: string;
  ParentDepartment: string;
  DepartmentsFils?: Departement[];
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