import { createContext, PropsWithChildren, useContext } from "react"
import { AoCStats, Member } from "../api/types"

export type AocStatsContext = {
    stats: AoCStats
    filteredMembers: Member[]
    setFilteredMembers: (members: number[]) => void
}

const aocStatsContext = createContext<AocStatsContext>({
    stats: {
        event: -1,
        maxDays: 0,
        memberColors: {},
        members: [],
        ownerId: -1,
    },
    filteredMembers: [],
    setFilteredMembers: () => null,
})

export const useAoCStats = () => useContext(aocStatsContext)

const AocContextProvider = aocStatsContext.Provider

export default AocContextProvider
