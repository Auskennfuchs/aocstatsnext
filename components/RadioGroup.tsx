import clsx from "clsx"
import { Fragment, ReactElement } from "react"

type Props<T extends string> = {
    name: string
    options: readonly {
        value: T
        label: string
    }[]
    value?: T
    onChange: (value: T) => void
}

const RadioGroup = <T extends string>({
    name,
    value,
    options,
    onChange,
}: Props<T>): ReactElement => {
    return (
        <div className="border rounded-tr-xl rounded-bl-md border-slate-700 inline-flex flex-nowrap self-center overflow-hidden bg-slate-900">
            {options.map(({ value: optionValue, label }, idx) => (
                <Fragment key={idx}>
                    <input
                        type="radio"
                        id={`${name}_${idx}`}
                        name={name}
                        onChange={() => onChange(optionValue)}
                        checked={optionValue === value}
                        className="hidden"
                    />
                    <label
                        htmlFor={`${name}_${idx}`}
                        className={clsx(
                            "py-2 px-2 text-sm cursor-pointer transition-colors duration-100 border-r border-slate-700 last:border-r-0 font-medium",
                            optionValue === value
                                ? "bg-blue-600 text-white"
                                : "hover:bg-slate-700 text-gray-400",
                        )}
                    >
                        {label}
                    </label>
                </Fragment>
            ))}
        </div>
    )
}

export default RadioGroup
