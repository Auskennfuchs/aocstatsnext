import React, { useMemo } from "react"
import { Cell, Legend, Pie, PieChart } from "recharts"
import { useAoCStats } from "../../contexts/AocStatsContext"
import { useChartGridContext } from "../../contexts/ChartGridContext"
import { useMarkedMember } from "./MarkedMember"

interface MemberScore {
    name: string
    score: number
}

const ScorePercentageChart = () => {
    const {
        stats: { members, memberColors },
        filteredMembers,
    } = useAoCStats()

    const { containerWidth } = useChartGridContext()
    const [, setMarkedMember, getOpacity] = useMarkedMember()

    const calcData = useMemo<Array<MemberScore>>(() => {
        const result = filteredMembers.map(({ name, localScore: score }) => ({
            name,
            score,
        }))
        result.sort((a, b) => a.score - b.score)
        return result
    }, [filteredMembers])

    return (
        <>
            <h3>Total score distribution</h3>
            <div className="flex">
                <PieChart
                    width={containerWidth / 2}
                    height={45 * members.length}
                >
                    <Legend
                        verticalAlign="top"
                        onMouseEnter={(e) => setMarkedMember(e.value)}
                        onMouseLeave={() => setMarkedMember(undefined)}
                    />
                    <Pie
                        dataKey="score"
                        data={calcData}
                        label
                        startAngle={180}
                        endAngle={-180}
                    >
                        {calcData.map(({ name }, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={memberColors[name]}
                                fillOpacity={getOpacity(name)}
                                stroke="#fff"
                            />
                        ))}
                    </Pie>
                </PieChart>
                <PieChart
                    width={containerWidth / 2}
                    height={45 * members.length}
                >
                    <Legend
                        verticalAlign="top"
                        onMouseEnter={(e) => setMarkedMember(e.value)}
                        onMouseLeave={() => setMarkedMember(undefined)}
                    />
                    <Pie
                        dataKey="score"
                        data={calcData}
                        label
                        startAngle={180}
                        endAngle={0}
                    >
                        {calcData.map(({ name }, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={memberColors[name]}
                                fillOpacity={getOpacity(name)}
                                stroke="#fff"
                            />
                        ))}
                    </Pie>
                </PieChart>
            </div>
        </>
    )
}

export default ScorePercentageChart
