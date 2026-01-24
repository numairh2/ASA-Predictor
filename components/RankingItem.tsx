'use client'

import { Trophy, Medal, TrendingUp, TrendingDown, Minus, History } from 'lucide-react'
import { TeamRanking } from '@/types'

interface RankingItemProps {
  team: TeamRanking & { originalRank?: number; delta?: number }
  index: number
  isYourTeam: boolean
  ratingChange: number
  showDelta?: boolean
  lastYearRating?: number | null
}

export function RankingItem({
  team,
  index,
  isYourTeam,
  ratingChange,
  showDelta = false,
  lastYearRating
}: RankingItemProps) {
  const isTop8 = index < 8
  const delta = team.delta ?? 0

  return (
    <div
      className={`group relative px-3 md:px-5 py-3 md:py-4 flex items-center gap-3 md:gap-4 transition-colors ${
        index === 7 ? 'border-b-[3px] border-gold-500 dark:border-gold-400' : 'border-b border-gray-100 dark:border-slate-700'
      } ${
        isYourTeam
          ? 'bg-gradient-to-r from-gold-500/10 to-bronze-500/10 dark:from-gold-500/20 dark:to-bronze-500/20'
          : isTop8
          ? 'bg-green-600/5 dark:bg-green-600/10'
          : ''
      }`}
    >
      <div
        className={`w-10 h-10 md:w-12 md:h-12 rounded-sm flex items-center justify-center text-sm md:text-base font-bold font-sans shrink-0 ${
          isTop8
            ? 'bg-gradient-to-br from-gold-500 to-gold-600 text-white shadow-lg'
            : 'bg-gray-100 dark:bg-slate-700 text-tan-400 dark:text-slate-400'
        }`}
      >
        {index === 0 ? <Trophy size={20} className="md:w-6 md:h-6" /> : `${index + 1}`}
      </div>

      <div className="flex-1 min-w-0">
        <div
          className={`text-sm md:text-base font-semibold mb-1 font-body flex items-center gap-1 md:gap-2 flex-wrap ${
            isYourTeam ? 'text-gold-600 dark:text-gold-400' : 'text-brown-800 dark:text-slate-100'
          }`}
        >
          <span className="truncate">{team.name}</span>
          {showDelta && delta !== 0 && (
            <span
              className={`inline-flex items-center gap-0.5 text-xs font-bold px-1.5 py-0.5 rounded shrink-0 ${
                delta > 0
                  ? 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-400'
                  : 'bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-400'
              }`}
            >
              {delta > 0 ? (
                <TrendingUp size={12} />
              ) : (
                <TrendingDown size={12} />
              )}
              {Math.abs(delta)}
            </span>
          )}
          {showDelta && delta === 0 && (
            <span className="inline-flex items-center text-xs text-gray-400 dark:text-slate-500 px-1.5 py-0.5">
              <Minus size={12} />
            </span>
          )}
        </div>
        <div className="text-xs md:text-sm text-tan-400 dark:text-slate-400 flex items-center gap-2 md:gap-3 font-sans flex-wrap">
          <span>{team.rating.toFixed(2)} ELO</span>
          {ratingChange !== 0 && (
            <span
              className={`font-semibold ${
                ratingChange > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              }`}
            >
              {ratingChange > 0 ? '+' : ''}
              {ratingChange.toFixed(2)}
            </span>
          )}
          {showDelta && team.originalRank && (
            <span className="text-xs text-gray-400 dark:text-slate-500">
              (was #{team.originalRank})
            </span>
          )}
        </div>
      </div>

      {isTop8 && <Medal size={20} className="text-gold-500 dark:text-gold-400 shrink-0 md:w-6 md:h-6" />}

      {/* Last year's rating tooltip - hidden on mobile, shown on hover on desktop */}
      {lastYearRating && (
        <div className="hidden md:block absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
          <div className="bg-brown-800 dark:bg-slate-700 text-white text-xs px-3 py-2 rounded shadow-lg whitespace-nowrap flex items-center gap-2">
            <History size={12} />
            <span>2025 ELO: <strong>{lastYearRating.toFixed(2)}</strong></span>
          </div>
        </div>
      )}
    </div>
  )
}
