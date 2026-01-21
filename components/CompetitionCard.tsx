'use client'

import { ChevronDown, ChevronUp, Play, RotateCcw } from 'lucide-react'
import { Competition } from '@/types'

interface CompetitionCardProps {
  competition: Competition
  index: number
  isExpanded: boolean
  isSimulated: boolean
  hasResults: boolean
  placements: string[]
  onToggle: () => void
  onSimulate: () => void
  onUnsimulate: () => void
  onPlacementSelect: (position: number, teamName: string) => void
  onClearPlacement: (position: number) => void
}

const PLACEMENT_COLORS = [
  'from-gold-500 to-gold-600',
  'from-gray-400 to-gray-500',
  'from-bronze-500 to-bronze-600',
  'from-tan-400 to-brown-700',
]

export function CompetitionCard({
  competition,
  index,
  isExpanded,
  isSimulated,
  hasResults,
  placements,
  onToggle,
  onSimulate,
  onUnsimulate,
  onPlacementSelect,
  onClearPlacement,
}: CompetitionCardProps) {
  return (
    <div
      className={`rounded-sm overflow-hidden transition-all ${
        isSimulated
          ? 'bg-gradient-to-br from-gold-500/10 to-bronze-500/10 border-2 border-gold-500 shadow-lg'
          : 'bg-white border-2 border-tan-300 shadow-sm'
      }`}
    >
      <div
        className="p-5 cursor-pointer flex justify-between items-center"
        onClick={onToggle}
      >
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span
              className={`px-3 py-1 rounded-sm text-xs font-bold font-sans tracking-wide ${
                isSimulated
                  ? 'bg-gold-500 text-white'
                  : 'bg-gray-100 text-tan-400'
              }`}
            >
              COMP {index + 1}
            </span>
            <h3 className="text-lg font-semibold text-brown-800 font-display">
              {competition.name}
            </h3>
          </div>
          <div className="text-sm text-tan-400 font-body">
            {competition.date} · {competition.teams.length} teams
          </div>
        </div>

        <div className="flex gap-3 items-center">
          {isSimulated ? (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onUnsimulate()
              }}
              className="bg-gradient-to-br from-red-600 to-red-700 border-none rounded-sm px-4 py-2 text-white text-xs font-semibold cursor-pointer font-sans tracking-wide uppercase shadow-md flex items-center gap-2"
            >
              <RotateCcw size={14} />
              Reset
            </button>
          ) : hasResults ? (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onSimulate()
              }}
              className="bg-gradient-to-br from-green-600 to-green-700 border-none rounded-sm px-4 py-2 text-white text-xs font-semibold cursor-pointer font-sans tracking-wide uppercase shadow-md flex items-center gap-2"
            >
              <Play size={14} />
              Simulate
            </button>
          ) : null}
          {isExpanded ? (
            <ChevronUp size={24} className="text-tan-400" />
          ) : (
            <ChevronDown size={24} className="text-tan-400" />
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="px-5 pb-5 border-t border-tan-300">
          {/* Placement Entry */}
          <div className="mt-4">
            <div className="text-xs font-semibold text-tan-400 mb-3 font-sans tracking-wide uppercase">
              Select Top 4 Placements
            </div>

            {[0, 1, 2, 3].map((position) => (
              <div key={position} className="mb-3 flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-sm bg-gradient-to-br ${PLACEMENT_COLORS[position]} flex items-center justify-center text-sm font-bold text-white font-sans shadow-md`}
                >
                  {position + 1}
                </div>

                <select
                  value={placements[position] || ''}
                  onChange={(e) => {
                    if (e.target.value) {
                      onPlacementSelect(position, e.target.value)
                    } else {
                      onClearPlacement(position)
                    }
                  }}
                  className="flex-1 bg-white border-2 border-tan-300 rounded-sm px-3 py-2 text-brown-800 text-sm font-body cursor-pointer"
                >
                  <option value="">Select team...</option>
                  {competition.teams
                    .filter(
                      (team) =>
                        !placements.includes(team) || placements[position] === team
                    )
                    .map((team) => (
                      <option key={team} value={team}>
                        {team}
                      </option>
                    ))}
                </select>
              </div>
            ))}
          </div>

          <div className="mt-5 p-4 bg-gold-500/5 border border-tan-300 rounded-sm">
            <div className="text-xs font-semibold text-tan-400 mb-3 font-sans tracking-wide uppercase">
              Competing Teams
            </div>
            <div className="flex flex-wrap gap-2">
              {competition.teams.map((team) => (
                <span
                  key={team}
                  className="bg-white border border-tan-300 px-3 py-1 rounded-sm text-xs font-body"
                >
                  {team}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
