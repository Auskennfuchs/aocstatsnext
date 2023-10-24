import React, { useMemo } from "react"
import {
    CartesianGrid,
    Label,
    Legend,
    Line,
    LineChart,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts"
import { ScoreTooltip } from "./ScoreTooltip"
import { useMarkedMember } from "./MarkedMember"
import { useAoCStats } from "../../contexts/AocStatsContext"
import { useChartGridContext } from "../../contexts/ChartGridContext"
import { calcMemberTimeElapsed } from "../../api/types"

interface DayScores {
    name: string
    [id: string]: number | string
}

const TimeSpentDiffChart = () => {
    const {
        stats: { members, maxDays, memberColors },
        filteredMembers,
    } = useAoCStats()

    const sortedMembers = useMemo(
        () =>
            [...filteredMembers].sort(
                (a, b) => a.localScore - b.localScore || a.stars - b.stars,
            ),
        [filteredMembers],
    )

    const [markedMember, setMarkedMember, getOpacity] = useMarkedMember()

    const { containerWidth } = useChartGridContext()

    const calcData = useMemo<Array<DayScores>>(() => {
        const ds: Array<DayScores> = []

        for (const idx in [...Array(Number(maxDays)).keys()]) {
            const day = Number(idx) + 1
            const dayScores: DayScores = { name: `Day ${day} ` }
            const memberScoresP1 = calcMemberTimeElapsed(members, day, "1")
            const memberScoresP2 = calcMemberTimeElapsed(members, day, "2")
            sortedMembers.forEach(({ name, completionDayLevel }) => {
                dayScores[name] = 0
                if (!completionDayLevel || !completionDayLevel[day]) {
                    return
                }
                const elapsed2 =
                    memberScoresP2.find((m) => m.name === name)?.score || 0
                const elapsed1 =
                    memberScoresP1.find((m) => m.name === name)?.score || 0
                if (elapsed1 !== 0 && elapsed2 !== 0) {
                    dayScores[name] = elapsed2 - elapsed1
                }
            })

            ds.push(dayScores)
        }
        return ds
    }, [maxDays, members, sortedMembers])

    return (
        <>
            <h3>Time spent between stars</h3>
            <LineChart
                width={containerWidth}
                height={45 * members.length}
                data={calcData}
            >
                <XAxis dataKey="name" />
                <YAxis unit="min" />
                <CartesianGrid strokeDasharray="1 3" />
                <Tooltip content={ScoreTooltip} />
                {sortedMembers.map(({ name }) => (
                    <Line
                        key={name}
                        type="monotone"
                        dataKey={name}
                        stroke={memberColors[name]}
                        fill={memberColors[name]}
                        strokeWidth={markedMember === name ? 2 : 1}
                        strokeOpacity={getOpacity(name)}
                    />
                ))}
                <Legend
                    verticalAlign="top"
                    onMouseEnter={(e) => setMarkedMember(e.dataKey)}
                    onMouseLeave={() => setMarkedMember(undefined)}
                />
            </LineChart>
        </>
    )
}

export default TimeSpentDiffChart
