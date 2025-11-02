"use client"
import UserCard from "@/features/personnels/UserCard";
import Image from "next/image";

export default function Page() {

    return (
        <div className="flex flex-wrap gap-4 p-4 md:h-[80vh] relative">
            <div className={`lg:w-fit not-lg:w-full flex justify-center items-center h-full md:border-r md:border-gray-200 md:pr-10`}>
                <UserCard />
            </div>
            <div className="ml-9 w-full flex-1 h-full overflow-scroll not-md:hidden">
               <Image
               src="/employe.png"
                alt="Employe"
                width={500}
                height={500}
                className="w-full h-full object-contain"
                />
            </div>
        </div>
    );
}
