"use client";

import { AlertCircle } from "lucide-react";

interface ErrorComponentProps {
  message?: string;
}

const ErrorComponent: React.FC<ErrorComponentProps> = ({ 
  message = "Une erreur est survenue lors du chargement du composant.", 
}) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center gap-4 max-w-md text-center">
        <AlertCircle className="w-12 h-12 text-red-500" />
        <h2 className="text-xl font-semibold text-red-600 dark:text-red-400">
          {message}
        </h2>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
        >
          Réessayer
        </button>
      </div>
    </div>
  );
};

export default ErrorComponent;