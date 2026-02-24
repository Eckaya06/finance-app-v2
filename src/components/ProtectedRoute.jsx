import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // 1. Firebase hala oturum durumunu kontrol ediyorsa (Loading true ise)
  // Ekranın boş kalmaması veya hemen Login'e atmaması için bir bekleme ekranı gösteriyoruz.
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignAtems: 'center', 
        height: '100vh', 
        fontSize: '1.2rem',
        fontFamily: 'sans-serif'
      }}>
        Loading session...
      </div>
    );
  }

  // 2. Loading bitti ve hala kullanıcı (user) yoksa, o zaman Login'e gönder.
  if (!user) {
    return <Navigate to="/login" />;
  }

  // 3. Kullanıcı varsa, gitmek istediği sayfayı (children) göster.
  return children;
};

export default ProtectedRoute;