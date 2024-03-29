import React, { PropsWithChildren } from "react"

const ChartGrid = ({ children }: PropsWithChildren) => {
    return (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">{children}</div>
    )
}

export default ChartGrid
