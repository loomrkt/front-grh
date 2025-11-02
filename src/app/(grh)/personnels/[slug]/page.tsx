"use client";
import BankInfo from "@/features/personnels/viewUpdate/BankInfo";
import AddressInfo from "@/features/personnels/viewUpdate/AddressInfo";
import IdentityInfo from "@/features/personnels/viewUpdate/IdentityInfo";
import Info from "@/features/personnels/viewUpdate/info";
import { Employe } from "@/models/employe.dto";
import { Result } from "@/models/Result";
import { getEmployeById } from "@/services/employe";
import { useSuspenseQuery } from "@tanstack/react-query";
import React from "react";
import EducationInfo from "@/features/personnels/viewUpdate/EducationInfo";
import ContratInfo from "@/features/personnels/viewUpdate/ContratInfo";
import ChildInfo from "@/features/personnels/viewUpdate/ChildInfo";
import CivilStatusInfo from "@/features/personnels/viewUpdate/CivilStatusInfo";

interface BlogParams {
  params: Promise<{
    slug: string;
  }>;
}

export default function PersonnelsDetails({ params }: BlogParams) {
  const resolvedParams = React.use(params);
  const { data: employe } = useSuspenseQuery<Result<Employe>>({
    queryKey: ["Employe", resolvedParams.slug],
    queryFn: () => getEmployeById(resolvedParams.slug),
  });
  console.log("employe", employe);
  if (!employe) {
    return <h1>Loading...</h1>;
  }
  return (
    <div className="flex lg:h-full overflow-scroll not-lg:flex-col">
      <Info employe={employe} />
      <div className="flex-1 px-10 h-full overflow-scroll"
      style={{
    overflow: "auto",
    scrollbarWidth: "thin", // Firefox
    scrollbarColor: "#888 #f1f1f1", // Firefox
    height: "100%", // exemple
  }}
      >
        {/* CSS Columns avec break-inside pour contrôler les coupures */}
        <div className="columns-1 md:columns-2 gap-8 h-max">
          
          {/* Identity - Ne se coupe pas entre les colonnes */}
          <div className="break-inside-avoid mb-8">
            <IdentityInfo id={resolvedParams.slug} formData={employe.data.identity} />
          </div>
          
          {/* Civil Status - Ne se coupe pas entre les colonnes */}
          <div className="break-inside-avoid mb-8">
            <CivilStatusInfo id={resolvedParams.slug} formData={employe.data.civilStatus} />
          </div>
          
          {/* Address - Ne se coupe pas entre les colonnes */}
          <div className="break-inside-avoid mb-8">
            <AddressInfo id={resolvedParams.slug} formData={employe.data.adress} />
          </div>
          
          {/* Bank - Ne se coupe pas entre les colonnes */}
          <div className="break-inside-avoid mb-8">
              <BankInfo id={resolvedParams.slug} formData={employe.data.banques} />
          </div>

          {/* Education - Ne se coupe pas entre les colonnes */}
          <div className="break-inside-avoid mb-8">
            <EducationInfo id={resolvedParams.slug} formData={employe.data.educations} />
          </div>
          
          {/* Contact - Ne se coupe pas entre les colonnes */}
          <div className="break-inside-avoid mb-8">
            <ContratInfo id={resolvedParams.slug} formData={employe.data.contrats} />
          </div>

          {/* Children - Ne se coupe pas entre les colonnes */}
          <div className="break-inside-avoid mb-8">
            <ChildInfo id={resolvedParams.slug} formData={employe.data.children} />
          </div>
        </div>
      </div>
    </div>
  );
}