export interface Departement {
  id: string;
  departmentCode: string;
  departmentName: string;
  parentDepartment: string;
  departmentsFils?: Departement[];
}