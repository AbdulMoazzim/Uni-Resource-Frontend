
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import App from "./App";
import StudentsPage from "./pages/StudentsPage";
import InstitutionRegistration from "./pages/Registration";
import WaitingPage from "./pages/WaitingPage";
import Login from "./pages/Login";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import InstitutionAdminDashboard from "./pages/InstituteAdminPage";
import DepartmentHeadDashboard from "./pages/deptHead";
import ProtectedRoute from "./components/ProtectedRoute";
import TeachersPage from "./pages/TeachersPage";

const router = createBrowserRouter([
  // Public Routes
  { 
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        element: <Home />
    },
      {
        path: "register",
        element: <InstitutionRegistration />
    },
      {
        path: "login",
        element: <Login />
    },
      {
        path: "waiting",
        element: <WaitingPage />
    },
      {
        path: "superAdmin",
        element:<ProtectedRoute role="superAdmin">
          <SuperAdminDashboard />
        </ProtectedRoute>
    },
      {
        path: "studentsPage",
        element: <ProtectedRoute role="Student">
          <StudentsPage />
        </ProtectedRoute>
    }
    ,
      {
        path: "teachersPage",
        element: <ProtectedRoute role="Teacher">
          <TeachersPage />
        </ProtectedRoute>
    }
    ,
      {
        path: "institutionAdminPage",
        element: <ProtectedRoute role="admin">
          <InstitutionAdminDashboard />
        </ProtectedRoute>
    }
    ,
      {
        path: "deptHead",
        element: <ProtectedRoute role="DeptHead">
          <DepartmentHeadDashboard />
        </ProtectedRoute>
    }
  ]
  },
]);

createRoot(document.getElementById("root")).render(
    <RouterProvider router={router}>
      <App />
    </RouterProvider>
);
