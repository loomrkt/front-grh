"use client"
import Skeleton from "@/components/skeleton";
import { Separator } from "@/components/ui/separator";
import FormPoste from "@/features/postes/FormPoste";
import PosteTables from "@/features/postes/PosteTables";
import { remoteComponent } from "@/helpers/remote-components";
import { getPostes } from "@/services/poste";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";

export default function Page() {
    const { SearchInput, CustomButton, PaginationControls } = remoteComponent();
    const [currentPage, setCurrentPage] = useState(1);
    const { data: Postes } = useSuspenseQuery({
        queryKey: ["Postes"],
        queryFn: getPostes,
    });
    
    return (
        <div className="relative max-w-7xl mx-auto">
            <FormPoste />
            <Separator className="my-10" />
            <div className="h-[80vh] flex flex-col">
                <div className="flex items-center justify-end w-full mb-4">
                    {SearchInput ? (
                    <div className="w-[250px]">
                        <SearchInput />
                    </div>
                    ) : (
                    <Skeleton className="h-10 w-[250px]" />
                    )}
                </div>
                <div className="overflow-y-auto mt-4 not-md:w-[80vw]">
                    <PosteTables Postes={Postes} />
                </div>
                {PaginationControls ? (
                    <div className="mt-4 flex items-center justify-between w-full">
                        <div className="text-sm text-gray-600">
                            Liste de {(Postes.meta.page - 1) * Postes.meta.limit + 1} à{' '}
                            {Math.min(Postes.meta.page * Postes.meta.limit, Postes.meta.total)} sur {Postes.meta.total}
                        </div>

                        <div>
                            <PaginationControls
                            currentPage={currentPage}
                            totalPages={Postes.meta.total}
                            onPageChange={setCurrentPage}
                            />
                        </div>
                    </div>
                ) : (
                    <div className="mt-4 flex items-center justify-between w-full">
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-10 w-64" />
                    </div>
                )}
            </div>
        </div>
    );
}