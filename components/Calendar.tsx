"use client"
import React from 'react'
import { startOfMonth, endOfMonth, addDays, parseISO, toISODate } from '../lib/date'

type Props = {
  month: Date
  periodDates: Set<string>
  fertilityDates: Set<string>
  ovulationDate?: string | null
  nextStartDate?: string | null
  onSelectDate?: (iso: string) => void
}

export const Calendar: React.FC<Props> = ({ month, periodDates, fertilityDates, ovulationDate, nextStartDate, onSelectDate }) => {
  const start = startOfMonth(month)
  const end = endOfMonth(month)
  const days: Date[] = []
  const cur = new Date(start)
  while (cur <= end) { days.push(new Date(cur)); cur.setDate(cur.getDate() + 1) }
  const dow = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
  return (
    <div className="container-mobile">
      <div className="grid grid-cols-7 text-center text-xs text-gray-500 mb-1">
        {dow.map(d => <div key={d} aria-hidden>{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days.map(d => {
          const iso = toISODate(d)
          const isPeriod = periodDates.has(iso)
          const isFertile = fertilityDates.has(iso)
          const isOvul = ovulationDate === iso
          const isNext = nextStartDate === iso
          return (
            <button
              key={iso}
              onClick={() => onSelectDate?.(iso)}
              className={`aspect-square rounded-md text-sm tap-target focus:outline-none focus:ring-2 focus:ring-blue-500
                ${isPeriod ? 'bg-red-500/80 text-white' : isFertile ? 'bg-green-300/60 text-gray-900' : 'bg-gray-100 dark:bg-gray-800'}
                ${isNext ? 'ring-2 ring-blue-500' : ''}
              `}
              aria-label={iso}
            >
              <div className="relative">
                {d.getDate()}
                {isOvul && <span className="absolute right-1 top-1 w-2 h-2 rounded-full bg-fuchsia-500" aria-label="ovulation" />}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
