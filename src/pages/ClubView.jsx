import React, { useState, useEffect, useContext } from "react";
import { Card, Col, Row, Spinner, Button, Badge } from "react-bootstrap";
import { FaLock } from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";
import { useParams } from "react-router-dom";
import ClubMembers from "./ClubMembers";
import RunMoneyMetrics from './RunMoneyMetrics';
import { differenceInDays, format, addDays, startOfDay, set } from 'date-fns';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { useAccount, useContractReads, useWaitForTransactionReceipt } from 'wagmi';
import { useWriteContracts } from 'wagmi/experimental';
import { ethers } from 'ethers';
import toast from 'react-hot-toast';
import { getClubDetails, getAthleteActivities } from "../services/stravaService"; // Importing the activity fetching function
import { powAddress, usdcAddress, powContractConfig, usdcContractConfig } from "../config/contractConfig"; // Importing configurations

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ClubView = () => {
    const { id } = useParams();
    const { token, setToken } = useContext(AuthContext);
    const { address: userAddress } = useAccount();
    const [clubInfo, setClubInfo] = useState(null);
    const [loading, setLoading] = useState(false);
    const [athleteId, setAthleteId] = useState(null);
    const [balance, setBalance] = useState(0);
    const [requiredDistance, setRequiredDistance] = useState(5000);
    const [stakedAmount, setStakedAmount] = useState(0);
    const [yieldAmount, setYieldAmount] = useState(0);
    const [bonusReward, setBonusReward] = useState(0);
    const [totalReturn, setTotalReturn] = useState(0);
    const [totalStake, setTotalStake] = useState(0);
    const [yieldPercentage, setYieldPercentage] = useState(0);
    const [individualStaked, setIndividualStaked] = useState(0);
    const [endTime, setEndTime] = useState(0);
    const [daysUntilUnstakeable, setDaysUntilUnstakeable] = useState(0);
    const [milesRunData, setMilesRunData] = useState(Array(7).fill(0));
    const [isStakeLoading, setIsStakeLoading] = useState(false);
    const [isUnstakeLoading, setIsUnstakeLoading] = useState(false);

    const { data, error, isLoading } = useContractReads({
        contracts: [
            {
                ...powContractConfig,
                functionName: 'stakes',
                args: [userAddress],
            },
            {
                ...powContractConfig,
                functionName: 'endTime',
            },
            {
                ...powContractConfig,
                functionName: 'duration',
            },
            {
                ...powContractConfig,
                functionName: 'individualStake',
            },
            {
                ...powContractConfig,
                functionName: 'totalStake',
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
            },
            {
                ...usdcContractConfig,
                functionName: 'allowance',
                args: [userAddress, powAddress],
            },
            {
                ...usdcContractConfig,
                functionName: 'balanceOf',
                args: [userAddress],
            },
            {
                ...powContractConfig,
                functionName: 'requiredDistance',
            }
        ]
    });

    useEffect(() => {
        if (token) {
            fetchClubInfo(token);
            fetchActivities(token); // Fetch activities when token is available
        }
    }, [token]);

    useEffect(() => {
        if (!isLoading && userAddress) {
          console.log("Data:", data)
            const staked = data[0].result ? parseFloat(ethers.formatUnits(data[0].result, 6)) : 0;
            const endTimestamp = data[1].result ? parseInt(data[1].result) * 1000 : 0;
            const stakeAmt = data[3].result ? parseFloat(ethers.formatUnits(data[3].result, 6)) : 0;
            const totalStaked = data[4].result ? parseFloat(ethers.formatUnits(data[4].result, 6)) : 0;
            const yieldAmt = data[5].result ? parseFloat(ethers.formatUnits(data[5].result, 6)) : 0;
            const bonus = data[6].result ? parseFloat(ethers.formatUnits(data[6].result, 6)) : 0;

            setStakedAmount(staked);
            setTotalReturn(staked + yieldAmt + bonus);
            setYieldPercentage(staked === 0 ? 0 : ((yieldAmt + bonus) / staked) * 100);
            setEndTime(endTimestamp);
            setIndividualStaked(stakeAmt);
            setTotalStake(totalStaked);
            setYieldAmount(yieldAmt);
            setBonusReward(bonus);
            console.log("End time:", endTimestamp);
            setDaysUntilUnstakeable(differenceInDays(new Date(endTimestamp), new Date()));
            setBalance(data[8].result ? parseFloat(ethers.formatUnits(data[8].result, 6)) : 0);
            setRequiredDistance(data[9].result ? parseInt(data[9].result) * 0.000621371 *1000 : 0);
        }

        if (error) {
            console.error("Error fetching data:", error);
        }
    }, [data, isLoading, userAddress]);

    const fetchClubInfo = async (token) => {
        setLoading(true);
        try {
            const data = await getClubDetails(id, token);
            setClubInfo(data);
        } catch (error) {
            console.error("Error fetching club info:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchActivities = async (token) => {
        try {
            const activities = await getAthleteActivities(token);
            console.log("Fetched activities:", activities);
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
            setAthleteId(activities[0].athlete.id);
            console.log(athleteId);
        } catch (error) {
            console.error("Error fetching activities:", error);
            // toast.error('Error fetching activities.');
        }
    };

    const { writeContractsAsync: approveAndJoin, data: stakeHash, isLoading: isStaking, error: stakeError } = useWriteContracts();

    const { writeContractsAsync: unstake, data: unstakeHash, isLoading: isUnstaking, error: unstakeError } = useWriteContracts();

    const { isLoading: isStakeConfirming, isSuccess: isStakeConfirmed } = useWaitForTransactionReceipt({
        hash: stakeHash,
    });

    const { isLoading: isUnstakeConfirming, isSuccess: isUnstakeConfirmed } = useWaitForTransactionReceipt({
        hash: unstakeHash
    });

    const handleStake = async () => {
        try {
            setIsStakeLoading(true);
            let tx = await approveAndJoin({
                contracts: [ 
                    { 
                      ...usdcContractConfig, 
                      functionName: "approve", 
                      args: [powAddress, "50000000"], 
                    }, 
                    { 
                      ...powContractConfig,
                      functionName: "join", 
                      args: [141198147],
                    } 
                ], 
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
            let tx = await unstake({
                contracts: [ 
                    { 
                      ...powContractConfig,
                      functionName: "claim", 
                      args: [],
                    } 
                ], 
            });
            console.log("Unstaked successfully!", tx);
            setStakedAmount(0);
            toast.success('Unstaked successfully!');
        } catch (error) {
            console.error("Error unstaking:", error);
            toast.error('Error unstaking.');
        } finally {
            setIsUnstakeLoading(false);
        }
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
            },
        },
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    return (
        <div className="mb-4 w-100">
            {loading ? (
                <Spinner animation="border" />
            ) : (
                clubInfo && (
                    <>
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
                                                    {clubInfo.member_count} members staking {totalStake} USDC
                                                </Card.Text>
                                                <div className="club-badges">
                                                  <Badge bg="success" className="badge">
                                                      <span className="badge-icon">💸 </span>
                                                      <span className="badge-text">50 USDC</span>
                                                  </Badge>
                                                  &nbsp;
                                                  <Badge bg="primary" className="badge">
                                                      <span className="badge-icon">🏃‍♂️ </span>
                                                      <span className="badge-text">3.11 mi/wk</span>
                                                  </Badge>
                                                  &nbsp;
                                                  <Badge bg="secondary" className="badge">
                                                      <span className="badge-icon">⏱️ </span>
                                                      <span className="badge-text">30 days</span>
                                                  </Badge> 
                                                  &nbsp;
                                                </div>
                                                <Card.Text className="mb-2 text-muted">
                                                    {clubInfo.city}, {clubInfo.state}
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

                        <Row className="mt-4">
                            <Col>
                                <Card border="success">
                                    <Card.Body>
                                        {stakedAmount === 0 ? (
                                            <>
                                                <Card.Title>Welcome to the Run Money Club Wallet! 🏃💰</Card.Title>
                                                <Card.Text>
                                                    Stake 50 USDC to join the club and earn rewards on top of yield for being a consistent runner.
                                                </Card.Text>
                                                <Card.Text className="mt-2">
                                                    For this club, you must run <strong>{requiredDistance.toFixed(2)} miles per week for {daysUntilUnstakeable + 1} days</strong> or you will lose your stake.
                                                </Card.Text>
                                                <Button variant="primary" className="w-100" onClick={handleStake} disabled={isStakeLoading}>
                                                    {isStakeLoading ? <Spinner animation="border" size="sm" /> : 'Stake'}
                                                </Button>
                                                <Card.Text className="mt-2">
                                                    <small>You have <i>{balance.toFixed(3)} USDC</i> available.</small>
                                                </Card.Text>
                                                <Card.Text className="mt-2">
                                                    <small>The USDC will be staked and earn variable APY from <a href="#">Compound Finance.</a></small>
                                            </Card.Text>
                                            </>
                                        ) : (
                                            <>
                                                <Card.Title>Welcome back, you're on track! ✅</Card.Title>
                                                <Card.Text>
                                                    {daysUntilUnstakeable > 0 ? (
                                                        <>
                                                            💰 {totalReturn.toFixed(2)} USDC {`(`}+{yieldPercentage.toFixed(2)}{`%)`} will unlock in {daysUntilUnstakeable} days
                                                        </>
                                                    ) : (
                                                        <>
                                                            💰 {totalReturn.toFixed(2)} USDC {`(`}+{yieldPercentage.toFixed(2)}{`%)`} unlocked!
                                                        </>
                                                    )}
                                                </Card.Text>
                                                <Button variant="primary" className="w-100" disabled={daysUntilUnstakeable > 0 || isUnstakeLoading} onClick={handleUnstake}>
                                                    {isUnstakeLoading ? <Spinner animation="border" size="sm" /> : daysUntilUnstakeable > 0 ? `Unstake in ${daysUntilUnstakeable} Days` : 'Unstake'}
                                                </Button>
                                            </>
                                        )}
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>

                        <Row className="mt-4">
                            <Col>
                                <Card>
                                    <Card.Body>
                                        <Card.Title>🏅 {milesRunData.reduce((a, b) => a + b, 0).toFixed(2)} Miles This Week (Top 10%)</Card.Title>
                                        <div style={{ height: '200px' }}>
                                            <Bar data={chartData} options={options} />
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>

                        <Row className="mt-4">
                            <Col>
                                <RunMoneyMetrics
                                    stakedAmount={stakedAmount}
                                    yieldAmount={yieldAmount}
                                    bonusReward={bonusReward}
                                    totalReturn={totalReturn}
                                    yieldPercentage={yieldPercentage}
                                    daysUntilUnstakeable={daysUntilUnstakeable}
                                />
                            </Col>
                        </Row>

                        <ClubMembers clubId={id} /> {/* Add the ClubMembers component */}
                    </>
                )
            )}
        </div>
    );
};

export default ClubView;
