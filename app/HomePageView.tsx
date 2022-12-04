"use client"

import React, { useCallback, useMemo, useState } from 'react'
import { AoCStats, Member } from '../api/types'
import ChartGrid from '../components/ChartGrid'
import { ChartGridComponent } from '../components/ChartGridComponent'
import LeaderBoard from '../components/LeaderBoard'
import ScoreLineChart from '../components/charts/ScoreLineChart'
import ScoreTotalChart from '../components/charts/ScoreTotalChart'
import AocContextProvider, { AocStatsContext } from '../contexts/AocStatsContext'
import ScoreLinePart1Chart from '../components/charts/ScoreLinePart1Chart'
import ScoreLinePart2Chart from '../components/charts/ScoreLinePart2Chart'
import ScorePercentageChart from '../components/charts/ScorePercentageChart'
import ScoreStackChart from '../components/charts/ScoreStackChart'
import ScoreStackPartChart from '../components/charts/ScoreStackPartChart'
import Link from 'next/link'
import TimeSpentChart from '../components/charts/TimeSpentChart'
import TimeSpentDiffChart from '../components/charts/TimeSpentDiffChart'

type Props = {
    stats: AoCStats
}

const chartComponents = [ScoreTotalChart, ScoreStackChart,ScorePercentageChart,ScoreLineChart, ScoreStackPartChart, ScoreLinePart1Chart, ScoreLinePart2Chart, TimeSpentChart, TimeSpentDiffChart ]

const HomePageView = ({ stats }: Props) => {

    const [filteredMembers, setFilteredMembers] = useState<Member[]>([])

    const onSetFilteredMembers = useCallback((ids: number[]) => {
        setFilteredMembers(stats.members.filter(({ id }) => ids.includes(id)))
    }, [stats.members])

    const context = useMemo<AocStatsContext>(() => ({
        filteredMembers,
        setFilteredMembers: onSetFilteredMembers,
        stats,
    }), [filteredMembers, onSetFilteredMembers, stats])

    return (
        <>
            <div className="flex gap-2 items-baseline">
                <h1 className="text-4xl font-bold">Advent of Code Statistics {stats.event}</h1>
                <Link href="/2020" className='underline'>2020</Link>
                <Link href="/2021" className='underline'>2021</Link>
                <Link href="/2022" className='underline'>2022</Link>
            </div>
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
        </>
    )
}

export default HomePageView