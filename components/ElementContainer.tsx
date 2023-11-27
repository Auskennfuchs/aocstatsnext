import { FC, PropsWithChildren, forwardRef } from "react"

const ElementContainer = forwardRef<HTMLDivElement, PropsWithChildren>(
    ({ children }, ref) => {
        return (
            <div
                ref={ref}
                className="bg-slate-800 p-4 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700"
            >
                {children}
            </div>
        )
    },
)

export const ModeSwitchContainer: FC<PropsWithChildren> = ({ children }) => (
    <div
        className="inline-flex gap-2 items-center -mr-4 -mt-10"
        style={{ transform: "translateX(1px)" }}
    >
        {children}
    </div>
)

export default ElementContainer
