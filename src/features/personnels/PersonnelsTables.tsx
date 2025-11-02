"use client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getRemoteComponent } from "@/services/get-remote-component";
import { TableColumn } from "@/helpers/types/TableColumn";
import { getEmployes } from "@/services/employe";
import { Employe } from "@/models/employe.dto";
import { useRouter } from "next/navigation";
import { PaginatedResult } from "@/models/PaginatedResult";

type PersonnelsTablesProps = {
  employes: PaginatedResult<Employe>;
};

type FlattenedEmploye = {
  id: number;
  nom: string;
  email: string;
  telephone: string;
};

const PersonnelsTables = ({ employes }: PersonnelsTablesProps) => {
  const Router = useRouter();
  const { AppTable } = getRemoteComponent();

  const flattenedData: FlattenedEmploye[] = employes.data.map((employe) => ({
    id: Number(employe.id),
    nom: `${employe.identity.firstName} ${employe.identity.lastName}`,
    email: employe.contact.email?.[0],
    telephone: employe.contact.phoneNumber?.[0],
  }));

  const columns: TableColumn<FlattenedEmploye>[] = [
    { key: "nom", header: "Nom" },
    { key: "email", header: "Email" },
    { key: "telephone", header: "Téléphone" },
  ];

  const paginatedData = flattenedData;

  const TableSkeleton = () => (
    <div className="mt-4 shadow-md rounded-lg overflow-hidden">
      <div className="grid grid-cols-3 gap-4 p-4 bg-gray-100">
        {columns.map((_, index) => (
          <div key={index} className="h-6 bg-gray-200 animate-pulse rounded" />
        ))}
      </div>
      {Array.from({ length: 10 }).map((_, rowIndex) => (
        <div key={rowIndex} className="grid grid-cols-3 gap-4 p-4 border-t">
          {columns.map((_, colIndex) => (
            <div key={colIndex} className="h-6 bg-gray-200 animate-pulse rounded" />
          ))}
        </div>
      ))}
    </div>
  );

  if (employes.meta.total === 0) {
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
          onRowClick={(item: FlattenedEmploye) => Router.push(`/personnels/${item.id}`)}
        />
      ) : (
        <TableSkeleton />
      )}
    </div>
  );
};

export default PersonnelsTables;