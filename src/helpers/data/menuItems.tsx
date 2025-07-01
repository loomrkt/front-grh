import { MenuItem } from "@/helpers/types/MenuItem";

export  const MenuItems: MenuItem[] = [
    { label: "Personnels", icon: <span className="icon-[clarity--employee-group-line] text-base"></span>, Link: "/" },
    { label: "Postes", icon: <span className="icon-[mdi--work-outline] text-base"></span>, Link: "/postes" },
    { label: "Départements", icon: <span className="icon-[mdi--factory] text-base"></span>, Link: "/departements" },
    { label: "Historiques", icon: <span className="icon-[material-symbols--history] text-base"></span>, Link: "/historiques" },
];