import React from "react";

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950/30">
      <div className="container mx-auto py-8">
        {children}
      </div>
    </div>
  );
};

export default MainLayout;
