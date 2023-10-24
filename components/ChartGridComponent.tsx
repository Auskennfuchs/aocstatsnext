"use client"

import React, {
    useCallback,
    useEffect,
    useRef,
    useState,
    PropsWithChildren,
    FC,
} from "react"
import { ChartGridContext } from "../contexts/ChartGridContext"

export const ChartGridComponent: FC<PropsWithChildren> = ({ children }) => {
    const containerRef = useRef<HTMLDivElement>(null)

    const [containerWidth, setContainerWidth] = useState(0)

    useEffect(() => {
        if (containerRef.current) {
            setContainerWidth(
                containerRef.current.getBoundingClientRect().width,
            )
        }
    }, [])

    const onResize = useCallback(() => {
        if (containerRef.current) {
            setContainerWidth(
                containerRef.current.getBoundingClientRect().width,
            )
        }
    }, [])

    useEffect(() => {
        if (containerRef.current) {
            window.addEventListener("resize", onResize)
        }
        ;() => {
            window.removeEventListener("resize", onResize)
        }
    }, [onResize])

    return (
        <div ref={containerRef}>
            <ChartGridContext.Provider value={{ containerWidth }}>
                {children}
            </ChartGridContext.Provider>
        </div>
    )
}
