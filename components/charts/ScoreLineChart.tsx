import React, { useMemo } from 'react'
import { CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts'
import { ScoreTooltip } from './ScoreTooltip'
import { useMarkedMember } from './MarkedMember'
import { useAoCStats } from '../../contexts/AocStatsContext'
import { useChartGridContext } from '../../contexts/ChartGridContext'
import { calcMemberScores } from '../../api/types'

interface DayScores {
    name: string
    [id: string]: number | string
}

const ScoreLineChart = () => {

    const { stats: { members, maxDays, memberColors }, filteredMembers } = useAoCStats()

    const sortedMembers = useMemo(() => [...filteredMembers].sort((a, b) => a.localScore - b.localScore || a.stars - b.stars), [filteredMembers])

    const [markedMember, setMarkedMember, getOpacity] = useMarkedMember()

    const { containerWidth } = useChartGridContext()

    const calcData = useMemo<Array<DayScores>>(() => {
        const ds: Array<DayScores> = []

        for (const idx in [...Array(Number(maxDays)).keys()]) {
            const day = Number(idx) + 1
            const dayScores: DayScores = { name: `Day ${day} ` }
            const memberScoresP1 = calcMemberScores(members, day, "1")
            const memberScoresP2 = calcMemberScores(members, day, "2")
            sortedMembers.forEach(({ name, completionDayLevel }) => {
                dayScores[name] = 0
                if (!completionDayLevel || !completionDayLevel[day]) {
                    return
                }
                dayScores[name] = Number(dayScores[name]) + (memberScoresP1.find(m => m.name === name)?.score || 0) + (memberScoresP2.find(m => m.name === name)?.score || 0)
            })

            ds.push(dayScores)
        }
        return ds
    }, [maxDays, members, sortedMembers])

    return (
        <>
            <h3>Scores per day</h3>
            <LineChart width={containerWidth} height={45 * members.length} data={calcData}>
                <XAxis dataKey="name" />
                <YAxis />
                <CartesianGrid strokeDasharray="1 3" />
                <Tooltip content={ScoreTooltip} />
                {sortedMembers.map(({ name }) => (
                    <Line key={name} type="monotone" dataKey={name} stroke={memberColors[name]} fill={memberColors[name]} strokeWidth={markedMember === name ? 2 : 1}
                        strokeOpacity={getOpacity(name)} />
                ))}
                <Legend verticalAlign="top" onMouseEnter={(e) => setMarkedMember(e.dataKey)} onMouseLeave={() => setMarkedMember(undefined)} />
            </LineChart>
        </>
    )
}

export default ScoreLineChart