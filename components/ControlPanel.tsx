'use client'

import { Play, RotateCcw, Sparkles } from 'lucide-react'

interface ControlPanelProps {
  onSimulateAll: () => void
  onPredictRemaining: () => void
  onReset: () => void
}

export function ControlPanel({
  onSimulateAll,
  onPredictRemaining,
  onReset,
}: ControlPanelProps) {
  return (
    <div className="bg-white dark:bg-slate-800 border-2 border-tan-300 dark:border-slate-600 rounded-sm p-4 md:p-6 mb-6 md:mb-8 shadow-md">
      <div className="grid grid-cols-2 sm:flex gap-2 md:gap-4 flex-wrap">
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
