"use client";
import { useState } from "react";
import { Button } from "./ui/button";
import { Edit2, Save, X } from "lucide-react";
import { Contract } from "@/models/types";

interface ContratsProps {
  contracts: Contract[];
}

const Contrats = ({ contracts }: ContratsProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(contracts);

  const handleChange = (index: number, field: keyof Contract, value: string | boolean | number) => {
    const newData = [...formData];
    newData[index] = { ...newData[index], [field]: value };
    setFormData(newData);
  };

  const handleSave = () => {
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData(contracts);
    setIsEditing(false);
  };

  return (
    <div className="w-full flex flex-col p-4 border rounded-lg shadow-sm">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Contrats</h2>
        {!isEditing ? (
          <Button variant="outline" onClick={() => setIsEditing(true)}>
            <Edit2 className="h-4 w-4" />
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCancel}>
              <X className="h-4 w-4" />
            </Button>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      <div className="mt-4 space-y-4">
        {formData.map((contract, index) => (
          <div key={contract.id} className="border p-3 rounded-md grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Type de contrat</label>
              {isEditing ? (
                <input
                  type="text"
                  value={contract.typeContrat}
                  onChange={(e) => handleChange(index, 'typeContrat', e.target.value)}
                  className="w-full p-2 border rounded"
                />
              ) : (
                <p>{contract.typeContrat}</p>
              )}
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-500">Référence</label>
              {isEditing ? (
                <input
                  type="text"
                  value={contract.contratReference}
                  onChange={(e) => handleChange(index, 'contratReference', e.target.value)}
                  className="w-full p-2 border rounded"
                />
              ) : (
                <p>{contract.contratReference}</p>
              )}
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-500">Date de début</label>
              {isEditing ? (
                <input
                  type="date"
                  value={contract.startDate.split('T')[0]}
                  onChange={(e) => handleChange(index, 'startDate', `${e.target.value}T00:00:00.000Z`)}
                  className="w-full p-2 border rounded"
                />
              ) : (
                <p>{new Date(contract.startDate).toLocaleDateString()}</p>
              )}
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-500">Date de fin</label>
              {isEditing ? (
                <input
                  type="date"
                  value={contract.endDate.split('T')[0]}
                  onChange={(e) => handleChange(index, 'endDate', `${e.target.value}T00:00:00.000Z`)}
                  className="w-full p-2 border rounded"
                />
              ) : (
                <p>{contract.endDate ? new Date(contract.endDate).toLocaleDateString() : "Indéterminé"}</p>
              )}
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-500">Salaire mensuel</label>
              {isEditing ? (
                <input
                  type="number"
                  value={contract.salaryMensual}
                  onChange={(e) => handleChange(index, 'salaryMensual', Number(e.target.value))}
                  className="w-full p-2 border rounded"
                />
              ) : (
                <p>{contract.salaryMensual.toLocaleString()} Ar</p>
              )}
            </div>
            
            <div className="flex items-center">
              <label className="text-sm font-medium text-gray-500 mr-2">Actif</label>
              {isEditing ? (
                <input
                  type="checkbox"
                  checked={contract.isActive}
                  onChange={(e) => handleChange(index, 'isActive', e.target.checked)}
                  className="h-4 w-4"
                />
              ) : (
                <p>{contract.isActive ? "Oui" : "Non"}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Contrats;