import { useState } from "react"

type Result = [
    markedMember: string | undefined,
    setMarkedMember: (id: string | undefined) => void,
    getOpacity: (id: string | undefined) => number,
]

export const useMarkedMember = (): Result => {
    const [markedMember, setMarkedMember] = useState<string>()

    const getOpacity = (id: string | undefined) =>
        !markedMember || markedMember === id ? 1 : 0.5

    return [markedMember, setMarkedMember, getOpacity]
}
