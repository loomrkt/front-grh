import { MenuItem } from "@/helpers/types/MenuItem";

export  const MenuItems: MenuItem[] = [
    { label: "Départements", icon: <span className="icon-[mdi--factory] text-base"></span>, Link: "/departements" },
    { label: "Postes", icon: <span className="icon-[mdi--work-outline] text-base"></span>, Link: "/postes" },
    { label: "Personnels", icon: <span className="icon-[clarity--employee-group-line] text-base"></span>, Link: "/personnels" },
    { label: "Historiques", icon: <span className="icon-[material-symbols--history] text-base"></span>, Link: "/historiques" },
];