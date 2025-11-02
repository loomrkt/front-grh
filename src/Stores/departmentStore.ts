import { create } from 'zustand';
import { addDepartement, updateDepartement, getDepartementById } from '@/services/Departement';
import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { CreateDepartmentDto } from '@/models/CreateDepartmentDto';
import { UpdateDepartmentDto } from '@/models/UpdateDepartmentDto';
import { toast } from 'react-toastify';

interface DepartmentFormState {
  departmentCode: string;
  departmentName: string;
  parentDepartmentId?: string | null;
  departmentId?: string;
  mode: 'create' | 'update';
  setField: (field: keyof CreateDepartmentDto | 'parentDepartmentId', value: string | null) => void;
  setMode: (mode: 'create' | 'update', departmentId?: string) => void;
  resetForm: () => void;
  submitForm: (queryClient: ReturnType<typeof useQueryClient>) => Promise<void>;
  loadDepartment: (id: string) => Promise<void>;
  selectDepartmentToEdit: (id: string) => void;
  cancelUpdate: () => void;
}

const useDepartmentStore = create<DepartmentFormState>((set, get) => ({
  departmentCode: '',
  departmentName: '',
  parentDepartmentId: null,
  departmentId: undefined,
  mode: 'create',

  setField: (field, value) =>
    set(state => ({
      ...state,
      [field]: value,
    })),

  setMode: (mode, departmentId) =>
    set(state => ({
      ...state,
      mode,
      departmentId,
    })),

  resetForm: () =>
    set(() => ({
      departmentCode: '',
      departmentName: '',
      parentDepartmentId: null,
      departmentId: undefined,
      mode: 'create',
    })),

  loadDepartment: async (id: string) => {
    try {
      const res = await getDepartementById(id);
      const department = res.data;
      set({
        departmentCode: department.departmentCode || '',
        departmentName: department.departmentName || '',
        parentDepartmentId: department.parentDepartmentId || null,
        departmentId: id,
        mode: 'update',
      });
    } catch (error) {
      toast.error('Failed to load department data');
    }
  },

  submitForm: async (queryClient: ReturnType<typeof useQueryClient>) => {
    const { departmentCode, departmentName, parentDepartmentId, mode, departmentId } = get();

    const payload: CreateDepartmentDto | UpdateDepartmentDto = {
      departmentCode,
      departmentName,
      parentDepartmentId: parentDepartmentId || null,
    };

    try {
      if (mode === 'create') {
        await addDepartement(payload as CreateDepartmentDto);
      } else if (mode === 'update' && departmentId) {
        await updateDepartement(departmentId, payload as UpdateDepartmentDto);
      }
      await queryClient.invalidateQueries({ queryKey: ['Departements'] });
      get().resetForm();
    } catch (error) {
      toast.error('Failed to save department data');
      throw error;
    }
  },


  selectDepartmentToEdit: (id: string) => {
    set({ departmentId: id, mode: 'update' });
    get().loadDepartment(id);
  },

  cancelUpdate: () => {
    set({
      departmentCode: '',
      departmentName: '',
      parentDepartmentId: null,
      departmentId: undefined,
      mode: 'create',
    });
  },
}));

export const useDepartmentQuery = (id?: string) => {
  return useSuspenseQuery({
    queryKey: ['department', id],
    queryFn: () => getDepartementById(id!),
  });
};

export default useDepartmentStore;