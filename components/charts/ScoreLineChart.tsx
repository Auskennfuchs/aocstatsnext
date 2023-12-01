import React, { useMemo, useState } from "react"
import {
    CartesianGrid,
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
import { MemberScore, calcMemberScores } from "../../api/types"
import RadioGroup from "../RadioGroup"
import { ModeSwitchContainer } from "../ElementContainer"

interface DayScores {
    name: string
    [id: string]: number | string
}

const viewOptions = [
    { value: "total", label: "total" },
    { value: "part1", label: "part 1" },
    { value: "part2", label: "part 2" },
] as const

type ViewOptionsValues = (typeof viewOptions)[number]["value"]

const ScoreLineChart = () => {
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

    const [mode, setMode] = useState<ViewOptionsValues>("total")

    const calcData = useMemo<Array<DayScores>>(() => {
        const ds: Array<DayScores> = []

        const calcModeDayScore = (
            name: string,
            memberScoresP1: MemberScore[],
            memberScoresP2: MemberScore[],
        ) => {
            switch (mode) {
                case "total":
                    return (
                        (memberScoresP1.find((m) => m.name === name)?.score ||
                            0) +
                        (memberScoresP2.find((m) => m.name === name)?.score ||
                            0)
                    )
                case "part1":
                    return (
                        memberScoresP1.find((m) => m.name === name)?.score || 0
                    )
                case "part2":
                    return (
                        memberScoresP2.find((m) => m.name === name)?.score || 0
                    )
            }
        }

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
                dayScores[name] = calcModeDayScore(
                    name,
                    memberScoresP1,
                    memberScoresP2,
                )
            })

            ds.push(dayScores)
        }
        return ds
    }, [maxDays, members, sortedMembers, mode])

    return (
        <>
            <div className="flex gap-8 justify-between">
                <h3>Scores per day</h3>
                <ModeSwitchContainer>
                    <RadioGroup
                        name="chkScorePerDay"
                        options={viewOptions}
                        value={mode}
                        onChange={setMode}
                    />
                </ModeSwitchContainer>
            </div>
            <LineChart
                width={containerWidth}
                height={45 * members.length}
                data={calcData}
            >
                <XAxis dataKey="name" />
                <YAxis />
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

export default ScoreLineChart
