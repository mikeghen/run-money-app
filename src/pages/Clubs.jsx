import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from "../context/AuthContext";
import { Card, Col, Row, Button } from 'react-bootstrap';
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
                                        <Col xs={3} md={2}>
                                            <img
                                                src={club.profile_medium}
                                                alt="Club Profile"
                                                className="rounded-circle"
                                                style={{ width: '100px', height: '100px' }}
                                            />
                                        </Col>
                                        <Col xs={9} md={10}>
                                            <Card.Title className="d-flex align-items-center">
                                                {club.name}
                                                {club.private && <FaLock className="ms-2" />}
                                            </Card.Title>
                                            <Card.Text className="mb-2 text-muted">
                                                {club.city}, {club.state}
                                            </Card.Text>
                                            <Card.Text>
                                                This club requires staking 50 USDC for 30 days and running at least 5 miles per week.
                                            </Card.Text>
                                            <Link to={`/clubs/${club.id}`}>
                                                <Button variant="primary">View Club</Button>
                                            </Link>
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
