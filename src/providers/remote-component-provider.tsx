
"use client";
import ErrorComponent from "@/components/error";
import Loading from "@/components/loading";
import { ComponentMeta } from "@/models/remote-component/global";
import { useRemoteComponentStore } from "@/Stores/remote-component-store";
import { useEffect } from "react";

interface RemoteComponentProviderProps {
  children: React.ReactNode;
}

const RemoteComponentProvider: React.FC<RemoteComponentProviderProps> = ({
  children,
}) => {
  const { setData, setError, clearError, error, setIsLoading, isLoading } =
    useRemoteComponentStore();
  const remoteComponentUrlServer =
    process.env.NEXT_PUBLIC_REMOTE_COMPONENT_SERVER+`/components.json` || "";

  useEffect(() => {
    const loadComponent = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(remoteComponentUrlServer, {
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error(`Erreur HTTP: ${res.statusText}`);
        }

        const data: ComponentMeta[] = await res.json();
        clearError();
        setData(data);
      } catch (err: any) {
        console.error(
          `Erreur lors du chargement du composant distant "${name}": ${err}`
        );
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadComponent();
  }, []);

  if (isLoading) return <Loading message="Chargement ..." />;
    if (error)
    return (
        <ErrorComponent />
    );
  return <>{children}</>;
};

export default RemoteComponentProvider;