export interface CreateDepartmentDto {
  departmentCode: string;
  departmentName: string;
  parentDepartmentId: string | null;
}