import React, { useContext } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import stravaConnectImage from '/strava_connect.png'; // Ensure the path is correct

const WelcomePage = () => {
  const { token, logout } = useContext(AuthContext);
  
  const clientId = "127717";

  const handleLogin = () => {
    window.location.href = `https://www.strava.com/oauth/authorize?client_id=${clientId}&response_type=code&redirect_uri=${window.location.origin}/dashboard&scope=read,activity:read_all,profile:read_all`;
  };

  return (
    <Container className="d-flex flex-column justify-content-center align-items-center" >
      <Row className="mb-4 text-center">
        <Col>
          <img src="/runmoney_logo.png" alt="Run Money Logo" width={300} />
          <p>Connect with Strava to get started</p>
        </Col>
      </Row>
      <Row className="mb-4">
        <Col className="text-center">
          {token ? (
            <Link to="/dashboard" className="btn btn-primary">Go to Dashboard</Link>
          ) : (
            <img 
              src={stravaConnectImage} 
              alt="Connect with Strava" 
              onClick={handleLogin} 
              style={{ cursor: 'pointer', height: '48px'}} // Adjust the height to fit the header
            />
          )}
        </Col>
      </Row>
      <Row className="mb-4 text-center">
        <Col>
          <h2>What is Run Money all about?</h2>
          <p>Run Money helps you stay physically and financially fit</p>
        </Col>
      </Row>
      <Row className="text-center">
        <Col md={2}>
        </Col>
            <Col md={4}>
                <Card>
                    <Card.Body>
                        <Card.Title>Physical Fitness</Card.Title>
                        <Card.Text>
                            Stay motivated to achieve your fitness goals by participating in weekly running commitments. Earn rewards for maintaining a consistent workout routine, improving your health and longevity.
                        </Card.Text>
                    </Card.Body>
                </Card>
                <br/>
            </Col>
            <Col md={4}>
                <Card>
                    <Card.Body>
                        <Card.Title>Financial Fitness</Card.Title>
                        <Card.Text>
                            Grow your savings effortlessly as a member. Earn weekly reward amounts for staying committed to your running goals. Enjoy the benefits of compound interest and financial discipline.
                        </Card.Text>
                    </Card.Body>
                </Card>
                <br/>
            </Col>
            <Col md={2}>
            </Col>
        </Row>
    </Container>
  );
};

export default WelcomePage;
