'use client';

import { MenuItems } from "@/helpers/data/menuItems";
import { usePathname } from "next/navigation";
import { getRemoteComponent } from "@/services/get-remote-component";

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { LayoutSidebarNavbar } = getRemoteComponent();

  const getNavbarTitle = () => {
    if (pathname.startsWith("/personnels")) return "Personnels";
    if (pathname.startsWith("/postes")) return "Postes";
    if (pathname.startsWith("/departements")) return "Départements";
    if (pathname.startsWith("/historiques")) return "Historiques";
    return "Tableau de bord";
  };

  return LayoutSidebarNavbar ? (
    <LayoutSidebarNavbar 
      navbarTitle={getNavbarTitle()} 
      navbarSubtitle={`gestion des ${getNavbarTitle().toLowerCase()}`}
      sidebarTitle="GRH" 
      sidebarSubtitle="Gestion des employés"
      MenuItems={MenuItems}
      logoLight="/logo/logoD.png"
      logoLightWord="/logo/logowD.png"
      logoDark="/logo/logoW.png"
      logoDarkWord="/logo/logowW.png"
    >
      {children}
    </LayoutSidebarNavbar>
  ) : null;
}
