'use client'

import { useState } from 'react'
import { Competition, CompetitionResults } from '@/types'
import { CompetitionCard } from './CompetitionCard'

interface CompetitionListProps {
  competitions: Competition[]
  competitionResults: CompetitionResults
  simulatedCompetitions: Set<number>
  onPlacementSelect: (competitionId: number, position: number, teamName: string) => void
  onClearPlacement: (competitionId: number, position: number) => void
  onSimulateCompetition: (compId: number) => void
  onUnsimulateCompetition: (compId: number) => void
  onDeleteCompetition: (compId: number) => void
  isCustomCompetition: (compId: number) => boolean
}

export function CompetitionList({
  competitions,
  competitionResults,
  simulatedCompetitions,
  onPlacementSelect,
  onClearPlacement,
  onSimulateCompetition,
  onUnsimulateCompetition,
  onDeleteCompetition,
  isCustomCompetition,
}: CompetitionListProps) {
  const [expandedCompetition, setExpandedCompetition] = useState<number | null>(null)

  return (
    <div>
      <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-brown-800 dark:text-slate-100 tracking-tight border-b-[3px] border-gold-500 dark:border-gold-400 pb-3 font-display">
        Competition Schedule
      </h2>

      <div className="flex flex-col gap-3 md:gap-4">
        {competitions.map((comp, idx) => {
          const isExpanded = expandedCompetition === comp.id
          const hasResults =
            competitionResults[comp.id] && competitionResults[comp.id].length >= 4
          const isSimulated = simulatedCompetitions.has(comp.id)
          const isCustom = isCustomCompetition(comp.id)

          return (
            <CompetitionCard
              key={comp.id}
              competition={comp}
              index={idx}
              isExpanded={isExpanded}
              isSimulated={isSimulated}
              hasResults={hasResults}
              isCustom={isCustom}
              placements={competitionResults[comp.id] || []}
              onToggle={() =>
                setExpandedCompetition(isExpanded ? null : comp.id)
              }
              onSimulate={() => onSimulateCompetition(comp.id)}
              onUnsimulate={() => onUnsimulateCompetition(comp.id)}
              onDelete={() => onDeleteCompetition(comp.id)}
              onPlacementSelect={(position, teamName) =>
                onPlacementSelect(comp.id, position, teamName)
              }
              onClearPlacement={(position) =>
                onClearPlacement(comp.id, position)
              }
            />
          )
        })}
      </div>
    </div>
  )
}
