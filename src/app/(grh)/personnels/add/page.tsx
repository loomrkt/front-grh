"use client"
import Adresse from "@/components/Adresse";
import Banks from "@/components/Banks";
import ChildComponent from "@/components/Child";
import Educations from "@/components/Educations";
import Occupation from "@/components/Occupation";
import UserCard from "@/features/personnels/UserCard";
import { ApiResponse } from "@/models/types";
import { useEffect, useState } from "react";

export default function Page() {
    const [userData, setUserData] = useState<ApiResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
    const fetchData = async () => {
        try {
        const response = await fetch("http://localhost:3000/employe/1");
        const data: ApiResponse = await response.json();
        if (data.success && data.data.length > 0) {
            setUserData(data);
        } else {
            setError("Aucune donnée utilisateur disponible");
        }
        } catch (err) {
        setError("Erreur lors du chargement des données");
        } finally {
        setLoading(false);
        }
    };

    fetchData();
    }, []);

    if (loading) return <div>Chargement...</div>;
    if (error) return <div>Erreur: {error}</div>;
    if (!userData || userData.data.length === 0) return <div>Aucune donnée disponible</div>;

    const user = userData.data[0];

    return (
        <div className="flex flex-wrap gap-4 p-4 md:h-[80vh]">
            <div className="not-lg:w-full lg:w-fit flex justify-center items-center h-full">
                <UserCard identity={user.identity} contact={user.contact} />
            </div>
            <div className="w-full lg:flex-1 overflow-scroll h-full grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Adresse address={user.adress} />
                <Occupation occupation={null}/>
                {/* mety ho bdb */}
                 {
                    user.banques && user.banques.length > 0 ? (
                        user.banques.map((bank, index) => (
                            <Banks key={index} bank={bank}  index={index + 1}/>
                        ))
                    ) : (
                        <Banks bank={null} />
                    )
                 }
                 {
                    user.educations && user.educations.length > 0 ? (
                        user.educations.map((education, index) => (
                            <Educations key={index} education={education}  index={index + 1}/>
                        ))
                    ) : (
                        <Educations education={null} />
                    )
                 }
                 {
                    user.children && user.children.length > 0 ? (
                        user.children.map((child, index) => (
                            <ChildComponent key={index} child={child}  index={index + 1}/>
                        ))
                    ) : (
                        <ChildComponent child={null} />
                    )
                 }
                {/* mety ho bdb */}
            </div>
        </div>
    );
}
