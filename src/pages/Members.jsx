import React, { useContext, useEffect, useState } from "react";
import { Container, Card, Col, Row, Spinner } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";
import ClubView from "./ClubView.jsx";
import './Members.css';

const Members = () => {
  const { token } = useContext(AuthContext);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const clubId = 1256143;
  const athleteNameToId = {
    "Ben": 52616211,
    "Michael": 40279420,
  };

  useEffect(() => {
    if (token) {
      fetchMembers(token);
    }
  }, [token]);

  const fetchMembers = async (token) => {
    setLoading(true);
    try {
      const response = await fetch(`https://www.strava.com/api/v3/clubs/${clubId}/members`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (Array.isArray(data)) {
        const detailedMembers = await Promise.all(
          data.map(async (member) => {
            const athleteId = athleteNameToId[member.firstname];
            if (athleteId) {
              const detailedMember = await fetchAthleteDetails(token, athleteId);
              return { ...member, ...detailedMember };
            }
            return member;
          })
        );
        setMembers(detailedMembers);
      } else {
        console.error("Expected an array of members");
        setMembers([]);
      }
    } catch (error) {
      console.error("Error fetching members:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAthleteDetails = async (token, athleteId) => {
    try {
      const response = await fetch(`https://www.strava.com/api/v3/athletes/${athleteId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error fetching details for athlete ${athleteId}:`, error);
      return {};
    }
  };

  if (!token) {
    return <p>Please log in to view members.</p>;
  }

  return (
    <Container className="d-flex flex-column justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      {loading ? (
        <Spinner animation="border" />
      ) : (
        <>
          <ClubView accessToken={token} clubId={clubId} />
          <h2 className="mb-4">Club Members</h2>
          <Col className="w-100">
            {members.map((member) => (
              <Card key={member.id} className="mb-4">
                <Card.Body>
                  <Row>
                    <Col md={2}>
                      <img
                        src={member.profile_medium}
                        alt={member.firstname}
                        className="rounded-circle"
                        style={{ width: '50px', height: '50px' }}
                      />
                    </Col>
                    <Col md={10} className="d-flex flex-column justify-content-center">
                      <Card.Title className="mb-0">{member.firstname} {member.lastname}</Card.Title>
                      <Card.Text className="text-muted mb-0">{member.city}, {member.state}</Card.Text>
                      {member.bio && <Card.Text className="text-muted mb-0">{member.bio}</Card.Text>}
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            ))}
          </Col>
        </>
      )}
    </Container>
  );
};

export default Members;
