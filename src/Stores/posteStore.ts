import { UpdatePosteDto } from '@/models/UpdatePosteDto';
import { create } from 'zustand';
import { addPoste, updatePoste, getPosteById } from '@/services/poste';
import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { CreatePosteDto } from '@/models/CreatePosteDto';
import { toast } from 'react-toastify';

interface PosteFormState {
  posteCode: string;
  posteTitle: string;
  departementId?: string | null;
  posteId?: string;
  mode: 'create' | 'update';
  setField: (field: keyof CreatePosteDto | 'departementId', value: string | null) => void;
  setMode: (mode: 'create' | 'update', posteId?: string) => void;
  resetForm: () => void;
  submitForm: (queryClient: ReturnType<typeof useQueryClient>) => Promise<void>;
  loadPoste: (id: string) => Promise<void>;
  selectPosteToEdit: (id: string) => void;
  cancelUpdate: () => void;
}

const usePosteStore = create<PosteFormState>((set, get) => ({
  posteCode: '',
  posteTitle: '',
  departementId: null,
  posteId: undefined,
  mode: 'create',

  setField: (field, value) =>
    set(state => ({
      ...state,
      [field]: value,
    })),

  setMode: (mode, posteId) =>
    set(state => ({
      ...state,
      mode,
      posteId,
    })),

  resetForm: () =>
    set(() => ({
      posteCode: '',
      posteTitle: '',
      departementId: null,
      posteId: undefined,
      mode: 'create',
    })),

  loadPoste: async (id: string) => {
    try {
      const res = await getPosteById(id);
      const poste = res.data;
      set({
        posteCode: poste.posteCode || '',
        posteTitle: poste.posteTitle || '',
        departementId: poste.departmentId || null,
        posteId: id,
        mode: 'update',
      });
    } catch (error) {
      toast.error('Failed to load poste data');
    }
  },

  submitForm: async (queryClient: ReturnType<typeof useQueryClient>) => {
    const { posteCode, posteTitle, departementId, mode, posteId } = get();

    const payload: CreatePosteDto | UpdatePosteDto = {
      posteCode,
      posteTitle,
      departementId: departementId || null,
    };

    try {
      if (mode === 'create') {
        await addPoste(payload as CreatePosteDto);
      } else if (mode === 'update' && posteId) {
        await updatePoste(posteId, payload as UpdatePosteDto);
      }
      await queryClient.invalidateQueries({ queryKey: ['Postes'] });
      get().resetForm();
    } catch (error) {
      toast.error('Failed to save poste data');
      throw error;
    }
  },

  selectPosteToEdit: (id: string) => {
    set({ posteId: id, mode: 'update' });
    get().loadPoste(id);
  },

  cancelUpdate: () => {
    set({
      posteCode: '',
      posteTitle: '',
      departementId: null,
      posteId: undefined,
      mode: 'create',
    });
  },
}));

export const usePosteQuery = (id?: string) => {
  return useSuspenseQuery({
    queryKey: ['poste', id],
    queryFn: () => getPosteById(id!),
  });
};

export default usePosteStore;