import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from "../context/AuthContext";
import { Card, Col, Row, Button, Badge } from 'react-bootstrap';
import { FaLock } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { getClubs } from '../services/stravaService';

const Clubs = () => {
    const { token } = useContext(AuthContext);
    const [clubs, setClubs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchClubs = async () => {
            try {
                const data = await getClubs(token);
                const filteredClubs = data.filter((club) => club.name === "Run Money");
                setClubs(filteredClubs);
                setClubs(data);
            } catch (error) {
                console.error('Failed to fetch clubs', error);
            } finally {
                setLoading(false);
            }
        };

        fetchClubs();
    }, [token]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="clubs">
            <div className="club-list">
                {clubs.map((club) => (
                    <Card key={club.id} className="club-card mb-4">
                        <Row className="no-gutters flex-column-reverse flex-md-row">
                            <Col xs={12} md={8}>
                                <Card.Body>
                                    <Row className="align-items-center">
                                        <Col xs={3} md={3}>
                                            <img
                                                src={club.profile_medium}
                                                alt="Club Profile"
                                                className="rounded-circle"
                                                style={{ width: '100px', height: '100px' }}
                                            />
                                        </Col>
                                        <Col xs={9} md={9}>
                                            <Card.Title className="d-flex align-items-center">
                                                {club.name}
                                                {club.private && <FaLock className="ms-2" />}
                                            </Card.Title>
                                            <Card.Text className="mb-2 text-muted">
                                                {club.member_count} members staking {club.member_count * 50} USDC
                                            </Card.Text>
                                            <div className="club-badges">
                                                <Badge bg="primary" className="badge">
                                                    <span className="badge-icon">🏃‍♂️ </span>
                                                    <span className="badge-text">3.11 miles</span>
                                                </Badge>
                                                &nbsp;
                                                <Badge bg="secondary" className="badge">
                                                    <span className="badge-icon">⏱️ </span>
                                                    <span className="badge-text">7 days</span>
                                                </Badge> 
                                                &nbsp;
                                                <Badge bg="success" className="badge">
                                                    <span className="badge-icon">💸 </span>
                                                    <span className="badge-text">50 USDC</span>
                                                </Badge>
                                            </div>
                                            <Card.Text className="mb-2 text-muted">
                                                <small><i>
                                                    {club.city}, {club.state}
                                                </i></small>
                                            </Card.Text>
                                            <Link to={`/clubs/${club.id}`}>
                                                View Details
                                            </Link>
                                            &nbsp;|&nbsp;
                                            <Link to="https://www.strava.com/clubs/1256143" className="mt-3" style={{color: '#FC4C02'}} target='_blank' >View on Strava</Link>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Col>
                            <Col xs={12} md={4} className="d-flex align-items-center">
                                <img
                                    src={club.cover_photo || 'default-cover-photo.jpg'}
                                    alt="Club Cover"
                                    className="img-fluid w-100"
                                    style={{ objectFit: 'cover', height: '150px' }}
                                />
                            </Col>
                        </Row>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default Clubs;
