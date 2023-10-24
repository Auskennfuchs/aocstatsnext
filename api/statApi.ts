import distinctColors from "distinct-colors"
import { AoCStats, CompletionDays, Day, Member, StarDate } from "./types"

const convertToDate = (input: number) =>
    new Date((input as number) * 1000).getTime()

const getElapsedTimeInMinutes = (input: number, day: number, event: number) => {
    var eventDay = Date.UTC(event, 11, day, 5)
    var starDate = convertToDate(input)
    return Number((starDate - eventDay) / 1000 / 60)
}

type DayEntry = {
    star_index: number
    get_star_ts: number
}

const convertDay = (
    input: { 1: DayEntry; 2: DayEntry },
    day: number,
    event: number,
): Day => {
    const result: Partial<Day> = {}
    if (input[1]) {
        result[1] = {
            starIndex: input[1].star_index,
            starTs: convertToDate(input[1].get_star_ts),
            elapsedTime: getElapsedTimeInMinutes(
                input[1].get_star_ts,
                day,
                event,
            ),
        } as StarDate
    }
    if (input[2]) {
        result[2] = {
            starIndex: input[2].star_index,
            starTs: convertToDate(input[2].get_star_ts),
            elapsedTime: getElapsedTimeInMinutes(
                input[2].get_star_ts,
                day,
                event,
            ),
        } as StarDate
    }
    return result
}

const convertMember = (m: any, event: number): Member => {
    const { name, id, stars } = m

    return {
        name,
        id,
        stars,
        localScore: m.local_score,
        globalScore: m.global_score,
        lastStarTs: convertToDate(m.last_star_ts),
        completionDayLevel: Object.keys(m.completion_day_level).reduce(
            (res, cdl) => {
                res[Number(cdl)] = convertDay(
                    m.completion_day_level[Number(cdl)],
                    Number(cdl),
                    event,
                )
                return res
            },
            {} as CompletionDays,
        ),
    }
}

const getMaxDays = (members: Member[]): number =>
    members.reduce((res, cur) => {
        const curMax =
            Object.keys(cur.completionDayLevel)
                .map((k) => Number(k))
                .sort((a, b) => a - b)
                .pop() || 0
        return Math.max(res, curMax)
    }, 0)

const convertStats = (rawData: any, event: number) => {
    const colors = distinctColors({
        count: Object.keys(rawData.members).length,
        chromaMin: 0,
        chromaMax: 85,
        lightMin: 50,
        lightMax: 95,
    }).map((color) => color.css())

    const members = Object.values(rawData.members).map((m) =>
        convertMember(m, event),
    )

    return {
        ownerId: rawData.owner_id,
        event: rawData.event,
        members,
        memberColors: members.reduce((res: any, m: any, idx) => {
            res[m.name] = colors[idx]
            return res
        }, {}) as { [key: string]: string },
        maxDays: getMaxDays(members),
    }
}

export const fetchAocStats = async (event: number): Promise<AoCStats> => {
    try {
        const res = await fetch(
            `https://adventofcode.com/${event}/leaderboard/private/view/${process.env.LEADERBOARD_ID}.json`,
            {
                headers: {
                    Cookie: `session=${process.env.SESSION_ID}`,
                },
                //                cache: "force-cache",
                next: { revalidate: 10 },
            },
        )
        const rawData = await res.json()

        return convertStats(rawData, event)
    } catch (err) {
        console.error("error fetching stat data", err)
        return {
            event,
            members: [],
            memberColors: {},
            ownerId: -1,
            maxDays: 0,
        }
    }
}

export const fetchHistoryStats = async (event: number): Promise<AoCStats> => {
    try {
        const res = require(`../historystats/${event}.json`)
        return convertStats(res, event)
    } catch (err) {
        console.error("error fetching stat data", err)
        return {
            event,
            members: [],
            memberColors: {},
            ownerId: -1,
            maxDays: 0,
        }
    }
}
