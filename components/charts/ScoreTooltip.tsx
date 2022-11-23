"use client"

import React from "react"
import { TooltipProps } from "recharts"

interface DayScores {
    name: string
    [id: string]: number | string
}

export const ScoreTooltip = ({ active, label, payload }: TooltipProps<any, any>) => {
    /*    if (!active) {
            return null
        }*/

    const memberList = [...(payload || [])].sort((a, b) => (Number(b.payload[b.dataKey!]) - Number(a.payload[a.dataKey!])))
    return (
        <div className="bg-slate-800 p-1 rounded-sm border-gray-400 border flex flex-col" >
            <span className="font-bold text-white">{label}</span>
            {memberList.map(p => (
                <span key={p.dataKey} style={{ color: p.color }}>{`${p.dataKey}: ${p.payload[p.dataKey!]}`}</span>
            ))}
        </div>
    )
}
