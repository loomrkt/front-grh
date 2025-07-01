'use client';

import { remoteComponent } from "@/helpers/remote-components";
import { MenuItems } from "@/helpers/data/menuItems";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { LayoutSidebarNavbar } = remoteComponent();

  return LayoutSidebarNavbar ? (
    <LayoutSidebarNavbar 
      navbarTitle="Personnels" 
      navbarSubtitle="Gérer votre personel" 
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
