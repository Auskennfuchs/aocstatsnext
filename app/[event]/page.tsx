import React from "react"
import { fetchAocStats, fetchHistoryStats } from "../../api/statApi"
import HomePageView from "../HomePageView"

const EventPage = async ({ params: { event } }: { params: { event: string } }) => {
    const eventYear = Number(event)
    const currentYear = new Date().getFullYear()
    const stats = currentYear === eventYear ? await fetchAocStats(eventYear) : await fetchHistoryStats(eventYear)

    return (
        <HomePageView stats={stats} />
    )
}

export default EventPage

export const dynamic = 'auto',
    revalidate = 900,
    fetchCache = 'force-cache'