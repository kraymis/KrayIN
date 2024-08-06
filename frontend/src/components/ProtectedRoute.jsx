import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element, currentUser }) => {
  if (currentUser) {
    return element; // Render the component if currentUser is available
  }
  return <Navigate to="/login" replace />; // Redirect to login if not authenticated
};

export default ProtectedRoute;
