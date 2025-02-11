import React from "react";

const Loader: React.FC = () => {
  return (
    <div className="fixed bottom-32 right-4 bg-white shadow-lg rounded-lg p-4 flex items-center space-x-3 border border-gray-300">
      <div className="loader"></div>
      <p className="text-gray-700 text-sm font-semibold">CARGANDO...</p>
    </div>
  );
};

export default Loader;
