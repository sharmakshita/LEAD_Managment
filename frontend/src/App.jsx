import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/authcontext.jsx";
import ProtectedRoute from "./components/protectroutes.jsx";
import Login from "./pages/login.jsx";
import Register from "./pages/register.jsx";
import LeadsList from "./pages/leadlist.jsx";
import LeadForm from "./pages/leadform.jsx";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/leads" element={<ProtectedRoute><LeadsList /></ProtectedRoute>} />
          <Route path="/leads/new" element={<ProtectedRoute><LeadForm /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

