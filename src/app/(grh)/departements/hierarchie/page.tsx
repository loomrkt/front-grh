"use client";

import dynamic from "next/dynamic";

const TreeKonva = dynamic(() => import("@/features/departements/TreeKonva"), {
  ssr: false,
  loading: () => <div>Chargement...</div>,
});

export default function Page() {
  return <TreeKonva />;
}
