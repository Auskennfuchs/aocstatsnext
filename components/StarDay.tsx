import React, { useMemo } from "react"
import { CompletionDays } from "../api/types"
import {
    faStar as faStarEmpty,
    faStarHalfStroke,
} from "@fortawesome/free-regular-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faStar } from "@fortawesome/free-solid-svg-icons"

type Props = {
    days: CompletionDays
    maxDays: number
}

const StarTypes = {
    Empty: faStarEmpty,
    Half: faStarHalfStroke,
    Full: faStar,
}

const StarColors = {
    Empty: "text-gray-500",
    Half: "text-orange-400",
    Full: "text-yellow-400",
}

const StarIcon = ({ starType }: { starType: keyof typeof StarTypes }) => (
    <FontAwesomeIcon
        icon={StarTypes[starType]}
        className={StarColors[starType]}
    />
)

const StarDay = ({ maxDays, days }: Props) => {
    const starDays = useMemo<Array<keyof typeof StarTypes>>(() => {
        return [...Array(maxDays).keys()].map((day) => {
            const curDay = days[day + 1]
            if (!curDay) {
                return "Empty"
            }
            if (curDay[1] && curDay[2]) {
                return "Full"
            }
            return "Half"
        })
    }, [days, maxDays])

    return (
        <div className="flex gap-1 flex-nowrap">
            {starDays.map((star, idx) => (
                <StarIcon key={idx} starType={star} />
            ))}
        </div>
    )
}

export default StarDay
