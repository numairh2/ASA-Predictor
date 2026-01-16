'use client'

import { useState } from 'react'
import { COMPETITION_SCHEDULE } from '@/data/competitions'
import { CompetitionResults } from '@/types'
import { CompetitionCard } from './CompetitionCard'

interface CompetitionListProps {
  competitionResults: CompetitionResults
  currentCompetition: number
  onPlacementSelect: (competitionId: number, position: number, teamName: string) => void
  onClearPlacement: (competitionId: number, position: number) => void
  onSimulateCompetition: (compId: number) => void
}

export function CompetitionList({
  competitionResults,
  currentCompetition,
  onPlacementSelect,
  onClearPlacement,
  onSimulateCompetition,
}: CompetitionListProps) {
  const [expandedCompetition, setExpandedCompetition] = useState<number | null>(null)

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-brown-800 tracking-tight border-b-[3px] border-gold-500 pb-3 font-display">
        Competition Schedule
      </h2>

      <div className="flex flex-col gap-4">
        {COMPETITION_SCHEDULE.map((comp, idx) => {
          const isExpanded = expandedCompetition === comp.id
          const hasResults =
            competitionResults[comp.id] && competitionResults[comp.id].length >= 4
          const isSimulated = currentCompetition >= comp.id

          return (
            <CompetitionCard
              key={comp.id}
              competition={comp}
              index={idx}
              isExpanded={isExpanded}
              isSimulated={isSimulated}
              hasResults={hasResults}
              placements={competitionResults[comp.id] || []}
              onToggle={() =>
                setExpandedCompetition(isExpanded ? null : comp.id)
              }
              onSimulate={() => onSimulateCompetition(comp.id)}
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
