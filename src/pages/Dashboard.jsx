import React, { useState, useEffect, useContext } from 'react';
import { Container, Card, Row, Col, Button, Spinner } from 'react-bootstrap';
import { AuthContext } from "../context/AuthContext";
import './Dashboard.css';
import { differenceInDays, addDays, startOfDay, format } from 'date-fns';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { useAccount, useContractReads } from 'wagmi';
import { ethers } from 'ethers';
import toast from 'react-hot-toast';
import { getAthleteActivities, getAthleteDetails } from '../services/stravaService';
import { powContractConfig } from "../config/contractConfig"; // Importing configurations
import Clubs from './Clubs';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);


const Dashboard = () => {
    const { address: userAddress } = useAccount();
    const { token, setToken } = useContext(AuthContext);
    const [athlete, setAthlete] = useState({});
    const [milesRunData, setMilesRunData] = useState(Array(30).fill(0));
    const [individualStake, setIndividualStake] = useState(0);
    const [totalEarned, setTotalEarned] = useState(0);
    const [totalDistanceRun, setTotalDistanceRun] = useState(0);

    const { data, error, isLoading } = useContractReads({
        contracts: [
            {
                ...powContractConfig,
                functionName: 'individualStake',
            },
            {
                ...powContractConfig,
                functionName: 'yieldAmount',
                args: [userAddress],
            },
            {
                ...powContractConfig,
                functionName: 'rewardAmount',
                args: [userAddress],
            }
        ]
    });

    useEffect(() => {
        if (!isLoading && userAddress) {
            const stakeAmt = data[0].result ? parseFloat(ethers.formatUnits(data[0].result, 6)) : 0;
            const yieldAmt = data[1].result ? parseFloat(ethers.formatUnits(data[1].result, 6)) : 0;
            const bonus = data[2].result ? parseFloat(ethers.formatUnits(data[2].result, 6)) : 0;

            setIndividualStake(stakeAmt);
            setTotalEarned(yieldAmt + bonus);
        }

        if (error) {
            console.error("Error fetching data:", error);
        }
    }, [data, isLoading, userAddress]);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get("code");

        if (code) {
            fetchAccessToken(code)
                .then((token) => {
                    setToken(token);
                    fetchActivities(token);
                    fetchAthleteDetails(token);
                })
                .catch((error) => console.error("Error fetching access token:", error));
        } else if (token) {
            fetchActivities(token);
            fetchAthleteDetails(token);
        }
    }, [token]);

    const fetchActivities = async (token) => {
        try {
            const activities = await getAthleteActivities(token);
            const last30DaysActivities = activities.filter(activity => {
                const activityDate = new Date(activity.start_date);
                return activityDate >= startOfDay(addDays(new Date(), -29)) && activityDate <= new Date();
            });
            const dailyMiles = Array(30).fill(0);
            last30DaysActivities.forEach(activity => {
                const dayIndex = differenceInDays(startOfDay(new Date()), startOfDay(new Date(activity.start_date)));
                dailyMiles[29 - dayIndex] += activity.distance * 0.000621371; // convert meters to miles
            });
            setMilesRunData(dailyMiles);
            setTotalDistanceRun(dailyMiles.reduce((acc, miles) => acc + miles, 0));
        } catch (error) {
            console.error("Error fetching activities:", error);
            toast.error('Error fetching activities.');
        }
    };

    const fetchAthleteDetails = async (token, athleteId) => {
        try {
            const athlete = await getAthleteDetails(token);
            setAthlete(athlete);
            return athlete;
        } catch (error) {
            console.error(`Error fetching details for athlete ${athleteId}:`, error);
            return {};
        }
    };

    const days = Array.from({ length: 30 }, (_, i) =>
        format(addDays(startOfDay(new Date()), i - 29), 'MM/dd'));

    const chartData = {
        labels: days,
        datasets: [
            {
                label: 'Miles Run',
                data: milesRunData,
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: false,
                text: `Miles Run Per Day (Last 30 Days) - Tota`,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    return (
        <Container className="mt-4">
            {!token ? (
                <Button variant="primary" onClick={() => window.location.href = `https://www.strava.com/oauth/authorize?client_id=127717&response_type=code&redirect_uri=${window.location.origin}&scope=read,activity:read_all,profile:read_all`}>
                    Login with Strava
                </Button>
            ) : (
                <>
                    <Card className="mb-4">
                        <Card.Body>
                            <Row>
                                <Col>
                                    <img
                                        src={athlete.profile_medium || "https://dgalywyr863hv.cloudfront.net/pictures/athletes/52616211/31791970/1/large.jpg"}
                                        alt={athlete.firstname}
                                        className="rounded-circle"
                                    />
                                </Col>
                                <Col >
                                    <Card.Title className="mb-0">Welcome back, {athlete.firstname}! </Card.Title>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                    <Row className="mb-4">
                        <Col>
                            <Card className="text-center">
                                <Card.Body>
                                    <Card.Title>Your Stake</Card.Title>
                                    <Card.Text className="large-text blue-text">{individualStake} USDC</Card.Text>
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
                    <Row className="mb-4">
                        <Col>
                            <Card>
                                <Card.Body>
                                    <Card.Title>🏅 You ran {totalDistanceRun.toFixed(2)} miles in the last 30 days</Card.Title>
                                    <div style={{ height: '200px' }}>
                                        <Bar data={chartData} options={options} />
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                    <Row>
                        <Clubs />
                    </Row>
                </>
            )}
        </Container>
    );
};

export default Dashboard;
