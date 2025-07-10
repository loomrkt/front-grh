"use client";
import { useState, useEffect } from "react";
import UserCard from "@/features/personnels/UserCard";
import Adresse from "./Adresse";
import EtatCivil from "./EtatCivil";
import Enfants from "./Enfants";
import Contrats from "./Contrats";
import { ApiResponse } from "@/models/types";

const UserProfile = () => {
  const [userData, setUserData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("localhost:3000/employe/1");
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
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <UserCard identity={user.identity} contact={user.contact} />
          <Adresse address={user.adress} />
        </div>
        
        <div className="lg:col-span-2 space-y-6">
          <EtatCivil civilStatus={user.civilStatus} />
          <Enfants children={user.children} />
          <Contrats contracts={user.contrats} />
        </div>
      </div>
    </div>
  );
};

export default UserProfile;