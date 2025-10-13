import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../state/useAuthStore';
import Topbar from '../components/common/Topbar';
import Sidebar from '../components/common/Sidebar';

const shouldShowLayout = (pathname) => {
  return !['/login', '/logout'].includes(pathname);
};

const AuthGuard = ({ role }) => {
  const location = useLocation();
  const user = useAuthStore((state) => state.user);

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (role !== 'any' && user.role !== role) {
    const target = user.role === 'padrinho' ? '/padrinho' : '/estagiario';
    return <Navigate to={target} replace />;
  }

  const layout = shouldShowLayout(location.pathname);

  return (
    <div className="min-h-screen bg-dark/95 text-slate-100">
      {layout && <Topbar />}
      <div className="flex">
        {layout && <Sidebar />}
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AuthGuard;
