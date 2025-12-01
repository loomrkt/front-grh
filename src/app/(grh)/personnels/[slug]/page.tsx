"use client";
import BankInfo from "@/features/personnels/viewUpdate/BankInfo";
import AddressInfo from "@/features/personnels/viewUpdate/AddressInfo";
import IdentityInfo from "@/features/personnels/viewUpdate/IdentityInfo";
import Info from "@/features/personnels/viewUpdate/info";
import { Employe } from "@/models/employe.dto";
import { Result } from "@/models/Result";
import { getEmployeById, removeEmployeById } from "@/services/employe";
import { useSuspenseQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import EducationInfo from "@/features/personnels/viewUpdate/EducationInfo";
import ContratInfo from "@/features/personnels/viewUpdate/ContratInfo";
import ChildInfo from "@/features/personnels/viewUpdate/ChildInfo";
import CivilStatusInfo from "@/features/personnels/viewUpdate/CivilStatusInfo";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "react-toastify";
interface BlogParams {
  params: Promise<{
    slug: string;
  }>;
}

export default function PersonnelsDetails({ params }: BlogParams) {
  const resolvedParams = React.use(params);
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: employe } = useSuspenseQuery<Result<Employe>>({
    queryKey: ["Employe", resolvedParams.slug],
    queryFn: () => getEmployeById(resolvedParams.slug),
  });

  const deleteMutation = useMutation({
    mutationFn: () => removeEmployeById(resolvedParams.slug),
    onSuccess: () => {
      toast.success("L'employé a été supprimé avec succès.");
      queryClient.invalidateQueries({ queryKey: ["employes"] });
      router.push("/personnels");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Une erreur est survenue lors de la suppression.");
    },
  });

  if (!employe) {
    return <h1>Loading...</h1>;
  }

  return (
    <div className="flex lg:h-full overflow-scroll not-lg:flex-col">
      <Info employe={employe} />
      <div
        className="flex-1 px-10 h-full overflow-scroll"
        style={{
          overflow: "auto",
          scrollbarWidth: "thin",
          scrollbarColor: "#888 #f1f1f1",
          height: "100%",
        }}
      >
        <div className="columns-1 md:columns-2 gap-8 h-max">
          <div className="break-inside-avoid mb-8">
            <IdentityInfo id={resolvedParams.slug} formData={employe.data.identity} />
          </div>

          <div className="break-inside-avoid mb-8">
            <CivilStatusInfo id={resolvedParams.slug} formData={employe.data.civilStatus} />
          </div>

          <div className="break-inside-avoid mb-8">
            <AddressInfo id={resolvedParams.slug} formData={employe.data.adress} />
          </div>

          <div className="break-inside-avoid mb-8">
            <BankInfo id={resolvedParams.slug} formData={employe.data.banques} />
          </div>

          <div className="break-inside-avoid mb-8">
            <EducationInfo id={resolvedParams.slug} formData={employe.data.educations} />
          </div>

          <div className="break-inside-avoid mb-8">
            <ContratInfo id={resolvedParams.slug} formData={employe.data.contrats} />
          </div>

          <div className="break-inside-avoid mb-8">
            <ChildInfo id={resolvedParams.slug} formData={employe.data.children} />
          </div>
        </div>

        {/* Bouton de suppression */}
        <div className="mt-8 mb-8 flex justify-end">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" disabled={deleteMutation.isPending}>
                <Trash2 className="mr-2 h-4 w-4" />
                {deleteMutation.isPending ? "Suppression..." : "Supprimer l'employé"}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                <AlertDialogDescription>
                  Cette action est irréversible. Cela supprimera définitivement l'employé et
                  toutes ses données associées.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => deleteMutation.mutate()}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90 text-white"
                >
                  Confirmer la suppression
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}