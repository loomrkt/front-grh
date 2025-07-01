import { useEffect, useMemo, useState } from 'react';
import * as Babel from '@babel/standalone';
import React from 'react';

export type ComponentMeta = {
  name: string;
  jsx: string;
};

/**
 * Charge dynamiquement un composant depuis un fichier JSON.
 * @param name Nom du composant dans le fichier JSON
 * @param scope Objets React à injecter dans le contexte du composant (ex: { Button })
 * @param url URL du fichier JSON contenant les composants (par défaut: localhost)
 */
export function useRemoteComponent<P = Record<string, unknown>>(
  name: string,
  scope: Record<string, unknown> = {},
  url: string = 'http://localhost:8080/components.json'
): React.FC<P> | null {
  const [Component, setComponent] = useState<React.FC<P> | null>(null);
  const stableScope = useMemo(() => scope, [JSON.stringify(scope)]);

useEffect(() => {
    if (stableScope && Object.values(stableScope).some(dep => dep === null)) {
      return; // Ne pas charger tant que des dépendances sont manquantes
    }
    const loadComponent = async () => {
      try {
        const res = await fetch(url, { cache: 'no-store' });
        const data: ComponentMeta[] = await res.json();

        const target = data.find((c) => c.name === name);
        if (!target) return;

        // Nouvelle approche de compilation
        const { code } = Babel.transform(
          `(${target.jsx})`, // Parenthèses pour traiter l'expression
          { 
            presets: ['react'],
            plugins: [
              ["transform-arrow-functions"], 
              ["transform-template-literals"]
            ]
          }
        );

        const argNames = ['React', ...Object.keys(stableScope)];
        const argValues = [React, ...Object.values(stableScope)];

        // Évaluation directe de l'expression
        const Compiled = new Function(...argNames, `return ${code}`)(...argValues);
        
        setComponent(() => Compiled);
      } catch (err) {
        console.error(`Erreur lors du chargement du composant distant "${name}" :`, err);
      }
    };

    loadComponent();
}, [name, url, stableScope]);

  return Component;
}
