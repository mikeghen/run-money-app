import React from 'react';
import { Card } from 'react-bootstrap';
import { Bar } from 'react-chartjs-2';
import { Link } from 'react-router-dom';
import stravaPoweredImage from '/strava_powered.png'; // Ensure the path is correct

const ActivityChart = ({ totalDistanceRun, chartData, options }) => (
  <Card className="mb-4">
    <Card.Body>
      <Card.Title>🏅 You ran {totalDistanceRun.toFixed(2)} miles in the last 30 days</Card.Title>
      <div style={{ height: '200px' }}>
        <Bar data={chartData} options={options} />
      </div>
      <div className="text-right mt-3">
        <img 
          src={stravaPoweredImage} 
          alt="Powered by Strava" 
          style={{ height: '30px' }} 
        /> | <Link to="https://www.strava.com/athlete/training" className="mt-3" style={{color: '#FC4C02'}} target='_blank' >View on Strava</Link>
      </div>
    </Card.Body>
  </Card>
);

export default ActivityChart;
