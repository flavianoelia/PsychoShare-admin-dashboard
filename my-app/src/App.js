import './App.css';
import NavBar from './components/NavBar/NavBar.jsx';
import Footer from './components/Footer/Footer';
import Home from './pages/Home';
import Users from './pages/Users';
import Reports from './pages/Reports';
import BannedUsersPage from './pages/BannedUsersPage';
import Admins from './pages/Admins';
import Error from './pages/Error';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <div className="App d-flex flex-column min-vh-100">
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin/users" element={<Users />} />
          <Route path="/admin/users/:userId" element={<Users />} />
          <Route path="/admin/reports" element={<Reports />} />
          <Route path="/admin/bans" element={<BannedUsersPage />} />
          <Route path="/admin/admins" element={<Admins />} />
          <Route path="*" element={<Error />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
export default App;
