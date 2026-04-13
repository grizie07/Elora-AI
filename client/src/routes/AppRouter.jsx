import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import ProfilePage from "../pages/ProfilePage";
import StudentHomePage from "../pages/StudentHomePage";
import AdminHomePage from "../pages/AdminHomePage";
import QuizListPage from "../pages/QuizListPage";
import CreateQuestionPage from "../pages/CreateQuestionPage";
import CreateQuizPage from "../pages/CreateQuizPage";
import TakeQuizPage from "../pages/TakeQuizPage";
import QuizResultPage from "../pages/QuizResultPage";
import MaterialsPage from "../pages/MaterialsPage";
import UploadMaterialPage from "../pages/UploadMaterialPage";
import NotFoundPage from "../pages/NotFoundPage";
import ProtectedRoute from "../components/common/ProtectedRoute";
import ChatsPage from "../pages/ChatsPage";
import CreateChatPage from "../pages/CreateChatPage";
import ChatPage from "../pages/ChatPage";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route
          path="/student"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <StudentHomePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminHomePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute allowedRoles={["student", "admin"]}>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/quizzes"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <QuizListPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/questions/create"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <CreateQuestionPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/quizzes/create"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <CreateQuizPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/quizzes/:id/take"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <TakeQuizPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/quizzes/result"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <QuizResultPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/materials"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <MaterialsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/materials/upload"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <UploadMaterialPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/chats"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <ChatsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/chats/create"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <CreateChatPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/chats/:id"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <ChatPage />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;