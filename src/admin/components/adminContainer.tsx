import React from 'react';
import '../tailwind.css';
import '../adminStyles.css';

const AdminContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="admin-panel">
      {children}
    </div>
  );
};

export default AdminContainer;