import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/layout/Layout";
import { useEffect } from "react";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/auth/LoginPage";
import SignUpPage from "./pages/auth/SignUpPage";
import NotificationsPage from "./pages/NotificationsPage";
import NetworkPage from "./pages/NetworkPage";
import PostPage from "./pages/PostPage";
import ProfilePage from "./pages/ProfilePage";
import toast, { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "./lib/axios";

function App() {
  // Fetch authenticated user
  const { data: authUser, isLoading } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get("/auth/me");
        return res.data;
      } catch (err: any) {
        if (err?.response?.status === 401) return null;
        toast.error(err?.response?.data?.message || "Something went wrong");
        return null;
      }
    },
  });

  // Clear console once on mount
  useEffect(() => {
    console.clear();
  }, []);

  if (isLoading) return null; // or a loading spinner

  return (
    <Layout>
      <Routes>
        <Route
          path="/"
          element={authUser ? <HomePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/signup"
          element={!authUser ? <SignUpPage /> : <Navigate to="/" />}
        />
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to="/" />}
        />
        <Route
          path="/notifications"
          element={authUser ? <NotificationsPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/network"
          element={authUser ? <NetworkPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/post/:postId"
          element={authUser ? <PostPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/profile/:username"
          element={authUser ? <ProfilePage /> : <Navigate to="/login" />}
        />
      </Routes>
      <Toaster />
    </Layout>
  );
}

export default App;
