import React from 'react';
import { Card, Table } from 'react-bootstrap';

const RunMoneyMetrics = ({ stakedAmount, yieldAmount, bonusReward, totalReturn, yieldPercentage, daysUntilUnstakeable }) => {
    return (

                <Table bordered size="sm">
                    <tbody>
                        <tr>
                            <td className=""><strong>Staked</strong></td>
                            <td className="text-end">{stakedAmount.toFixed(3)} USDC</td>
                        </tr>
                        <tr>
                        <td className=""><strong>Yield</strong></td>
                        <td className="text-end">{yieldAmount.toFixed(3)} USDC</td>
                        </tr>
                        <tr>
                            <td><strong>Bonus Reward</strong></td>
                            <td className="text-end">{bonusReward.toFixed(3)} USDC</td>
                        </tr>
                        <tr>
                            <td><strong>Unstake in</strong></td>
                            <td className="text-end">{daysUntilUnstakeable} days</td>
                        </tr>
                        <tr>
                            <td><strong>Your Run Money</strong></td>
                            <td className="text-end text-success"><strong>{(stakedAmount + yieldAmount + bonusReward).toFixed(3)} USDC {'('}+ {yieldPercentage.toFixed(2)}% {')'}</strong></td>
                        </tr>
                    </tbody>
                </Table>

    );
};

export default RunMoneyMetrics;
