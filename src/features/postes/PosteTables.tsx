"use client";
import Skeleton from "@/components/skeleton";
import { remoteComponent } from "@/helpers/remote-components";
import { TableColumn } from "@/helpers/types/TableColumn";
import { Poste, PosteApiResponse } from "@/models/Poste.dto";
import { Edit2, X } from "lucide-react";


type PosteTablesProps = {
  Postes: PosteApiResponse
};

const PosteTables = ({ Postes }: PosteTablesProps) => {
  const { AppTable,CustomButton } = remoteComponent();


  const columns: TableColumn<Poste>[] = [
    { key: "posteCode", header: "Poste code" },
    { key: "posteTitle", header: "Nom du poste" },
    { key: "departementName", header: "Département" },
    { header: "Description", render: (item) => 
        <>
          {
            CustomButton ? (
              <div className="flex items-center justify-end space-x-2">
                <CustomButton>
                  <Edit2 className="h-4 w-4" />
                </CustomButton>
                <CustomButton className="bg-red-500 text-white hover:bg-red-600 cursor-pointer">
                  <X className="h-4 w-4" />
                </CustomButton>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-4" />
              </div>
            )
          }
        </>
     },
  ];

  const paginatedData = Postes.data;

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

  if (!Postes || Postes.meta.total === 0) {
    return <p className="text-center mt-8">Aucun personnel trouvé.</p>;
  }

  return (
    <div className="mt-4 max-w-7xl mx-auto">
      {AppTable ? (
        <AppTable
          columns={columns}
          data={paginatedData}
          className="shadow-md rounded-lg"
          align="leftCenterRight"
          fixedHeader={true}
        />
      ) : (
        <TableSkeleton />
      )}
    </div>
  );
};

export default PosteTables;
