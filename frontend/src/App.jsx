import "./App.css";
import { lazy, Suspense, useEffect } from "react";
import Loader from "./components/Loader";
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
} from "react-router-dom";
import { useAuthStore } from "./store/authStore.js";
const LandingPage = lazy(() => import("./Pages/LandingPage.jsx"));

import LoginPage from "./Pages/LoginPage.jsx";
import Dashboard from "./Pages/Dashboard.jsx";
import SignupPage from "./Pages/SignupPage.jsx";
import SignWrapper from "./components/SignWrapper.jsx";
import EmailVerificationPage from "./components/EmailVerificationPage.jsx";
import { Toaster } from "react-hot-toast";
import ResetPasswordPage from "./components/ResetPasswordPage.jsx";
import ForgotPasswordPage from "./components/ForgotPasswordPage.jsx";
import { useDispatch, useSelector } from "react-redux";

const ProtectedRoute = () => {
  const { isLoading, error, isAuthenticated, user } = useSelector(
    (state) => state.auth
  );

  console.log(isAuthenticated);
  console.log(user);

  if (!isAuthenticated || isAuthenticated === null) {
    return <Navigate to="/landingpage" replace />;
  }

  if (!user?.isVerfied) {
    return <Navigate to="/verify-email" replace />;
  }

  return <Outlet />;
};

function App() {
  const { isCheckingAuth, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) return <Loader />;

  return (
    <BrowserRouter>
      <Suspense fallback={<Loader />}>
        <Routes>
          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>

          {/* Public Routes */}
          <Route
            path="/login"
            element={
              <SignWrapper signup={false}>
                <LoginPage />
              </SignWrapper>
            }
          />
          <Route
            path="/signup"
            element={
              <SignWrapper signup={true}>
                <SignupPage />
              </SignWrapper>
            }
          />
          <Route
            path="/verify-email"
            element={
              <SignWrapper signup={true}>
                <EmailVerificationPage />
              </SignWrapper>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <SignWrapper signup={true}>
                <ForgotPasswordPage />
              </SignWrapper>
            }
          />
          <Route
            path="/reset-password/:token"
            element={
              <SignWrapper signup={true}>
                <ResetPasswordPage />
              </SignWrapper>
            }
          />
          <Route path="/landingpage" element={<LandingPage />} />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/landingpage" replace />} />
        </Routes>
        <Toaster />
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
