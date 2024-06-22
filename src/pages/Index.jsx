import React, { useContext, useEffect, useState } from "react";
import { Container, Card, Button, Col, Spinner, Row } from "react-bootstrap";
import { FaStrava } from "react-icons/fa";
import dayjs from 'dayjs';
import { MapContainer, TileLayer, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { AuthContext } from "../context/AuthContext";
import { fetchAccessToken } from "../utils/auth";

const clientId = "127717";

const Index = () => {
  const { token, setToken } = useContext(AuthContext);
  const [activities, setActivities] = useState([]);
  const [athlete, setAthlete] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    if (code) {
      fetchAccessToken(code)
        .then((token) => {
          setToken(token);
          fetchAthleteAndActivities(token);
        })
        .catch((error) => console.error("Error fetching access token:", error));
    } else if (token) {
      fetchAthleteAndActivities(token);
    }
  }, [token]);

  const fetchAthleteAndActivities = async (token) => {
    setLoading(true);
    try {
      const [athleteResponse, activitiesResponse] = await Promise.all([
        fetch("https://www.strava.com/api/v3/athlete", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
        fetch("https://www.strava.com/api/v3/athlete/activities", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      ]);

      if (athleteResponse.status === 401 || activitiesResponse.status === 401) {
        console.error("Unauthorized. The access token may have expired.");
        setToken(null);
        return;
      }

      const athleteData = await athleteResponse.json();
      const activitiesData = await activitiesResponse.json();

      // if(athleteData.message === "Forbidden") {
      //   console.log("Profile picture is null");
      //   athleteData.profile_medium = "https://dgalywyr863hv.cloudfront.net/pictures/athletes/52616211/31791970/1/large.jpg";
      // }
      // console.log("Fetched athlete data:", athleteData);

      setAthlete(athleteData);
      if (Array.isArray(activitiesData)) {
        setActivities(activitiesData);
      } else {
        console.error("Expected an array of activities");
        setActivities([]);
      }
    } catch (error) {
      console.error("Error fetching athlete data and activities:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => {
    window.location.href = `https://www.strava.com/oauth/authorize?client_id=${clientId}&response_type=code&redirect_uri=${window.location.origin}&scope=read,activity:read_all,profile:read_all`;
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
      <h2 className="mb-4">Your Activities</h2>
      {!token ? (
        <Button variant="primary" onClick={handleLogin}>
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
                  <Col md={6} className="d-flex flex-column order-2 order-md-1">
                    {athlete && athlete.profile_medium && (
                      <div className="d-flex align-items-center mb-3">
                        <img
                          src={athlete.profile_medium}
                          alt="Profile"
                          className="rounded-circle me-3"
                          style={{ width: '50px', height: '50px' }}
                        />
                        <div>
                          <Card.Title className="mb-0">{activity.name}</Card.Title>
                          <Card.Text className="text-muted mb-0">{athlete.firstname} {athlete.lastname}</Card.Text>
                        </div>
                      </div>
                    )}
                    <div>
                      <Card.Text>
                        <strong>Time:</strong> {formatTime(activity.moving_time)} <br />
                        <strong>Distance:</strong> {convertMetersToMiles(activity.distance).toFixed(2)} miles <br />
                        <strong>Average Pace:</strong> {convertMetersPerSecondToMilesPerHour(activity.average_speed).toFixed(2)} mph <br />
                        <strong>Days Ago:</strong> {calculateDaysAgo(activity.start_date)}
                      </Card.Text>
                    </div>
                  </Col>
                  <Col md={6} className="order-1 order-md-2 mb-4 mb-md-0">
                    {activity.map && (
                      <MapContainer
                        style={{ height: "200px", width: "100%" }}
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

export default Index;
