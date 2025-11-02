"use client";

import { useEffect, useMemo, useState } from "react";
import * as Babel from "@babel/standalone";
import React from "react";
import { useRemoteComponentStore } from "@/Stores/remote-component-store";

/**
 * Charge dynamiquement un composant depuis un fichier JSON.
 * @param name Nom du composant dans le fichier JSON
 * @param scope Objets React à injecter dans le contexte du composant (ex: { Button })
 * @param url URL du fichier JSON contenant les composants (par défaut: localhost)
 */
export function useRemoteComponent<P = Record<string, unknown>>(
  name: string,
  scope: Record<string, unknown> = {}
): React.FC<P> | null {
  const { data } = useRemoteComponentStore();
  const [Component, setComponent] = useState<React.FC<P> | null>(null);

  const stableScope = useMemo(() => scope, [JSON.stringify(scope)]);

  useEffect(() => {
    if (stableScope && Object.values(stableScope).some((dep) => dep === null)) {
      return; // Ne pas charger tant que des dépendances sont manquantes
    }
    const loadComponent = async () => {
      try {
        const target = data.find((c) => c.name === name);
        if (!target) return;

        // Nouvelle approche de compilation
        const { code } = Babel.transform(`(${target.jsx})`, {
          presets: [
            "react",
            "typescript", // Ajoutez ce preset
          ],
          filename: "component.tsx", // Important pour le traitement TS
          plugins: ["transform-arrow-functions", "transform-template-literals"],
        });

        const argNames = ["React", ...Object.keys(stableScope)];
        const argValues = [React, ...Object.values(stableScope)];

        // Évaluation directe de l'expression
        const Compiled = new Function(...argNames, `return ${code}`)(
          ...argValues
        ) as React.FC<P>;

        setComponent(() => Compiled);
      } catch (err: any) {
        console.error(
          `Erreur lors du chargement du composant distant "${name}": ${err}`
        );
      }
    };

    loadComponent();
  }, [name, stableScope]);

  return Component;
}