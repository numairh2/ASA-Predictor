'use client'

import { TeamRankingWithDelta } from '@/hooks/useSimulator'
import { RankingItem } from './RankingItem'

interface RankingsPanelProps {
  predictedRankings: TeamRankingWithDelta[]
  yourTeam: string
  getLastYearRating: (teamName: string) => number | null
}

export function RankingsPanel({
  predictedRankings,
  yourTeam,
  getLastYearRating
}: RankingsPanelProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-brown-800 tracking-tight border-b-[3px] border-bronze-500 pb-3 font-display">
        2026 Season Standings
      </h2>
      <p className="text-sm text-tan-400 mb-4 -mt-4 font-body italic">
        Permutation-averaged ELO rankings (ASA-compliant)
      </p>

      <div className="bg-white border-2 border-tan-300 rounded-sm overflow-hidden shadow-md max-h-[800px] overflow-y-auto">
        {predictedRankings.map((team, idx) => {
          // Rating change from initial 1500
          const ratingChange = team.rating - 1500

          return (
            <RankingItem
              key={team.name}
              team={team}
              index={idx}
              isYourTeam={team.name === yourTeam}
              ratingChange={ratingChange}
              showDelta={true}
              lastYearRating={getLastYearRating(team.name)}
            />
          )
        })}
      </div>
    </div>
  )
}
