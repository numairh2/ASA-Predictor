'use client'

import { Play, RotateCcw, Sparkles, Calendar } from 'lucide-react'

interface ControlPanelProps {
  onSimulateAll: () => void
  onPredictRemaining: () => void
  onReset: () => void
  selectedYear: 2025 | 2026
  onYearChange: (year: 2025 | 2026) => void
}

export function ControlPanel({
  onSimulateAll,
  onPredictRemaining,
  onReset,
  selectedYear,
  onYearChange,
}: ControlPanelProps) {
  return (
    <div className="bg-white dark:bg-slate-800 border-2 border-tan-300 dark:border-slate-600 rounded-sm p-4 md:p-6 mb-6 md:mb-8 shadow-md">
      <div className="grid grid-cols-2 sm:flex gap-2 md:gap-4 flex-wrap">
        <div className="relative flex items-center">
          <Calendar size={18} className="absolute left-3 text-brown-600 dark:text-slate-300 pointer-events-none" />
          <select
            value={selectedYear}
            onChange={(e) => onYearChange(Number(e.target.value) as 2025 | 2026)}
            className="appearance-none bg-white dark:bg-slate-700 border-2 border-tan-300 dark:border-slate-600 rounded-sm pl-10 pr-8 py-3 text-brown-800 dark:text-slate-100 text-xs md:text-sm font-semibold cursor-pointer font-sans tracking-wide uppercase shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all min-h-[44px]"
          >
            <option value={2026}>2026</option>
            <option value={2025}>2025</option>
          </select>
          <div className="absolute right-2 pointer-events-none text-brown-600 dark:text-slate-300">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        <button
          onClick={onPredictRemaining}
          className="bg-gradient-to-br from-purple-600 to-purple-500 border-none rounded-sm px-4 md:px-6 py-3 text-white text-xs md:text-sm font-semibold cursor-pointer flex items-center justify-center gap-2 font-sans tracking-wide uppercase shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all min-h-[44px]"
        >
          <Sparkles size={18} />
          <span className="hidden sm:inline">Auto-Fill</span> Predictions
        </button>

        <button
          onClick={onSimulateAll}
          className="bg-gradient-to-br from-gold-600 to-gold-500 border-none rounded-sm px-4 md:px-6 py-3 text-white text-xs md:text-sm font-semibold cursor-pointer flex items-center justify-center gap-2 font-sans tracking-wide uppercase shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all min-h-[44px]"
        >
          <Play size={18} />
          Simulate All
        </button>

        <button
          onClick={onReset}
          className="bg-white dark:bg-slate-700 border-2 border-red-600 rounded-sm px-4 md:px-6 py-3 text-red-600 dark:text-red-400 text-xs md:text-sm font-semibold cursor-pointer flex items-center justify-center gap-2 font-sans tracking-wide uppercase hover:bg-red-600 hover:text-white dark:hover:bg-red-600 dark:hover:text-white transition-colors min-h-[44px]"
        >
          <RotateCcw size={18} />
          Reset
        </button>

      </div>
    </div>
  )
}
