import React, { useState, useEffect, useContext } from 'react';
import { Container, Card, Row, Col, Button, Spinner, Alert } from 'react-bootstrap';
import { AuthContext } from "../context/AuthContext";
import './Dashboard.css';
import { differenceInDays, format, addDays, startOfDay } from 'date-fns';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { fetchAccessToken } from "../utils/auth";
import { useAccount, useContractReads, useWriteContract, useWaitForTransactionReceipt, useWatchBlockNumber } from 'wagmi';
import { ethers } from 'ethers';
import toast from 'react-hot-toast';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const clientId = "127717";
const contractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

const wagmiContractConfig = {
    address: contractAddress,
    abi: [
        {"type":"function","name":"duration","inputs":[],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},
        {"type":"function","name":"endTime","inputs":[],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},
        {"type":"function","name":"stakes","inputs":[{"name":"_member","type":"address","internalType":"address"}],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},
        {"type":"function","name":"join","inputs":[],"outputs":[],"stateMutability":"payable"},
        {"type":"function","name":"unstake","inputs":[],"outputs":[],"stateMutability":"nonpayable"},
        {"type":"function","name":"individualStake","inputs":[],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},
        {"type":"function","name":"totalStake","inputs":[],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},
        {"type":"function","name":"yieldAmount","inputs":[{"name": "", "type": "address", "internalType": "address"}],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},
        {"type":"function","name":"rewardAmount","inputs":[{"name": "", "type": "address", "internalType": "address"}],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},
    ],
};

