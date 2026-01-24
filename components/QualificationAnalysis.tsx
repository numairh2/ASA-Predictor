'use client'

import { Target } from 'lucide-react'
import { TeamRanking } from '@/types'

interface QualificationAnalysisProps {
  yourTeam: string
  yourTeamData: TeamRanking | undefined
  isTop8: boolean
}

export function QualificationAnalysis({
  yourTeam,
  yourTeamData,
  isTop8,
}: QualificationAnalysisProps) {
  if (!yourTeamData) return null

  return (
    <div className="mt-4 md:mt-6 bg-gradient-to-br from-bronze-500/10 to-gold-500/10 dark:from-bronze-500/5 dark:to-gold-500/5 border-2 border-bronze-500 rounded-sm p-4 md:p-6 shadow-md">
      <div className="flex items-center gap-3 mb-4 md:mb-5">
        <Target size={24} className="text-bronze-500 md:w-7 md:h-7" />
        <h3 className="text-lg md:text-xl font-bold text-brown-800 dark:text-slate-100 tracking-tight font-display">
          Qualification Analysis
        </h3>
      </div>

      <div className="text-sm md:text-base leading-relaxed text-brown-800 dark:text-slate-200 font-body">
        <p className="mb-4">
          <strong className="text-bronze-500">Current Status:</strong> {yourTeam} is
          ranked{' '}
          <span
            className={`font-bold ${isTop8 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}
          >
            #{yourTeamData.rank}
          </span>{' '}
          with a rating of{' '}
          <span className="font-bold">{yourTeamData.rating.toFixed(2)}</span>
        </p>

        {isTop8 ? (
          <div className="bg-green-600/10 dark:bg-green-600/20 border-2 border-green-600 rounded-sm p-3 md:p-4 mt-4">
            <div className="font-bold text-green-700 dark:text-green-400 mb-2 text-sm md:text-base">
              Qualification Position
            </div>
            <div className="text-brown-700/80 dark:text-slate-300 leading-relaxed text-sm md:text-base">
              You&apos;re currently in a qualifying position for A3. Maintain strong
              performances to secure your spot.
            </div>
          </div>
        ) : (
          <div className="bg-red-600/10 dark:bg-red-600/20 border-2 border-red-600 rounded-sm p-3 md:p-4 mt-4">
            <div className="font-bold text-red-700 dark:text-red-400 mb-2 text-sm md:text-base">
              Outside Top 8
            </div>
            <div className="text-brown-700/80 dark:text-slate-300 leading-relaxed text-sm md:text-base">
              You need to improve your ranking. Focus on top placements at
              remaining competitions against higher-rated teams.
            </div>
          </div>
        )}

        <div className="mt-4 md:mt-5 p-3 md:p-4 bg-gold-500/10 dark:bg-gold-500/5 border border-tan-300 dark:border-slate-600 rounded-sm">
          <div className="font-bold text-tan-400 dark:text-slate-400 mb-3 font-sans tracking-wide uppercase text-xs md:text-sm">
            Key Insights
          </div>
          <ul className="list-disc pl-5 text-brown-700/80 dark:text-slate-300 leading-relaxed space-y-1 text-sm md:text-base">
            <li>Winning against higher-rated teams yields more ELO points</li>
            <li>Consistent top-4 finishes are crucial for qualification</li>
            <li>Competition strength of schedule matters significantly</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
