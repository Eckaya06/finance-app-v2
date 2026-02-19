import { Navigate } from 'react-router-dom';
import { isLoggedIn } from '../utils/auth';

const ProtectedRoute = ({ children }) => {
  
  if (isLoggedIn()) {
    return children;
  }

  
  return <Navigate to="/login" />;
};

export default ProtectedRoute;