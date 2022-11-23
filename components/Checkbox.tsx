import React, { ChangeEventHandler } from 'react'

type Props = {
    id?: string
    name?: string
    checked?: boolean
    onChange?: ChangeEventHandler<HTMLInputElement>
}

const Checkbox = ({ id, name, checked, onChange }: Props) => {
    return (
        <input
            type="checkbox"
            id={id}
            name={name || id}
            checked={checked}
            onChange={onChange}
            className='w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600' />
    )
}

export default Checkbox