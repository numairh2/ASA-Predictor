'use client'

import { Trophy, AlertCircle } from 'lucide-react'
import { INITIAL_TEAMS } from '@/data/teams'
import { TeamRanking } from '@/types'
import { ThemeToggle } from './ThemeToggle'

interface HeaderProps {
  yourTeam: string
  setYourTeam: (team: string) => void
  yourTeamData: TeamRanking | undefined
  isTop8: boolean
}

export function Header({ yourTeam, setYourTeam, yourTeamData, isTop8 }: HeaderProps) {
  return (
    <div className="bg-gradient-to-br from-gold-500/10 to-bronze-500/10 dark:from-gold-500/5 dark:to-bronze-500/5 border-2 border-gold-500 dark:border-gold-400 rounded-sm p-4 md:p-6 lg:p-8 mb-6 md:mb-8 shadow-lg">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-3 md:gap-4">
          <Trophy size={36} className="text-gold-600 dark:text-gold-400 shrink-0 md:w-12 md:h-12" />
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-brown-800 dark:text-slate-100 tracking-tight font-display">
            ASA ELO Simulator
          </h1>
        </div>
        <ThemeToggle />
      </div>

      <p className="text-sm md:text-base lg:text-lg text-brown-700/80 dark:text-slate-300 leading-relaxed max-w-3xl mb-2 md:mb-3 font-body italic">
        An interactive competition outcome simulator for South Asian a cappella teams.
        Model scenarios, track rankings, and analyze pathways to A3 qualification.
      </p>
      <p className="text-xs text-tan-400 dark:text-slate-500 mb-4 md:mb-6 font-sans">
        Not affiliated with or endorsed by ASA.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 md:gap-4 items-start sm:items-center flex-wrap">
        <div className="flex gap-3 items-center w-full sm:w-auto">
          <label className="text-tan-400 dark:text-slate-400 text-xs md:text-sm font-semibold font-sans tracking-widest uppercase whitespace-nowrap">
            Your Team
          </label>
          <select
            value={yourTeam}
            onChange={(e) => setYourTeam(e.target.value)}
            className="flex-1 sm:flex-none bg-white dark:bg-slate-800 border-2 border-gold-500 dark:border-gold-400 rounded-sm px-3 md:px-4 py-2 text-brown-800 dark:text-slate-100 font-body cursor-pointer outline-none min-w-0 sm:min-w-[280px] shadow-md focus:ring-2 focus:ring-gold-500/50 min-h-[44px]"
          >
            {INITIAL_TEAMS.map((team) => (
              <option key={team.name} value={team.name}>
                {team.name}
              </option>
            ))}
          </select>
        </div>

        {yourTeamData && (
          <div className="flex gap-2 md:gap-3 sm:ml-auto items-center flex-wrap">
            <div
              className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-sm border-2 text-xs md:text-sm font-semibold font-sans tracking-wide uppercase min-h-[44px] ${
                isTop8
                  ? 'bg-green-600/10 border-green-600 text-green-700 dark:bg-green-600/20 dark:text-green-400'
                  : 'bg-red-600/10 border-red-600 text-red-700 dark:bg-red-600/20 dark:text-red-400'
              }`}
            >
              {isTop8 ? (
                <Trophy size={16} />
              ) : (
                <AlertCircle size={16} />
              )}
              Rank #{yourTeamData.rank}
            </div>
            <div className="bg-gold-500/15 dark:bg-gold-400/20 border-2 border-gold-500 dark:border-gold-400 rounded-sm px-3 md:px-4 py-2 text-xs md:text-sm font-semibold font-sans tracking-wide min-h-[44px] flex items-center">
              {yourTeamData.rating.toFixed(2)} ELO
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
