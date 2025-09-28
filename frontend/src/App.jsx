import "./App.css";
import { lazy, Suspense } from "react";
import Loader from "./components/Loader";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useAuthStore } from "./store/authStore.js";
const LandingPage = lazy(() => import("./Pages/LandingPage.jsx"));
const LoginPage = lazy(() => import("./Pages/LoginPage.jsx"));

const ProtectedRoute = () => {
  const { isAuthenticated, user } = useAuthStore();
  console.log(isAuthenticated);

  if (!isAuthenticated || isAuthenticated === null) {
    return <Navigate to="/landingpage" replace />;
  }

  if (!user.isVerfied) {
    return <Navigate to="/verify-email" replace />;
  }
  return <Outlet />;
};

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/" element={<ProtectedRoute />}></Route>
          <Route path="/landingpage" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<Navigate to="/landingpage" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
