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
import ElementContainer from "./ElementContainer"

export const ChartGridComponent: FC<PropsWithChildren> = ({ children }) => {
    const containerRef = useRef<HTMLDivElement>(null)

    const [containerWidth, setContainerWidth] = useState(0)

    useEffect(() => {
        if (!containerRef.current) {
            return
        }
        const { paddingLeft, paddingRight } = getComputedStyle(
            containerRef.current,
        )
        setContainerWidth(
            containerRef.current.clientWidth -
                parseFloat(paddingLeft) -
                parseFloat(paddingRight),
        )
    }, [])

    useEffect(() => {
        const onResize = () => {
            if (containerRef.current) {
                const { paddingLeft, paddingRight } = getComputedStyle(
                    containerRef.current,
                )
                setContainerWidth(
                    containerRef.current.clientWidth -
                        parseFloat(paddingLeft) -
                        parseFloat(paddingRight),
                )
            }
        }
        window.addEventListener("resize", onResize)
        return () => {
            window.removeEventListener("resize", onResize)
        }
    }, [])

    return (
        <ElementContainer ref={containerRef}>
            <ChartGridContext.Provider value={{ containerWidth }}>
                {children}
            </ChartGridContext.Provider>
        </ElementContainer>
    )
}
