"use client";
import { Button } from "@/components/ui/button"
import { remoteComponent } from "@/helpers/remote-components";
import { Edit2 } from "lucide-react"

const UserCard = () => {
    const { CustomInput } = remoteComponent();
    return ( 
    <div className="w-fit flex flex-col items-center p-4">
        <div className="w-[100px] h-[100px] rounded-full bg-red-200"></div>
        <div className="text-center mt-2">
            <h2 className="text-lg font-semibold">John Doe</h2>
            <p className="text-gray-500">(+261) 34 30 259 92</p>
            <p className="text-gray-500">user@gmail.com</p>
        </div>
        <div className="mt-4 flex justify-between items-center gap-5">
            <h2 className="text-lg font-semibold">Information générale</h2>
            <Button variant="outline">
                <Edit2 className="h-4 w-4" />
            </Button>
        </div>
        <div className="space-y-2 mt-2">
            {
             CustomInput && (
                <>
                    <CustomInput label="Genre" labelClassName="w-30" placeholder="Entrez votre Genre" />
                    <CustomInput label="Nationalité" labelClassName="w-30" placeholder="Entrez votre Nationalité" />
                    <CustomInput label="Date de naissance" labelClassName="w-30" placeholder="Entrez votre date de naissance" />
                    <CustomInput label="Lieu de naissance" labelClassName="w-30" placeholder="Entrez votre lieu de naissance" />
                </>
             )   
            }
        </div>
    </div>
    );
}
 
export default UserCard;