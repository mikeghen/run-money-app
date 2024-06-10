import React, { useContext } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import { FaHome, FaRunning, FaUsers, FaBiking, FaSignOutAlt, FaSignInAlt } from 'react-icons/fa';
import { AuthContext, AuthProvider } from './context/AuthContext';
import Index from './pages/Index.jsx';
import Members from './pages/Members.jsx';
import ClubActivities from './pages/ClubActivities.jsx';
import ClubView from './pages/ClubView.jsx';

const Navigation = () => {
  const { token, logout } = useContext(AuthContext);

  const handleLogin = () => {
    window.location.href = `https://www.strava.com/oauth/authorize?client_id=${import.meta.env.VITE_CLIENT_ID}&response_type=code&redirect_uri=${window.location.origin}&scope=read,activity:read_all`;
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand href="/">Proof of Workout</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/"><FaHome className="me-2" /> Home</Nav.Link>
            {token && <Nav.Link href="/members"><FaUsers className="me-2" /> Club</Nav.Link>}
            {token && <Nav.Link href="/club-activities"><FaRunning className="me-2" /> Club Activities</Nav.Link>}
          </Nav>
          {token ? (
            <Button variant="outline-light" onClick={logout}><FaSignOutAlt className="me-2" /> Logout</Button>
          ) : (
            <Button variant="outline-light" onClick={handleLogin}><FaSignInAlt className="me-2" /> Login with Strava</Button>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

const App = () => (
  <AuthProvider>
    <Router>
      <Navigation />
      <Container className="mt-4">
        <Routes>
          <Route exact path="/" element={<Index />} />
          <Route path="/members" element={<Members />} />
          <Route path="/club-activities" element={<ClubActivities />} />
          <Route path="/club-view" element={<ClubView />} />
        </Routes>
      </Container>
    </Router>
  </AuthProvider>
);

export default App;
