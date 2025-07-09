"use client";
import Skeleton from "@/components/skeleton";
import { remoteComponent } from "@/helpers/remote-components";
import Image from "next/image";

const FormDepartement = () => {
    const { CustomInput } = remoteComponent();
    const { CustomButton } = remoteComponent();
    return ( 
    <form className="w-full p-6 bg-[#F4F4FC] rounded-2xl max-w-7xl mx-auto flex not-md:flex-col gap-4 md:flex-row items-center justify-between">
        <div className="not-md:w-full md:w-[45%] flex flex-col justify-center items-center">
            <div>
                <p className="uppercase font-light self-start">Ajouter un Departement</p>
                <Image
                    src="/Departement.png"
                    alt="Departement Icon"
                    width={1000}
                    height={600}
                    className="h-auto w-66 mt-10"
                />
            </div>
        </div>
        <div className="flex-1 flex flex-col md:flex-row gap-4 bg-white rounded-lg p-6 h-full">
            <h1 className="text-2xl font-semibold mb-4 text-center">Céer votre Departement</h1>
            {
                CustomInput ?
                (
                    <>
                        <CustomInput 
                            label="Departement code"
                            placeholder="Entrez le Departement code"
                            labelClassName="w-40"
                        />
                        <CustomInput 
                            label="Nom du Departement"
                            placeholder="Entrez le nom du Departement"
                            labelClassName="w-40"
                        />
                         <CustomInput 
                            label="département du Departement"
                            placeholder="Entrez le département du Departement"
                            labelClassName="w-40"
                        />
                    </>
                ) : (
                    <>
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                    </>
                ) 
            }
            <div className="flex items-center justify-end mt-4">
                    {CustomButton ? (
                    <div>
                        <CustomButton>
                            Ajouter
                        </CustomButton>
                    </div>
                    ) : (
                    <Skeleton className="h-10 w-32" />
                    )}
            </div>
        </div>
    </form>
    );
}
 
export default FormDepartement;