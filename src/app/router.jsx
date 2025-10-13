import { useEffect } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import AuthGuard from './authGuard';
import Login from '../pages/Login';
import DashboardEstagiario from '../components/student/DashboardEstagiario';
import InboxQuizzes from '../components/student/InboxQuizzes';
import TasksBoard from '../components/student/TasksBoard';
import VideosPage from '../components/student/VideosPage';
import VacationRequestForm from '../components/student/VacationRequestForm';
import VacationList from '../components/student/VacationList';
import ForumList from '../components/student/ForumList';
import ForumThread from '../components/student/ForumThread';
import DashboardPadrinho from '../components/mentor/DashboardPadrinho';
import Generator from '../pages/AscendaIA/Generator';
import CourseLibrary from '../components/library/CourseLibrary';
import AssignQuizzesPanel from '../components/assign/AssignQuizzesPanel';
import LoadingGate from '../components/common/LoadingGate';
import RocketLoading from '../components/common/RocketLoading';
import { useAuthStore } from '../state/useAuthStore';

const PostLoginRedirector = () => {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    const target = user.role === 'padrinho' ? '/padrinho' : '/estagiario';
    const timer = setTimeout(() => navigate(target, { replace: true }), 9000);
    return () => clearTimeout(timer);
  }, [user, navigate]);

  return (
    <LoadingGate durationMs={9000} overlay>
      <RocketLoading variant="postLogin" />
    </LoadingGate>
  );
};

const LogoutRedirector = () => {
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    useAuthStore.getState().logout();
    const timer = setTimeout(() => navigate('/login', { replace: true, state: { from: location } }), 4000);
    return () => clearTimeout(timer);
  }, [navigate, location]);

  return (
    <LoadingGate durationMs={4000} overlay>
      <RocketLoading variant="preLogin" />
    </LoadingGate>
  );
};

const AppRouter = () => {
  const user = useAuthStore((state) => state.user);

  return (
    <Routes>
      <Route path="/" element={user ? <PostLoginRedirector /> : <Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/logout" element={<LogoutRedirector />} />
      <Route element={<AuthGuard role="intern" />}> 
        <Route path="/estagiario" element={<DashboardEstagiario />} />
        <Route path="/estagiario/quizzes" element={<InboxQuizzes />} />
        <Route path="/estagiario/atividades" element={<TasksBoard />} />
        <Route path="/estagiario/videos" element={<VideosPage />} />
        <Route path="/estagiario/ferias" element={<>
          <VacationRequestForm />
          <VacationList />
        </>} />
        <Route path="/estagiario/forum" element={<ForumList />} />
        <Route path="/estagiario/forum/:threadId" element={<ForumThread />} />
      </Route>
      <Route element={<AuthGuard role="padrinho" />}>
        <Route path="/padrinho" element={<DashboardPadrinho />} />
      </Route>
      <Route element={<AuthGuard role="any" />}>
        <Route path="/ascenda-ia/generator" element={<Generator />} />
        <Route path="/ascenda-ia/library" element={<CourseLibrary />} />
        <Route path="/ascenda-ia/assign" element={<AssignQuizzesPanel />} />
      </Route>
      <Route path="*" element={<Navigate to={user ? (user.role === 'padrinho' ? '/padrinho' : '/estagiario') : '/login'} replace />} />
    </Routes>
  );
};

export default AppRouter;
