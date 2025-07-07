"use client";

import { useMemo } from "react";
import { remoteComponent } from "@/helpers/remote-components";
import { TableColumn } from "@/helpers/types/TableColumn";
import allData from "@/helpers/data/personnels.json";
import { User } from "@/helpers/types/User";

const PAGE_SIZE = 10;

type Props = {
  currentPage: number;
};

const PersonnelsTables = ({ currentPage }: Props) => {
  const { AppTable } = remoteComponent();

  const totalItems = allData?.data?.data?.length || 0;

  const columns: TableColumn<User>[] = [
    { key: "Nom", header: "Nom" },
    { key: "Poste", header: "Poste" },
    { key: "Département", header: "Département" },
    { key: "Email", header: "Email" },
    { key: "Téléphone", header: "Téléphone" },
  ];

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    return allData.data.data.slice(startIndex, startIndex + PAGE_SIZE);
  }, [currentPage]);

  // Skeleton component for table
  const TableSkeleton = () => (
    <div className="mt-4 shadow-md rounded-lg overflow-hidden">
      {/* Header Skeleton */}
      <div className="grid grid-cols-5 gap-4 p-4 bg-gray-100">
        {columns.map((_, index) => (
          <div key={index} className="h-6 bg-gray-200 animate-pulse rounded" />
        ))}
      </div>
      {/* Rows Skeleton */}
      {Array.from({ length: PAGE_SIZE }).map((_, rowIndex) => (
        <div key={rowIndex} className="grid grid-cols-5 gap-4 p-4 border-t">
          {columns.map((_, colIndex) => (
            <div key={colIndex} className="h-6 bg-gray-200 animate-pulse rounded" />
          ))}
        </div>
      ))}
    </div>
  );

  if (totalItems === 0) {
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
          fixedHeader={true} // Enable fixed header
        />
      ) : (
        <TableSkeleton />
      )}
    </div>
  );
};

export default PersonnelsTables;