const Dashboard = () => {
    const { address: userAddress } = useAccount();
    const { token, setToken } = useContext(AuthContext);
    const [stakedAmount, setStakedAmount] = useState(0);
    const [yieldAmount, setYieldAmount] = useState(0);
    const [bonusReward, setBonusReward] = useState(0);
    const [totalReturn, setTotalReturn] = useState(0);
    const [yieldPercentage, setYieldPercentage] = useState(0);
    const [endTime, setEndTime] = useState(0);
    const [daysUntilUnstakeable, setDaysUntilUnstakeable] = useState(0);
    const [milesRunData, setMilesRunData] = useState(Array(7).fill(0));
    const [duration, setDuration] = useState(0);
    const [individualStaked, setIndividualStaked] = useState(0);
    const [totalStake, setTotalStake] = useState(0);
    const [isStakeLoading, setIsStakeLoading] = useState(false);
    const [isUnstakeLoading, setIsUnstakeLoading] = useState(false);

    const { data, error, isLoading } = useContractReads({
        contracts: [
            {
                ...wagmiContractConfig,
                functionName: 'stakes',
                args: [userAddress],
            },
            {
                ...wagmiContractConfig,
                functionName: 'endTime',
            },
            {
                ...wagmiContractConfig,
                functionName: 'duration',
            },
            {
                ...wagmiContractConfig,
                functionName: 'individualStake',
            },
            {
                ...wagmiContractConfig,
                functionName: 'totalStake',
            },
            {
                ...wagmiContractConfig,
                functionName: 'yieldAmount',
                args: [userAddress],
            },
            {
                ...wagmiContractConfig,
                functionName: 'rewardAmount',
                args: [userAddress],
            },
        ]
    });

    useEffect(() => {
        console.log("data:", data, "isLoading:", isLoading, "userAddress:", userAddress);
        if (!isLoading && userAddress) {
            const staked = data[0] ? parseFloat(ethers.formatUnits(data[0].result, 6)) : 0;
            const endTimestamp = data[1] ? parseInt(data[1].result) * 1000 : 0;
            // const contractDuration = data[2] ? data[2].result / 86400n : 0;
            const stakeAmt = data[3] ? parseFloat(ethers.formatUnits(data[3].result, 6)) : 0;
            const totalStaked = data[4] ? parseFloat(ethers.formatUnits(data[4].result, 6)) : 0;
            const yieldAmt = data[5] ? parseFloat(ethers.formatUnits(data[5].result, 6)) : 0;
            const bonus = data[6] ? parseFloat(ethers.formatUnits(data[6].result, 6)) : 0;

            setStakedAmount(staked);
            setYieldAmount(yieldAmt);
            setBonusReward(bonus);
            setTotalReturn(staked + yieldAmt + bonus);
            setYieldPercentage(staked === 0 ? 0 : ((yieldAmt + bonus) / staked) * 100);
            setEndTime(endTimestamp);
            // setDuration(contractDuration.toString());
            setIndividualStaked(stakeAmt)
            setTotalStake(totalStaked);
            setDaysUntilUnstakeable(differenceInDays(new Date(endTimestamp), new Date()));
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
            toast.error('Error fetching activities.');
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
            console.error("Error unstaking:", error);
            toast.error('Error unstaking.');
        },
    });

    const { isLoading: isStakeConfirming, isSuccess: isStakeConfirmed } = useWaitForTransactionReceipt({
        hash: stakeHash,
    });

    const { isLoading: isUnstakeConfirming, isSuccess: isUnstakeConfirmed } = useWaitForTransactionReceipt({
        hash: unstakeHash
    });

    const handleStake = async () => {
        try {
            setIsStakeLoading(true);
            let tx = await stake({
                ...wagmiContractConfig,
                functionName: 'join',
            });
            console.log("Staked USDC!", tx);
            setStakedAmount(individualStaked);
            toast.success('Staked USDC!');
        } catch (error) {
            console.error("Error staking:", error);
            toast.error('Error staking.');
        } finally {
            setIsStakeLoading(false);
        }
    };

    const handleUnstake = async () => {
        try {
            setIsUnstakeLoading(true);
            await unstake();
            setStakedAmount(0);
            toast.success('Unstaked successfully!');
        } catch (error) {
            console.error("Error unstaking:", error);
            toast.error('Error unstaking.');
        } finally {
            setIsUnstakeLoading(false);
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
                                    {stakedAmount === 0 ? (
                                        <>
                                            <Card.Title>Welcome to Proof of Workout! 🏃‍♂️</Card.Title>
                                            <Card.Text>
                                                To get started, please stake 100 USDC to begin tracking your workouts.
                                            </Card.Text>
                                            <Button variant="primary" onClick={handleStake} disabled={isStakeLoading}>
                                                {isStakeLoading ? <Spinner animation="border" size="sm" /> : 'Stake 100 USDC'}
                                            </Button>
                                            <Card.Text className="mt-2">
                                                The USDC will be staked until the end time set in the contract.
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
                                    <div className="metric d-flex justify-content-between">
                                        <span className="label">Staked:</span>
                                        <span className="value">{stakedAmount.toFixed(3)} USDC</span>
                                    </div>
                                    <div className="metric d-flex justify-content-between">
                                        <span className="label">Yield:</span>
                                        <span className="value">{yieldAmount.toFixed(3)} USDC</span>
                                    </div>
                                    <div className="metric d-flex justify-content-between">
                                        <span className="label">Bonus Reward:</span>
                                        <span className="value">{bonusReward.toFixed(3)} USDC</span>
                                    </div>
                                    <div className="metric d-flex justify-content-between">
                                        <span className="label">Duration:</span>
                                        <span className="value">{daysUntilUnstakeable} days</span>
                                    </div>
                                    <div className="metric d-flex justify-content-between">
                                        <span className="label">Total Staked in Contract:</span>
                                        <span className="value"><strong>{totalReturn.toFixed(3)} USDC</strong></span>
                                    </div>
                                    <div className="metric d-flex justify-content-between">
                                        <span className="label">Earned:</span>
                                        <span className="value text-success"><strong>{(yieldAmount + bonusReward).toFixed(3)} USDC {'('}+ {yieldPercentage.toFixed(2)}% {')'}</strong></span>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                    <Row className="mt-4">
                        <Col>
                            <Button variant="primary" className="w-100" disabled={daysUntilUnstakeable > 0 || isUnstakeLoading}>
                                {isUnstakeLoading ? <Spinner animation="border" size="sm" /> : `Unstake in ${daysUntilUnstakeable} Days`}
                            </Button>
                        </Col>
                    </Row>
                </>
            )}
        </Container>
    );
};

export default Dashboard;
