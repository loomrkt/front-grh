import { Departement } from "@/models/Departement.dto";
import { PaginatedResult } from "@/models/PaginatedResult";
import { ChevronDown, ChevronUp } from "lucide-react";
import React, { useState } from "react";

interface TreeControlsProps {
  departmentId: string | null;
  depth: number | null;
  allDepartments: PaginatedResult<Departement> | undefined;
  onDepartmentChange: (departmentId: string | null) => void;
  onDepthChange: (depth: number | null) => void;
}

const TreeControls: React.FC<TreeControlsProps> = ({
  departmentId,
  depth,
  allDepartments,
  onDepartmentChange,
  onDepthChange,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const handleDepartmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onDepartmentChange(e.target.value || null);
  };

  const handleDepthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    onDepthChange(isNaN(value) || value === 0 ? null : value);
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="absolute top-4 left-4 z-10 sm:max-w-xs max-w-[90%] sm:w-auto">
      <div className={`
        bg-white/95 backdrop-blur-sm p-4 rounded-lg shadow-lg border border-gray-200
        transition-all duration-300 ease-in-out
        ${isCollapsed ? 'overflow-hidden' : 'max-h-[400px]'}
      `}>
        <div className={`flex justify-start gap-4 items-center ${!isCollapsed ? 'mb-3' : ''}`}>
           <button
            onClick={toggleCollapse}
            className="p-1 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label={isCollapsed ? "Expand controls" : "Collapse controls"}
          >
           {
            isCollapsed ? (
                <ChevronDown className="h-5 w-5 text-gray-600" />
            ) : (
                <ChevronUp className="h-5 w-5 text-gray-600" />
            )
           }
          </button>
          {!isCollapsed ?
          <h3 className="text-sm font-semibold text-gray-800">Tree Controls</h3>
            : null}
        </div>
        
        <div className={`flex flex-col gap-3 ${isCollapsed ? 'hidden' : 'block'}`}>
          <div className="flex flex-col gap-1.5">
            <label
              className="text-xs font-medium text-gray-700"
              htmlFor="department-select"
            >
              Department
            </label>
            <select
              id="department-select"
              value={departmentId || ""}
              onChange={handleDepartmentChange}
              className="w-full truncate px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select (Root)</option>
              {allDepartments?.data?.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.departmentName} ({dept.departmentCode})
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              className="text-xs font-medium text-gray-700"
              htmlFor="depth-input"
            >
              Depth Limit
            </label>
            <input
              id="depth-input"
              type="number"
              value={depth || ""}
              onChange={handleDepthChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="No limit"
              min="1"
              max="10"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TreeControls;