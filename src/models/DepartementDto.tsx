export interface DepartementDto {
    departmentCode: string;
    departmentName: string;
    parentDepartmentId?: string | null;
}