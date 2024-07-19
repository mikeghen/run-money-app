import React from 'react';
import { Card } from 'react-bootstrap';
import { Bar } from 'react-chartjs-2';
import stravaPoweredImage from '/strava_powered.png'; // Ensure the path is correct

const ActivityChart = ({ totalDistanceRun, chartData, options }) => (
  <Card className="mb-4">
    <Card.Body>
      <Card.Title>🏅 You ran {totalDistanceRun.toFixed(2)} miles in the last 30 days</Card.Title>
      <div style={{ height: '200px' }}>
        <Bar data={chartData} options={options} />
      </div>
      <div className="mt-3">
        <img 
          src={stravaPoweredImage} 
          alt="Powered by Strava" 
          style={{ height: '40px', opacity: '0.6' }} 
        />
      </div>
    </Card.Body>
  </Card>
);

export default ActivityChart;
