'use client'

import { TeamRanking } from '@/types'
import { TeamRankingWithDelta } from '@/hooks/useSimulator'
import { RankingItem } from './RankingItem'

interface RankingsPanelProps {
  rankings: TeamRanking[]
  predictedRankings: TeamRankingWithDelta[]
  yourTeam: string
  getRatingChange: (teamName: string) => number
  getLastYearRating: (teamName: string) => number | null
}

export function RankingsPanel({
  rankings,
  predictedRankings,
  yourTeam,
  getRatingChange,
  getLastYearRating
}: RankingsPanelProps) {
  // Create a map of predicted data for easy lookup
  const predictedMap = new Map(
    predictedRankings.map(p => [p.name, p])
  )

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-brown-800 tracking-tight border-b-[3px] border-bronze-500 pb-3 font-display">
        2026 Season Standings
      </h2>
      <p className="text-sm text-tan-400 mb-4 -mt-4 font-body italic">
        All teams start at 1500 ELO. Predicted changes shown.
      </p>

      <div className="bg-white border-2 border-tan-300 rounded-sm overflow-hidden shadow-md max-h-[800px] overflow-y-auto">
        {rankings.map((team, idx) => {
          const predicted = predictedMap.get(team.name)
          // Calculate predicted rating change (predicted rating - current rating)
          const predictedChange = predicted ? predicted.rating - team.rating : 0

          return (
            <RankingItem
              key={team.name}
              team={{
                ...team,
                // Add predicted rank info for delta display
                originalRank: idx + 1,
                delta: predicted ? (idx + 1) - predicted.rank : 0
              }}
              index={idx}
              isYourTeam={team.name === yourTeam}
              ratingChange={predictedChange}
              showDelta={true}
              lastYearRating={getLastYearRating(team.name)}
            />
          )
        })}
      </div>
    </div>
  )
}
