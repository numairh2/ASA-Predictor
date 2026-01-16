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
    <div className="mt-6 bg-gradient-to-br from-bronze-500/10 to-gold-500/10 border-2 border-bronze-500 rounded-sm p-6 shadow-md">
      <div className="flex items-center gap-3 mb-5">
        <Target size={28} className="text-bronze-500" />
        <h3 className="text-xl font-bold text-brown-800 tracking-tight font-display">
          Qualification Analysis
        </h3>
      </div>

      <div className="text-base leading-relaxed text-brown-800 font-body">
        <p className="mb-4">
          <strong className="text-bronze-500">Current Status:</strong> {yourTeam} is
          ranked{' '}
          <span
            className={`font-bold ${isTop8 ? 'text-green-600' : 'text-red-600'}`}
          >
            #{yourTeamData.rank}
          </span>{' '}
          with a rating of{' '}
          <span className="font-bold">{yourTeamData.rating.toFixed(2)}</span>
        </p>

        {isTop8 ? (
          <div className="bg-green-600/10 border-2 border-green-600 rounded-sm p-4 mt-4">
            <div className="font-bold text-green-700 mb-2 text-base">
              Qualification Position
            </div>
            <div className="text-brown-700/80 leading-relaxed">
              You&apos;re currently in a qualifying position for A3. Maintain strong
              performances to secure your spot.
            </div>
          </div>
        ) : (
          <div className="bg-red-600/10 border-2 border-red-600 rounded-sm p-4 mt-4">
            <div className="font-bold text-red-700 mb-2 text-base">
              Outside Top 8
            </div>
            <div className="text-brown-700/80 leading-relaxed">
              You need to improve your ranking. Focus on top placements at
              remaining competitions against higher-rated teams.
            </div>
          </div>
        )}

        <div className="mt-5 p-4 bg-gold-500/10 border border-tan-300 rounded-sm">
          <div className="font-bold text-tan-400 mb-3 font-sans tracking-wide uppercase text-sm">
            Key Insights
          </div>
          <ul className="list-disc pl-5 text-brown-700/80 leading-relaxed space-y-1">
            <li>Winning against higher-rated teams yields more ELO points</li>
            <li>Consistent top-4 finishes are crucial for qualification</li>
            <li>Competition strength of schedule matters significantly</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
