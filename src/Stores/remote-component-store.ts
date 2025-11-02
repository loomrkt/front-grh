import { ComponentMeta } from "@/models/remote-component/global";
import { create } from "zustand";

type RemoteComponentDataType = {
  data: ComponentMeta[];
  isLoading: boolean;
  error: string | null;
};
type RemoteComponentActionType = {
  setData: (data: ComponentMeta[]) => void;
  setIsLoading: (data: boolean) => void;
  setError: (data: string) => void;
  clearError: () => void;
};

const initialStore: RemoteComponentDataType = {
  data: [],
  isLoading: true,
  error: null,
};

const useRemoteComponentStore = create<
  RemoteComponentDataType & RemoteComponentActionType
>((set) => ({
  ...initialStore,
  setData: (data) => set({ data: data }),
  setError: (data) => set({ error: data }),
  clearError: () => set({ error: null }),
  setIsLoading: (data) => set({ isLoading: data }),
}));

export { useRemoteComponentStore };