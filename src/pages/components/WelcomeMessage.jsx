import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';

const WelcomeMessage = ({ athlete }) => (
  <Card className="mb-4">
    <Card.Body>
      <Row>
        <Col>
          <Card.Title className="mb-0 text-right">Welcome back, {athlete.firstname}!</Card.Title>
        </Col>
      </Row>
    </Card.Body>
  </Card>
);

export default WelcomeMessage;
