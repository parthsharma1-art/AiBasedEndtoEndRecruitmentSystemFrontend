const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("authKey");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
