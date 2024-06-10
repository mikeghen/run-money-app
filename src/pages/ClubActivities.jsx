import React, { useState, useEffect } from "react";
import { Container, Card, Button, Col, Spinner, Row } from "react-bootstrap";
import { FaStrava } from "react-icons/fa";
import dayjs from 'dayjs';
import { MapContainer, TileLayer, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const clubId = 1256143;
const clientId = "127717";
const clientSecret = "cb49ade5306483c1d1819399df89674fd471d1dc";
const redirectUri = "http://localhost:8080/club-activities";

const ClubActivities = () => {
  const [accessToken, setAccessToken] = useState(localStorage.getItem('strava_access_token'));
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    if (code && !accessToken) {
      fetchAccessToken(code);
    } else if (accessToken) {
      fetchActivities(accessToken);
    }
  }, [accessToken]);

  const fetchAccessToken = async (code) => {
    setLoading(true);
    try {
      const response = await fetch("https://www.strava.com/oauth/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          client_id: clientId,
          client_secret: clientSecret,
          code: code,
          grant_type: "authorization_code",
        }),
      });

      const data = await response.json();
      if (data.access_token) {
        localStorage.setItem('strava_access_token', data.access_token);
        setAccessToken(data.access_token);
      } else {
        console.error("Access token is missing in the response");
      }
    } catch (error) {
      console.error("Error fetching access token:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchActivities = async (token) => {
    setLoading(true);
    try {
      const response = await fetch(`https://www.strava.com/api/v3/clubs/${clubId}/activities`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (Array.isArray(data)) {
        setActivities(data);
      } else {
        console.error("Expected an array of activities");
        setActivities([]);
      }
    } catch (error) {
      console.error("Error fetching activities:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateDaysAgo = (date) => {
    return dayjs().diff(dayjs(date), 'day');
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const polylineDecode = (str, precision) => {
    let index = 0, lat = 0, lng = 0, coordinates = [], shift = 0, result = 0, byte = null, latitude_change, longitude_change,
      factor = Math.pow(10, precision || 5);

    while (index < str.length) {
      byte = null;
      shift = 0;
      result = 0;

      do {
        byte = str.charCodeAt(index++) - 63;
        result |= (byte & 0x1f) << shift;
        shift += 5;
      } while (byte >= 0x20);

      latitude_change = ((result & 1) ? ~(result >> 1) : (result >> 1));
      lat += latitude_change;

      shift = 0;
      result = 0;

      do {
        byte = str.charCodeAt(index++) - 63;
        result |= (byte & 0x1f) << shift;
        shift += 5;
      } while (byte >= 0x20);

      longitude_change = ((result & 1) ? ~(result >> 1) : (result >> 1));
      lng += longitude_change;

      coordinates.push([lat / factor, lng / factor]);
    }

    return coordinates;
  };

  const convertMetersToMiles = (meters) => {
    return meters * 0.000621371;
  };

  const convertMetersPerSecondToMilesPerHour = (mps) => {
    return mps * 2.23694;
  };

  return (
    <Container className="d-flex flex-column justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <h2 className="mb-4">Club Activities</h2>
      {!accessToken ? (
        <Button variant="primary" onClick={() => window.location.href = `https://www.strava.com/oauth/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=read,activity:read_all`}>
          <FaStrava className="me-2" /> Login with Strava
        </Button>
      ) : loading ? (
        <Spinner animation="border" />
      ) : (
        <Col className="w-100">
          {activities.map((activity) => (
            <Card key={activity.id} className="mb-4">
              <Card.Body>
                <Row>
                  <Col md={6} className="d-flex flex-column">
                    <div>
                      <Card.Title className="mb-0">{activity.name}</Card.Title>
                      <Card.Text className="text-muted mb-0">{activity.athlete.firstname} {activity.athlete.lastname}</Card.Text>
                      <Card.Text>
                        <strong>Time:</strong> {formatTime(activity.moving_time)} <br />
                        <strong>Distance:</strong> {convertMetersToMiles(activity.distance).toFixed(2)} miles <br />
                        <strong>Average Pace:</strong> {convertMetersPerSecondToMilesPerHour(activity.average_speed).toFixed(2)} mph <br />
                        <strong>Days Ago:</strong> {calculateDaysAgo(activity.start_date)}
                      </Card.Text>
                    </div>
                  </Col>
                  <Col md={6}>
                    {activity.map && (
                      <MapContainer
                        style={{ height: "100%", width: "100%" }}
                        center={[
                          activity.start_latlng[0],
                          activity.start_latlng[1],
                        ]}
                        zoom={13}
                        scrollWheelZoom={false}
                      >
                        <TileLayer
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />
                        <Polyline positions={polylineDecode(activity.map.summary_polyline)} color="blue" />
                      </MapContainer>
                    )}
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          ))}
        </Col>
      )}
    </Container>
  );
};

export default ClubActivities;
