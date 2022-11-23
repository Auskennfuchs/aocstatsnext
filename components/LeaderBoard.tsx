"use client"

import React, { FC, PropsWithChildren, useEffect, useMemo } from 'react'
import { AoCStats, Member } from '../api/types'
import cx from 'clsx'
import StarDay from './StarDay'
import { MouseEventHandler } from 'react'
import { ReactNode } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSort, faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react'
import Checkbox from './Checkbox'
import { useAoCStats } from '../contexts/AocStatsContext'

type Props = {
    data: AoCStats
}

const DataTable: FC<PropsWithChildren> = ({ children }) => (
    <table className='border-separate border-spacing-0'>
        {children}
    </table>
)

const DataTableHeader: FC<PropsWithChildren> = ({ children }) => (
    <thead>
        <tr className={cx('bg-slate-800')}>
            {children}
        </tr>
    </thead>
)

type DataTableHeaderCellProps = {
    align?: 'right'
    onClick?: MouseEventHandler<HTMLTableCellElement>
    className?: string
}

const DataTableHeaderCell: FC<PropsWithChildren<DataTableHeaderCellProps>> = ({ className, children, onClick }) => (
    <th className={cx('px-4 py-2', className)} onClick={onClick}>
        {children}
    </th>
)

const DataTableBody: FC<PropsWithChildren> = ({ children }) => (
    <tbody>
        {children}
    </tbody>
)

const DataTableCell: FC<PropsWithChildren<DataTableHeaderCellProps>> = ({ children, align }) => (
    <td className={cx('px-4', align === 'right' ? 'text-right' : null)} >
        {children}
    </td >
)

const SortHeaderCell = <T extends string>({ label, sortField, sortMode, sortDirection, onSort }: { label: ReactNode, sortField: T, sortMode?: string, sortDirection?: 'ASC' | 'DESC', onSort: (field: T) => void }) => {
    let sortIcon = faSort
    if (sortField === sortMode) {
        sortIcon = sortDirection === 'ASC' ? faSortUp : faSortDown
    }
    return (
        <DataTableHeaderCell onClick={() => onSort(sortField)} className="cursor-pointer hover:bg-slate-600">
            <div className="flex justify-between gap-2 items-center">
                <span>{label}</span>
                <FontAwesomeIcon icon={sortIcon} />
            </div>
        </DataTableHeaderCell >
    )
}

type SortConfig = {
    field: keyof Member
    defaultDirection: 'ASC' | 'DESC'
}

const LeaderBoard = () => {

    const { filteredMembers, setFilteredMembers, stats: { members, memberColors, maxDays } } = useAoCStats()

    const sortFields = useMemo<Record<'name' | 'stars' | 'score' | 'globalScore', SortConfig>>(() => ({
        'name': { field: "name", defaultDirection: 'ASC' },
        'stars': { field: "stars", defaultDirection: 'DESC' },
        'score': { field: "localScore", defaultDirection: 'DESC' },
        'globalScore': { field: "globalScore", defaultDirection: 'DESC' },
    }), [])

    const [sortMode, setSortMode] = useState<keyof typeof sortFields>('name')
    const [sortDirection, setSortDirection] = useState<'ASC' | 'DESC'>('ASC')

    useEffect(() => {
        setFilteredMembers(members.map(({ id }) => id))
    }, [members, setFilteredMembers])

    const memberData = useMemo(() => {
        const tmp = [...members]
        return tmp.sort((a, b) => {
            const sort = sortFields[sortMode]
            const sf = sort.field
            if (typeof a[sf] === "number") {
                switch (sortDirection) {
                    case 'ASC':
                        return (a[sf] as number) - (b[sf] as number)
                    case 'DESC':
                        return (b[sf] as number) - (a[sf] as number)
                    default:
                        return -1
                }
            }
            if (typeof a[sf] === "string") {
                switch (sortDirection) {
                    case 'ASC':
                        return (a[sf] as string).localeCompare(b[sf] as string)
                    case 'DESC':
                        return (b[sf] as string).localeCompare(a[sf] as string)
                    default:
                        return -1
                }
            }
            return -1

        })
    }, [members, sortFields, sortDirection, sortMode])

    const onSort = (field: keyof typeof sortFields) => {
        if (field === sortMode) {
            setSortDirection(cur => cur === 'ASC' ? 'DESC' : 'ASC')
        } else {
            setSortMode(field)
            setSortDirection(sortFields[field].defaultDirection)
        }
    }

    const onToggleAll = () => {
        if (filteredMembers.length === members.length) {
            setFilteredMembers([])
        } else {
            setFilteredMembers(members.map(m => m.id))
        }
    }

    const onCheckMember = (id: number) => {
        if (filteredMembers.some(m => m.id === id)) {
            setFilteredMembers(filteredMembers
                .filter(c => c.id !== id)
                .map(m => m.id))
        } else {
            setFilteredMembers([...filteredMembers.map(m => m.id), id])
        }
    }

    return (
        <DataTable>
            <DataTableHeader>
                <DataTableHeaderCell>
                    <Checkbox onChange={onToggleAll} checked={filteredMembers.length === members.length} />
                </DataTableHeaderCell>
                <SortHeaderCell label="Name" sortField='name' sortMode={sortMode} sortDirection={sortDirection} onSort={onSort} />
                <SortHeaderCell label="Stars" sortField='stars' sortMode={sortMode} sortDirection={sortDirection} onSort={onSort} />
                <SortHeaderCell label="Score" sortField='score' sortMode={sortMode} sortDirection={sortDirection} onSort={onSort} />
                <SortHeaderCell label="Global Score" sortField='globalScore' sortMode={sortMode} sortDirection={sortDirection} onSort={onSort} />
                <SortHeaderCell label="Days" sortField='stars' sortMode={sortMode} sortDirection={sortDirection} onSort={onSort} />
            </DataTableHeader>
            <DataTableBody>
                {memberData.map(({ id, name, stars, localScore, globalScore, completionDayLevel }) => (
                    <tr key={id}>
                        <DataTableCell>
                            <Checkbox checked={filteredMembers.some(m => m.id === id)} onChange={() => onCheckMember(id)} />
                        </DataTableCell>
                        <DataTableCell><span style={{ color: memberColors[name] }}>{name}</span></DataTableCell>
                        <DataTableCell align='right'>{stars}</DataTableCell>
                        <DataTableCell align='right'>{localScore}</DataTableCell>
                        <DataTableCell align='right'>{globalScore}</DataTableCell>
                        <DataTableCell>
                            <StarDay days={completionDayLevel} maxDays={maxDays} />
                        </DataTableCell>
                    </tr>
                ))}
            </DataTableBody>
        </DataTable>
    )
}

export default LeaderBoard