"use client";
import { GetRemoteComponent } from "@/services/get-remote-component";
import Skeleton from "@/components/skeleton";
import { Departement } from "@/models/Departement";
import { useSuspenseQuery } from "@tanstack/react-query";
import { PaginatedResult } from "@/models/PaginatedResult";
import { getDepartementsList } from "@/services/Departement";

interface DepartmentSelectInputProps {
  value: string;
  onChange: (value: string) => void;
}

export default function DepartmentSelectInput({
  value,
  onChange,
}: DepartmentSelectInputProps) {
    const { data: departments } = useSuspenseQuery<PaginatedResult<Departement>>({
    queryKey: ["AllDepartments"],
    queryFn: () => getDepartementsList(),
  });
  
  const { CustomInput } = GetRemoteComponent();
  const options = departments.data.map((dept) => ({
      label: `${dept.departmentName} (${dept.departmentCode})`,
      value: dept.id,
    }))

  return CustomInput ? (
    <CustomInput
      type="select"
      label="Département parent"
      labelClassName="w-40"
      value={value}
      onChange={(val: string) => onChange(val)}
      selectOptions={options}
    />
  ) : (
    <Skeleton className="h-10 w-full" />
  );
}
