import React from "react";

const ContentArea = ({ children }) => {
  return (
    <div className="p-6 bg-gray-100 min-h-screen flex-1">
      {children}
    </div>
  );
};

export default ContentArea;
