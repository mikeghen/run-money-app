import React, { useState, useEffect } from "react";
import { Card, Col, Row, Spinner, Button } from "react-bootstrap";
import { FaEdit, FaLock } from "react-icons/fa";

const ClubView = ({ accessToken, clubId }) => {
  const [clubInfo, setClubInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (accessToken) {
      fetchClubInfo(accessToken);
    }
  }, [accessToken]);

  const fetchClubInfo = async (token) => {
    setLoading(true);
    try {
      const response = await fetch(`https://www.strava.com/api/v3/clubs/${clubId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      setClubInfo(data);
    } catch (error) {
      console.error("Error fetching club info:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-4 w-100">
      {loading ? (
        <Spinner animation="border" />
      ) : (
        clubInfo && (
          <Card>
            <Row className="no-gutters flex-column-reverse flex-md-row">
              <Col xs={12} md={8}>
                <Card.Body>
                  <Row className="align-items-center">
                    <Col xs={3} md={2}>
                      <img
                        src={clubInfo.profile}
                        alt="Club Profile"
                        className="rounded-circle"
                        style={{ width: '100px', height: '100px' }}
                      />
                    </Col>
                    <Col xs={9} md={10}>
                      <Card.Title className="d-flex align-items-center">
                        {clubInfo.name}
                        {clubInfo.private && <FaLock className="ms-2" />}
                      </Card.Title>
                      <Card.Text className="mb-2 text-muted">
                        {clubInfo.city}, {clubInfo.state}
                      </Card.Text>
                      <Card.Text>
                        {clubInfo.description}
                      </Card.Text>
                    </Col>
                  </Row>
                </Card.Body>
              </Col>
              <Col xs={12} md={4} className="d-flex align-items-center">
                <img
                  src={clubInfo.cover_photo}
                  alt="Club Cover"
                  className="img-fluid w-100"
                  style={{ objectFit: 'cover', height: '150px' }}
                />
              </Col>
            </Row>
          </Card>
        )
      )}
    </div>
  );
};

export default ClubView;
