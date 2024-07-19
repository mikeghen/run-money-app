import React, { useContext } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';
import stravaConnectImage from '/strava_connect.png'; // Ensure the path is correct
import stravaPoweredImage from '/strava_powered.png'; // Ensure the path is correct

const WelcomePage = () => {
  const { token, logout } = useContext(AuthContext);
  
  const clientId = "127717";

  const handleLogin = () => {
    window.location.href = `https://www.strava.com/oauth/authorize?client_id=${clientId}&response_type=code&redirect_uri=${window.location.origin}&scope=read,activity:read_all,profile:read_all`;
  };

  return (
    <Container className="d-flex flex-column justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <Row className="mb-4">
        <Col>
          <h1>Welcome to Run Money</h1>
          <p>Connect with Strava to get started</p>
        </Col>
      </Row>
      <Row>
        <Col>
          {token ? (
            <img 
              src={stravaPoweredImage} 
              alt="Powered by Strava" 
              style={{ cursor: 'pointer', height: '40px' }} // Adjust the height to fit the header
              onClick={logout} 
            />
          ) : (
            <img 
              src={stravaConnectImage} 
              alt="Connect with Strava" 
              onClick={handleLogin} 
              style={{ cursor: 'pointer', height: '40px' }} // Adjust the height to fit the header
            />
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default WelcomePage;
