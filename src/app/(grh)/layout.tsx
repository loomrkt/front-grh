'use client';

import { remoteComponent } from "@/helpers/remote-components";
import { MenuItems } from "@/helpers/data/menuItems";
import { usePathname } from "next/navigation";
import { MenuItem } from "@/helpers/types/MenuItem";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { LayoutSidebarNavbar, CustomBreadcrumb } = remoteComponent();
  const pathname = usePathname();
  const actualLabel = MenuItems.find((item: MenuItem) => item.Link === pathname)?.label;
  
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
      { CustomBreadcrumb ? 
        <CustomBreadcrumb
          items={[
            { label: "Accueil", href: "/" },
            { label: "GRH", href: "/" },
            { label: actualLabel },
          ]}
        /> : null }
      {children}
    </LayoutSidebarNavbar>
  ) : null;
}
