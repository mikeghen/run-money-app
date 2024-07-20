import React, { useContext } from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';
import { FaHome, FaRunning, FaChartBar } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import stravaConnectImage from '/strava_connect.png'; // Ensure the path is correct
import stravaPoweredImage from '/strava_powered.png'; // Ensure the path is correct

const Navigation = () => {
  const { token, logout } = useContext(AuthContext);

  const handleLogin = () => {
    window.location.href = `https://www.strava.com/oauth/authorize?client_id=127717&response_type=code&redirect_uri=${window.location.origin}&scope=read,activity:read_all,profile:read_all`;
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand href="/">🏃💸 Run Money</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {token && <Nav.Link href="/dashboard"><FaChartBar className="me-2" /> Dashboard</Nav.Link>}
            <Nav.Link href="/clubs"><FaHome className="me-2" /> Clubs</Nav.Link>
            <Nav.Link href="/"><FaRunning className="me-2" /> Your Activities</Nav.Link>
          </Nav>
          <div className="d-flex align-items-center ms-auto">
            <ConnectButton />
            {token ? (
              <>
                <img 
                  src={stravaPoweredImage} 
                  alt="Powered by Strava" 
                  style={{ cursor: 'pointer', marginLeft: '10px', height: '25px' }} 
                  onClick={logout} 
                />
                <button 
                  onClick={logout} 
                  style={{ marginLeft: '10px', backgroundColor: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}
                >
                  Log out of Strava
                </button>
              </>
            ) : (
              <img 
                src={stravaConnectImage} 
                alt="Connect with Strava" 
                onClick={handleLogin} 
                style={{ cursor: 'pointer', marginLeft: '10px', height: '40px' }} 
              />
            )}
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;
