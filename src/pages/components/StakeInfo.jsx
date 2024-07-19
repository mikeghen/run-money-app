import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';

const StakeInfo = ({ userStake, totalEarned }) => (
  <Row className="mb-4">
    <Col>
      <Card className="text-center">
        <Card.Body>
          <Card.Title>Your Stake</Card.Title>
          <Card.Text className="large-text blue-text">{userStake} USDC</Card.Text>
        </Card.Body>
      </Card>
    </Col>
    <Col>
      <Card className="text-center">
        <Card.Body>
          <Card.Title>Your Earnings</Card.Title>
          <Card.Text className="large-text green-text">{totalEarned.toFixed(3)} USDC</Card.Text>
        </Card.Body>
      </Card>
    </Col>
  </Row>
);

export default StakeInfo;
