"use client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { remoteComponent } from "@/helpers/remote-components";
import { TableColumn } from "@/helpers/types/TableColumn";
import { getEmployes } from "@/services/employe";
import { Employe } from "@/models/employe.dto";
import { useRouter } from "next/navigation";


type PersonnelsTablesProps = {
  currentPage: number;
};

const PersonnelsTables = ({ currentPage }: PersonnelsTablesProps) => {
  const Router = useRouter();
  const { AppTable } = remoteComponent();

  const { data: employes } = useSuspenseQuery({
    queryKey: ["employes"],
    queryFn: getEmployes,
  });

  const columns: TableColumn<Employe>[] = [
    { key: "nom", header: "Nom" },
    { key: "poste", header: "Poste" },
    { key: "departement", header: "Département" },
    { key: "email", header: "Email" },
    { key: "telephone", header: "Téléphone" },
  ];

  const paginatedData = employes.data;

  const TableSkeleton = () => (
    <div className="mt-4 shadow-md rounded-lg overflow-hidden">
      <div className="grid grid-cols-5 gap-4 p-4 bg-gray-100">
        {columns.map((_, index) => (
          <div key={index} className="h-6 bg-gray-200 animate-pulse rounded" />
        ))}
      </div>
      {Array.from({ length: 10 }).map((_, rowIndex) => (
        <div key={rowIndex} className="grid grid-cols-5 gap-4 p-4 border-t">
          {columns.map((_, colIndex) => (
            <div key={colIndex} className="h-6 bg-gray-200 animate-pulse rounded" />
          ))}
        </div>
      ))}
    </div>
  );

  if (!employes || employes.meta.total === 0) {
    return <p className="text-center mt-8">Aucun personnel trouvé.</p>;
  }

  return (
    <div className="mt-4">
      {AppTable ? (
        <AppTable
          columns={columns}
          data={paginatedData}
          className="shadow-md rounded-lg"
          align="leftCenterRight"
          fixedHeader={true}
          onRowClick={(item: Employe) => Router.push(`/personnels/${item.id}`)}
        />
      ) : (
        <TableSkeleton />
      )}
    </div>
  );
};

export default PersonnelsTables;
