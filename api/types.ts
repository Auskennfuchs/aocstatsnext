export interface StarDate {
    starTs: number
    starIndex: number
}

export interface Day {
    "1"?: StarDate
    "2"?: StarDate
}

export type CompletionDays = Record<number, Day>

export type Member = {
    localScore: number,
    name: string,
    globalScore: number,
    stars: number,
    lastStarTs: number,
    id: number
    completionDayLevel: CompletionDays
}

export type AoCStats = {
    event: string
    ownerId: number
    members: Member[]
    memberColors: {
        [name: string]: string
    }
    maxDays: number
}

type MemberScore = {
    name: string
    score: number
}

export const calcMemberScores = (members: Member[], day: number, part: keyof Day): Array<MemberScore> => {
    const sm = [...members]
        .filter(m => m.completionDayLevel[day] && m.completionDayLevel[day][part] && m.completionDayLevel[day][part]?.starTs)
        .sort((a, b) => ((a.completionDayLevel[day] || {})[part]?.starTs || 0) - ((b.completionDayLevel[day] || {})[part]?.starTs || 0))
        .map(m => m.name)
    return members.map(({ name, completionDayLevel }) => {
        if (completionDayLevel[day] && completionDayLevel[day][part]) {
            return {
                name, score: members.length - sm.indexOf(name)
            }
        }
        return { name, score: 0 }
    })
}
