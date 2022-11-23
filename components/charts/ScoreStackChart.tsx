import React, { useMemo } from 'react'
import { Area, AreaChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis } from 'recharts'
import { calcMemberScores } from '../../api/types'
import { useAoCStats } from '../../contexts/AocStatsContext'
import { useChartGridContext } from '../../contexts/ChartGridContext'
import { useMarkedMember } from './MarkedMember'
import { ScoreTooltip } from './ScoreTooltip'

interface DayScores {
    name: string
    [id: string]: number | string
}

const ScoreStackChart = () => {

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
                dayScores[name] = day > 2 ? ds[day - 2][name] : 0
                if (!completionDayLevel || !completionDayLevel[day] || day < 2) {
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
            <h3>Total score stacked</h3>
            <AreaChart width={containerWidth} height={45 * members.length} data={calcData}>
                <CartesianGrid strokeDasharray="1 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip content={ScoreTooltip} />
                {sortedMembers.map(({ name }) => (
                    <Area key={name} type="monotone" dataKey={name} stackId="1" stroke={memberColors[name]} fill={memberColors[name]} fillOpacity={markedMember === name ? 0.5 : 0.03} dot
                        strokeWidth={markedMember === name ? 2 : 1} strokeOpacity={getOpacity(name)} />
                ))}
                <Legend verticalAlign="top" onMouseEnter={(e) => setMarkedMember(e.dataKey)} onMouseLeave={() => setMarkedMember(undefined)} />
            </AreaChart>
        </>
    )
}

export default ScoreStackChart