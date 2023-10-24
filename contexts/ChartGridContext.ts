import { createContext, useContext } from "react"

interface CharGridContextProps {
    containerWidth: number
}

export const ChartGridContext = createContext<CharGridContextProps>({
    containerWidth: 0,
})

export const useChartGridContext = (): CharGridContextProps =>
    useContext(ChartGridContext)
