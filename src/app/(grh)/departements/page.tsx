"use client";
import { useState } from "react";
import Skeleton from "@/components/skeleton";
import { Separator } from "@/components/ui/separator";
import DepartementListe from "@/features/departements/DepartementListe";
import FormDepartement from "@/features/departements/FormDepartement";
import Tree from "@/features/departements/Tree";
import { remoteComponent } from "@/helpers/remote-components";

export default function Page() {
  const { CustomTabs } = remoteComponent();
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string | undefined>(undefined);

  const handleEditDepartment = (id: string) => {
    setSelectedDepartmentId(id);
  };

  const handleCancel = () => {
    setSelectedDepartmentId(undefined);
  };

  return (
    <div className="relative max-w-7xl mx-auto">
      <FormDepartement departmentId={selectedDepartmentId} onCancel={handleCancel} />
      <Separator className="my-10" />
      {CustomTabs ? (
        <CustomTabs
          tabsHeaders={["Liste", "Arbre"]}
          tabsContents={[<DepartementListe onEdit={handleEditDepartment} />, <Tree />]}
        />
      ) : (
        <Skeleton className="h-10 w-full" />
      )}
    </div>
  );
}