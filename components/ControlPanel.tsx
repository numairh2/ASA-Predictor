'use client'

import { Play, RotateCcw, Target, Sparkles } from 'lucide-react'

interface ControlPanelProps {
  onSimulateAll: () => void
  onPredictRemaining: () => void
  onReset: () => void
  showAnalysis: boolean
  onToggleAnalysis: () => void
}

export function ControlPanel({
  onSimulateAll,
  onPredictRemaining,
  onReset,
  showAnalysis,
  onToggleAnalysis,
}: ControlPanelProps) {
  return (
    <div className="bg-white border-2 border-tan-300 rounded-sm p-6 mb-8 shadow-md">
      <div className="flex gap-4 flex-wrap">
        <button
          onClick={onPredictRemaining}
          className="bg-gradient-to-br from-purple-600 to-purple-500 border-none rounded-sm px-6 py-3 text-white text-sm font-semibold cursor-pointer flex items-center gap-2 font-sans tracking-wide uppercase shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
        >
          <Sparkles size={18} />
          Auto-Fill Predictions
        </button>

        <button
          onClick={onSimulateAll}
          className="bg-gradient-to-br from-gold-600 to-gold-500 border-none rounded-sm px-6 py-3 text-white text-sm font-semibold cursor-pointer flex items-center gap-2 font-sans tracking-wide uppercase shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
        >
          <Play size={18} />
          Simulate All
        </button>

        <button
          onClick={onReset}
          className="bg-white border-2 border-red-600 rounded-sm px-6 py-3 text-red-600 text-sm font-semibold cursor-pointer flex items-center gap-2 font-sans tracking-wide uppercase hover:bg-red-600 hover:text-white transition-colors"
        >
          <RotateCcw size={18} />
          Reset
        </button>

        <button
          onClick={onToggleAnalysis}
          className={`border-2 border-bronze-500 rounded-sm px-6 py-3 text-sm font-semibold cursor-pointer flex items-center gap-2 font-sans tracking-wide uppercase ml-auto transition-colors ${
            showAnalysis
              ? 'bg-bronze-500 text-white'
              : 'bg-white text-bronze-500 hover:bg-bronze-500 hover:text-white'
          }`}
        >
          <Target size={18} />
          {showAnalysis ? 'Hide' : 'Show'} Analysis
        </button>
      </div>
    </div>
  )
}
