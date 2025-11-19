import './App.css';
import NavBar from './components/NavBar/NavBar';
import Footer from './components/Footer/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Users from './pages/Users';
import Reports from './pages/Reports';
import Bans from './pages/Bans';
import Admins from './pages/Admins';
import Error from './pages/Error';
import AdminAuthGuard from './components/admin/AdminAuthGuard';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <div className="App d-flex flex-column min-vh-100">
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin/users" element={<AdminAuthGuard><Users /></AdminAuthGuard>} />
          <Route path="/admin/users/:userId" element={<AdminAuthGuard><Users /></AdminAuthGuard>} />
          <Route path="/admin/reports" element={<AdminAuthGuard><Reports /></AdminAuthGuard>} />
          <Route path="/admin/bans" element={<AdminAuthGuard><Bans /></AdminAuthGuard>} />
          <Route path="/admin/admins" element={<AdminAuthGuard><Admins /></AdminAuthGuard>} />
          <Route path="*" element={<Error />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
export default App;
