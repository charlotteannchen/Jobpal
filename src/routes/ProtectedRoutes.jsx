import React from 'react';
import { Navigate } from 'react-router-dom';
import { useFirebase } from 'contexts/FirebaseContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useFirebase();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;