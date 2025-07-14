"use client";
import { remoteComponent } from "@/helpers/remote-components";
import Skeleton from "@/components/skeleton";
import { Departement } from "@/models/Departement.dto";

interface DepartmentSelectInputProps {
  value: string;
  onChange: (value: string) => void;
  departments: Departement[];
}

export default function DepartmentSelectInput({
  value,
  onChange,
  departments,
}: DepartmentSelectInputProps) {
  const { CustomInput } = remoteComponent();
  const options = departments.map((dept) => ({
      label: `${dept.departmentName} (${dept.departmentCode})`,
      value: dept.id,
    }))

  return CustomInput ? (
    <CustomInput
      type="select"
      label="Département parent"
      labelClassName="w-40"
      value={value || "root"}
      onChange={(val: string) => onChange(val === "root" ? "" : val)}
      placeholder="Select (Root)"
      selectOptions={options}
    />
  ) : (
    <Skeleton className="h-10 w-full" />
  );
}
