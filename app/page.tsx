import React from "react"
import { fetchAocStats, fetchHistoryStats } from "../api/statApi"
import HomePageView from "./HomePageView"

const HomePage = async () => {
    const currentYear = new Date().getFullYear()
    const currentMonth = new Date().getMonth()
    const eventYear = currentMonth < 11 ? currentYear - 1 : currentYear
    const stats = currentYear === eventYear || currentMonth < 1 ? await fetchAocStats(`${eventYear}`) : await fetchHistoryStats(`${eventYear}`)

    return (
        <HomePageView stats={stats} />
    )
}

export default HomePage

export const dynamic = 'auto',
    revalidate = 900,
    fetchCache = 'force-cache'