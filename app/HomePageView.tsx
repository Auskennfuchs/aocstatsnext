"use client"

import { useCallback, useMemo, useState } from "react"
import { AoCStats, Member } from "../api/types"
import ChartGrid from "../components/ChartGrid"
import { ChartGridComponent } from "../components/ChartGridComponent"
import LeaderBoard from "../components/LeaderBoard"
import ScoreLineChart from "../components/charts/ScoreLineChart"
import ScoreTotalChart from "../components/charts/ScoreTotalChart"
import AocContextProvider, {
    AocStatsContext,
} from "../contexts/AocStatsContext"
import ScorePercentageChart from "../components/charts/ScorePercentageChart"
import ScoreStackPartChart from "../components/charts/ScoreStackPartChart"
import Link from "next/link"
import TimeSpentChart from "../components/charts/TimeSpentChart"
import TimeSpentDiffChart from "../components/charts/TimeSpentDiffChart"

type Props = {
    stats: AoCStats
}

const chartComponents = [
    ScoreTotalChart,
    ScorePercentageChart,
    ScoreLineChart,
    ScoreStackPartChart,
    TimeSpentChart,
    TimeSpentDiffChart,
]

const HomePageView = ({ stats }: Props) => {
    const [filteredMembers, setFilteredMembers] = useState<Member[]>([])

    const onSetFilteredMembers = useCallback(
        (ids: number[]) => {
            setFilteredMembers(
                stats.members.filter(({ id }) => ids.includes(id)),
            )
        },
        [stats.members],
    )

    const context = useMemo<AocStatsContext>(
        () => ({
            filteredMembers,
            setFilteredMembers: onSetFilteredMembers,
            stats,
        }),
        [filteredMembers, onSetFilteredMembers, stats],
    )

    const currentYear = new Date().getFullYear()

    const years = [...Array(currentYear - 2019).keys()].map((n) => n + 2020)
    return (
        <>
            <div className="flex gap-2 items-baseline">
                <h1 className="text-4xl font-bold">
                    🎄Advent of Code Statistics {stats.event}
                </h1>
                {years.map((year) => (
                    <Link key={year} href={`/${year}`} className="underline">
                        {year}
                    </Link>
                ))}
            </div>
            <div className="flex flex-col gap-8 my-8">
                <AocContextProvider value={context}>
                    <LeaderBoard />
                    <ChartGrid>
                        {chartComponents.map((Component, idx) => (
                            <ChartGridComponent key={idx}>
                                <Component />
                            </ChartGridComponent>
                        ))}
                    </ChartGrid>
                </AocContextProvider>
            </div>
        </>
    )
}

export default HomePageView
