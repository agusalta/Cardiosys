import React from "react";

const Loader: React.FC = () => {
  return (
    <div className="flex justify-center items-center min-h-screen flex-col">
      <div className="loader"></div>
      <p className="text-center text-xl font-bold p-4 pr-3">CARGANDO...</p>
    </div>
  );
};

export default Loader;
