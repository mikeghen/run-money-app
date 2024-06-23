import React, { useState, useEffect, useContext } from 'react';
import { Container, Card, Row, Col, Button, Spinner, Alert } from 'react-bootstrap';
import { AuthContext } from "../context/AuthContext";
import './Dashboard.css';
import { addDays, differenceInDays, startOfDay, format } from 'date-fns';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { fetchAccessToken } from "../utils/auth";
import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { ethers } from 'ethers';
import toast from 'react-hot-toast';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const clientId = "127717";
const contractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

const wagmiContractConfig = {
    address: contractAddress,
    abi: [
        {
            "constant": true,
            "inputs": [
                {
                    "name": "address",
                    "type": "address"
                }
            ],
            "name": "stakedAmount",
            "outputs": [
                {
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "name": "address",
                    "type": "address"
                }
            ],
            "name": "yieldAmount",
            "outputs": [
                {
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "name": "address",
                    "type": "address"
                }
            ],
            "name": "bonusReward",
            "outputs": [
                {
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [],
            "name": "join",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [],
            "name": "unstake",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        }
    ],
};

const Dashboard = () => {
    const { token, setToken } = useContext(AuthContext);
    const [stakedAmount, setStakedAmount] = useState(0);
    const [yieldAmount, setYieldAmount] = useState(0);
    const [bonusReward, setBonusReward] = useState(0);
    const [totalReturn, setTotalReturn] = useState(0);
    const [yieldPercentage, setYieldPercentage] = useState(0);
    const [unstakeDate, setUnstakeDate] = useState(addDays(new Date(), 30));
    const [daysUntilUnstakeable, setDaysUntilUnstakeable] = useState(differenceInDays(unstakeDate, new Date()));
    const [milesRunData, setMilesRunData] = useState(Array(7).fill(0));
    const [hasStaked, setHasStaked] = useState(false);
    const [error, setError] = useState(null);

    const { data: stakedData } = useReadContract({
        ...wagmiContractConfig,
        functionName: 'stakedAmount',
        args: [contractAddress],
    });

    const { data: yieldData } = useReadContract({
        ...wagmiContractConfig,
        functionName: 'yieldAmount',
        args: [contractAddress],
    });

    const { data: bonusData } = useReadContract({
        ...wagmiContractConfig,
        functionName: 'bonusReward',
        args: [contractAddress],
    });

    useEffect(() => {
        const staked = stakedData ? parseFloat(ethers.formatUnits(stakedData, 18)) : 0;
        const yieldAmt = yieldData ? parseFloat(ethers.formatUnits(yieldData, 18)) : 0;
        const bonus = bonusData ? parseFloat(ethers.formatUnits(bonusData, 18)) : 0;

        setStakedAmount(staked);
        setYieldAmount(yieldAmt);
        setBonusReward(bonus);
        setTotalReturn(staked + yieldAmt + bonus);
        setYieldPercentage(staked === 0 ? 0 : ((yieldAmt + bonus) / staked) * 100);
    }, [stakedData, yieldData, bonusData]);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get("code");

        if (code) {
            fetchAccessToken(code)
                .then((token) => {
                    setToken(token);
                    fetchActivities(token);
                })
                .catch((error) => console.error("Error fetching access token:", error));
        } else if (token) {
            fetchActivities(token);
        }
    }, [token]);

    const fetchActivities = async (token) => {
        try {
            const response = await fetch("https://www.strava.com/api/v3/athlete/activities?per_page=30", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 401) {
                console.error("Unauthorized. The access token may have expired.");
                setToken(null);
                return;
            }

            const activities = await response.json();
            const last7DaysActivities = activities.filter(activity => {
                const activityDate = new Date(activity.start_date);
                return activityDate >= startOfDay(addDays(new Date(), -6)) && activityDate <= new Date();
            });
            const dailyMiles = Array(7).fill(0);
            last7DaysActivities.forEach(activity => {
                const dayIndex = differenceInDays(startOfDay(new Date()), startOfDay(new Date(activity.start_date)));
                dailyMiles[6 - dayIndex] += activity.distance * 0.000621371; // convert meters to miles
            });
            setMilesRunData(dailyMiles);
        } catch (error) {
            console.error("Error fetching activities:", error);
        }
    };

    const { writeContractAsync: stake, data: stakeHash, isLoading: isStaking, error: stakeError } = useWriteContract({
        ...wagmiContractConfig,
        functionName: 'join',
    });

    const { writeContractAsync: unstake, data: unstakeHash, isLoading: isUnstaking } = useWriteContract({
        ...wagmiContractConfig,
        functionName: 'unstake',
        onError: (error) => {
            setError(error);
            console.error("Error unstaking:", error);
        },
    });

    const { isLoading: isStakeConfirming, isSuccess: isStakeConfirmed } = useWaitForTransactionReceipt({
        hash: stakeHash,
    });

    const { isLoading: isUnstakeConfirming, isSuccess: isUnstakeConfirmed } = useWaitForTransactionReceipt({
        hash: unstakeHash
    });

    const handleStake = async () => {
        setError(null);
        toast.loading('Staking 100 USDC...');
        console.log("Staking 100 USDC...");
        try {
            let tx = await stake({
                ...wagmiContractConfig,
                functionName: 'join',
            });
            console.log("Staked 100 USDC!", tx);
            setHasStaked(true);
            setStakedAmount(100);
            setUnstakeDate(addDays(new Date(), 30));
            toast.success('Staked 100 USDC!');
        } catch (error) {
            setError(error);
            console.error("Error staking:", error);
            toast.error('Error staking.');
        }
    };

    const handleUnstake = async () => {
        setError(null);
        toast.loading('Unstaking...');
        try {
            await unstake();
            setHasStaked(false);
            toast.success('Unstaked successfully!');
        } catch (error) {
            setError(error);
            console.error("Error unstaking:", error);
            toast.error('Error unstaking.');
        }
    };

    const handleLogin = () => {
        window.location.href = `https://www.strava.com/oauth/authorize?client_id=${clientId}&response_type=code&redirect_uri=${window.location.origin}&scope=read,activity:read_all,profile:read_all`;
    };

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) =>
        format(addDays(startOfDay(new Date()), index - 6), 'E'));

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
                display: true,
                text: 'Miles Run Per Day (Last 7 Days)',
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
            {error && <Alert variant="danger">{error.message}</Alert>}
            {!token ? (
                <Button variant="primary" onClick={handleLogin}>
                    Login with Strava
                </Button>
            ) : (
                <>
                    <Row className="mb-4">
                        <Col>
                            <Card border="success">
                                <Card.Body>
                                    {!hasStaked ? (
                                        <>
                                            <Card.Title>Welcome to Proof of Workout! 🏃‍♂️</Card.Title>
                                            <Card.Text>
                                                To get started, please stake 100 USDC to begin tracking your workouts.
                                            </Card.Text>
                                            <Button variant="primary" onClick={handleStake} disabled={isStaking || isStakeConfirming}>
                                                {isStaking || isStakeConfirming ? <Spinner animation="border" size="sm" /> : 'Stake 100 USDC'}
                                            </Button>
                                            <Card.Text className="mt-2">
                                                The USDC will be staked for 30 days before you can unstake it.
                                            </Card.Text>
                                            {stakeError && <Alert variant="danger">{stakeError.message}</Alert>}
                                        </>
                                    ) : (
                                        <>
                                            <Card.Title>Welcome back, you're on track! ✅</Card.Title>
                                            <Card.Text>
                                                💰 {totalReturn.toFixed(2)} USDC {`(`}+{yieldPercentage.toFixed(2)}{`%)`}
                                            </Card.Text>
                                            <Card.Text>
                                                will unlock in {daysUntilUnstakeable} days
                                            </Card.Text>
                                            <Button variant="primary" onClick={handleUnstake} disabled={isUnstaking || isUnstakeConfirming}>
                                                {isUnstaking || isUnstakeConfirming ? <Spinner animation="border" size="sm" /> : 'Unstake'}
                                            </Button>
                                        </>
                                    )}
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                    <Row className="mb-4">
                        <Col>
                            <Card>
                                <Card.Body>
                                    <Card.Title>Miles Run Per Day</Card.Title>
                                    <div style={{ height: '200px' }}>
                                        <Bar data={chartData} options={options} />
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Card>
                                <Card.Body>
                                    <Card.Title>Staked Funds Breakdown</Card.Title>
                                    <div className="metric d-flex justify-content-between">
                                        <span className="label">Staked:</span>
                                        <span className="value">${stakedAmount.toFixed(2)}</span>
                                    </div>
                                    <div className="metric d-flex justify-content-between">
                                        <span className="label">Yield:</span>
                                        <span className="value">${yieldAmount.toFixed(2)}</span>
                                    </div>
                                    <div className="metric d-flex justify-content-between">
                                        <span className="label">Bonus Reward:</span>
                                        <span className="value">${bonusReward.toFixed(2)}</span>
                                    </div>
                                    <div className="metric d-flex justify-content-between mt-2">
                                        <span className="label">Yield Earned:</span>
                                        <span className="value">{yieldPercentage.toFixed(2)}%</span>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                    <Row className="mt-4">
                        <Col>
                            <Button variant="primary" className="w-100" disabled={!hasStaked || isUnstaking || isUnstakeConfirming}>
                                Unstake in 30 Days
                            </Button>
                        </Col>
                    </Row>
                </>
            )}
        </Container>
    );
};

export default Dashboard;
