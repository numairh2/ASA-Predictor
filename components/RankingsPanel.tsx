'use client'

import { TeamRankingWithDelta } from '@/hooks/useSimulator'
import { RankingItem } from './RankingItem'
import { ExportMenu } from './ExportMenu'

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
      <div className="flex items-center justify-between gap-3 mb-4 md:mb-6 border-b-[3px] border-bronze-500 pb-3">
        <h2 className="text-xl md:text-2xl font-bold text-brown-800 dark:text-slate-100 tracking-tight font-display">
          2026 Season Standings
        </h2>
        <ExportMenu rankings={predictedRankings} exportElementId="rankings-export" />
      </div>
      <p className="text-xs md:text-sm text-tan-400 dark:text-slate-400 mb-4 -mt-2 md:-mt-4 font-body italic">
        Permutation-averaged ELO rankings (ASA-compliant)
      </p>

      <div id="rankings-export" className="bg-white dark:bg-slate-800 border-2 border-tan-300 dark:border-slate-600 rounded-sm overflow-hidden shadow-md max-h-[60vh] md:max-h-[800px] overflow-y-auto -webkit-overflow-scrolling-touch">
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
