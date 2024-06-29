import React, { useEffect, useState, useContext } from "react";
import { Container, Card, Col, Row, Spinner, Button } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";
import './Members.css';

const ClubMembers = ({ clubId }) => {
    const { token } = useContext(AuthContext);
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(false);
    const athleteNameToId = {
        "Ben": 52616211,
        "Mike": 40279420,
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
            console.log("Fetched members:", data);
            if (Array.isArray(data)) {
                const detailedMembers = await Promise.all(
                    data.map(async (member) => {
                        const athleteId = athleteNameToId[member.firstname];
                        if (athleteId) {
                            const detailedMember = await fetchAthleteDetails(token, athleteId);
                            console.log("Fetched details for athlete", detailedMember);
                            return { ...member, ...detailedMember };
                        }
                        member.id = athleteId;
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
            console.log(`Fetched details for athlete ${athleteId}:`, data)
            return data;
        } catch (error) {
            console.error(`Error fetching details for athlete ${athleteId}:`, error);
            return {};
        }
    };

    const handleButtonClick = (memberId) => {
        console.log(`Button clicked for member ${memberId}`);
    };

    return (
        <Container className="d-flex flex-column " style={{ minHeight: '100vh' }}>
            {loading ? (
                <Spinner animation="border" />
            ) : (
                <>
                    <br/>
                    <h2 className="mb-4">Club Members</h2>
                    <Col className="w-100">
                        {members.map((member) => (
                            <Card key={member.id} className="mb-4">
                                <Card.Body>
                                    <Row>
                                        <Col md={2}>
                                            <img
                                                src={member.profile_medium || "https://dgalywyr863hv.cloudfront.net/pictures/athletes/52616211/31791970/1/large.jpg"}
                                                alt={member.firstname}
                                                className="rounded-circle"
                                                style={{ width: '50px', height: '50px' }}
                                            />
                                        </Col>
                                        <Col md={8} className="d-flex flex-column justify-content-center">
                                            <Card.Title className="mb-0"><a href={`https://www.strava.com/athletes/${member.id}`} target="_blank" rel="noopener noreferrer">{member.firstname} {member.lastname}</a></Card.Title>
                                            <Card.Text className="text-muted mb-0">{member.city || "Philadelphia"}, {member.state || "PA"}</Card.Text>
                                            {member.bio && <Card.Text className="text-muted mb-0">{member.bio}</Card.Text>}
                                        </Col>
                                        <Col md={2} className="d-flex align-items-center justify-content-end">
                                            <Button
                                                variant={member.isEnabled ? "warning" : "success"}
                                                disabled={!member.isEnabled}
                                                onClick={() => handleButtonClick(member.id)}
                                            >
                                                {member.isEnabled ? "🚫 Unstaked" : "✅ Staked"}
                                            </Button>
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

export default ClubMembers;

