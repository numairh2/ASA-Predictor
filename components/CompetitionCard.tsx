'use client'

import { ChevronDown, ChevronUp, Play, RotateCcw, Trash2, X } from 'lucide-react'
import { Competition } from '@/types'
import { PlacementDndContext, DraggableTeam, DroppablePlacement } from './dnd'

interface CompetitionCardProps {
  competition: Competition
  index: number
  isExpanded: boolean
  isSimulated: boolean
  hasResults: boolean
  isCustom: boolean
  placements: string[]
  onToggle: () => void
  onSimulate: () => void
  onUnsimulate: () => void
  onDelete: () => void
  onPlacementSelect: (position: number, teamName: string) => void
  onClearPlacement: (position: number) => void
  onReorderPlacements: (fromPosition: number, toPosition: number) => void
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
  isCustom,
  placements,
  onToggle,
  onSimulate,
  onUnsimulate,
  onDelete,
  onPlacementSelect,
  onClearPlacement,
  onReorderPlacements,
}: CompetitionCardProps) {
  const handleDragEnd = (activeId: string, overId: string) => {
    // Parse the drop target position from overId (format: "placement-{position}")
    const toPositionMatch = overId.match(/^placement-(\d+)$/)
    if (!toPositionMatch) return
    const toPosition = parseInt(toPositionMatch[1], 10)

    // Check if this is a reorder (from placed team) or new placement (from team list)
    const placedMatch = activeId.match(/^placed-(\d+)-(.+)$/)
    if (placedMatch) {
      // Reordering a placed team
      const fromPosition = parseInt(placedMatch[1], 10)
      if (fromPosition !== toPosition) {
        onReorderPlacements(fromPosition, toPosition)
      }
    } else {
      // Dragging from team list
      const teamName = activeId
      if (competition.teams.includes(teamName) && !placements.includes(teamName)) {
        onPlacementSelect(toPosition, teamName)
      }
    }
  }

  return (
    <div
      className={`rounded-sm overflow-hidden transition-all ${
        isSimulated
          ? 'bg-gradient-to-br from-gold-500/10 to-bronze-500/10 dark:from-gold-500/5 dark:to-bronze-500/5 border-2 border-gold-500 dark:border-gold-400 shadow-lg'
          : 'bg-white dark:bg-slate-800 border-2 border-tan-300 dark:border-slate-600 shadow-sm'
      }`}
    >
      <div
        className="p-4 md:p-5 cursor-pointer flex justify-between items-center gap-3"
        onClick={onToggle}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 md:gap-3 mb-2 flex-wrap">
            <span
              className={`px-2 md:px-3 py-1 rounded-sm text-xs font-bold font-sans tracking-wide shrink-0 ${
                isSimulated
                  ? 'bg-gold-500 text-white'
                  : 'bg-gray-100 dark:bg-slate-700 text-tan-400 dark:text-slate-400'
              }`}
            >
              COMP {index + 1}
            </span>
            <h3 className="text-base md:text-lg font-semibold text-brown-800 dark:text-slate-100 font-display truncate">
              {competition.name}
            </h3>
          </div>
          <div className="text-xs md:text-sm text-tan-400 dark:text-slate-400 font-body">
            {competition.date} · {competition.teams.length} teams
          </div>
        </div>

        <div className="flex gap-2 md:gap-3 items-center shrink-0">
          {isCustom && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onDelete()
              }}
              className="bg-gradient-to-br from-gray-500 to-gray-600 border-none rounded-sm p-2 md:px-3 md:py-2 text-white text-xs font-semibold cursor-pointer font-sans tracking-wide uppercase shadow-md flex items-center gap-2 hover:from-red-600 hover:to-red-700 transition-all min-h-[44px] min-w-[44px] justify-center"
            >
              <Trash2 size={14} />
            </button>
          )}
          {isSimulated ? (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onSimulate()
                }}
                className="bg-gradient-to-br from-green-600 to-green-700 border-none rounded-sm px-3 md:px-4 py-2 text-white text-xs font-semibold cursor-pointer font-sans tracking-wide uppercase shadow-md flex items-center gap-2 min-h-[44px]"
              >
                <Play size={14} />
                <span className="hidden sm:inline">Re-simulate</span>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onUnsimulate()
                }}
                className="bg-gradient-to-br from-red-600 to-red-700 border-none rounded-sm px-3 md:px-4 py-2 text-white text-xs font-semibold cursor-pointer font-sans tracking-wide uppercase shadow-md flex items-center gap-2 min-h-[44px]"
              >
                <RotateCcw size={14} />
                <span className="hidden sm:inline">Reset</span>
              </button>
            </>
          ) : hasResults ? (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onSimulate()
              }}
              className="bg-gradient-to-br from-green-600 to-green-700 border-none rounded-sm px-3 md:px-4 py-2 text-white text-xs font-semibold cursor-pointer font-sans tracking-wide uppercase shadow-md flex items-center gap-2 min-h-[44px]"
            >
              <Play size={14} />
              <span className="hidden sm:inline">Simulate</span>
            </button>
          ) : null}
          {isExpanded ? (
            <ChevronUp size={24} className="text-tan-400 dark:text-slate-400" />
          ) : (
            <ChevronDown size={24} className="text-tan-400 dark:text-slate-400" />
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="px-4 md:px-5 pb-4 md:pb-5 border-t border-tan-300 dark:border-slate-600">
          <PlacementDndContext onDragEnd={handleDragEnd}>
            {/* Placement Entry */}
            <div className="mt-4">
              <div className="text-xs font-semibold text-tan-400 dark:text-slate-400 mb-3 font-sans tracking-wide uppercase">
                Select Top 4 Placements
                <span className="ml-2 font-normal text-tan-300 dark:text-slate-500">
                  (drag teams to slots)
                </span>
              </div>

              {[0, 1, 2, 3].map((position) => (
                <div key={position} className="mb-3 flex items-center gap-2 md:gap-3">
                  <div
                    className={`w-9 h-9 md:w-10 md:h-10 rounded-sm bg-gradient-to-br ${PLACEMENT_COLORS[position]} flex items-center justify-center text-sm font-bold text-white font-sans shadow-md shrink-0`}
                  >
                    {position + 1}
                  </div>

                  <DroppablePlacement position={position} currentTeam={placements[position]}>
                    <div className="w-full bg-white dark:bg-slate-700 border-2 border-tan-300 dark:border-slate-600 rounded-sm px-3 py-2 min-h-[44px] flex items-center">
                      {placements[position] ? (
                        <>
                          <span className="text-sm text-brown-800 dark:text-slate-100 font-body">
                            {placements[position]}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              onClearPlacement(position)
                            }}
                            className="ml-auto text-tan-400 hover:text-red-500 dark:text-slate-400 dark:hover:text-red-400 transition-colors"
                          >
                            <X size={16} />
                          </button>
                        </>
                      ) : (
                        <span className="text-sm text-tan-400 dark:text-slate-500 font-body italic">
                          Drop team here...
                        </span>
                      )}
                    </div>
                  </DroppablePlacement>
                </div>
              ))}
            </div>

            <div className="mt-4 md:mt-5 p-3 md:p-4 bg-gold-500/5 dark:bg-gold-500/10 border border-tan-300 dark:border-slate-600 rounded-sm">
              <div className="text-xs font-semibold text-tan-400 dark:text-slate-400 mb-3 font-sans tracking-wide uppercase">
                Competing Teams
                <span className="ml-2 font-normal text-tan-300 dark:text-slate-500">
                  (drag to placement slot)
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {competition.teams.map((team) => (
                  <DraggableTeam
                    key={team}
                    teamName={team}
                    isPlaced={placements.includes(team)}
                  />
                ))}
              </div>
            </div>
          </PlacementDndContext>
        </div>
      )}
    </div>
  )
}
