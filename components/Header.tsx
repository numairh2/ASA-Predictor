'use client'

import { Trophy, AlertCircle } from 'lucide-react'
import { INITIAL_TEAMS } from '@/data/teams'
import { TeamRanking } from '@/types'

interface HeaderProps {
  yourTeam: string
  setYourTeam: (team: string) => void
  yourTeamData: TeamRanking | undefined
  isTop8: boolean
}

export function Header({ yourTeam, setYourTeam, yourTeamData, isTop8 }: HeaderProps) {
  return (
    <div className="bg-gradient-to-br from-gold-500/10 to-bronze-500/10 border-2 border-gold-500 rounded-sm p-8 mb-8 shadow-lg">
      <div className="flex items-center gap-4 mb-4">
        <Trophy size={48} className="text-gold-600" />
        <h1 className="text-4xl md:text-5xl font-bold text-brown-800 tracking-tight font-display">
          ASA ELO Simulator
        </h1>
      </div>

      <p className="text-lg text-brown-700/80 leading-relaxed max-w-3xl mb-6 font-body italic">
        An interactive competition outcome simulator for South Asian a cappella teams.
        Model scenarios, track rankings, and analyze pathways to A3 qualification.
      </p>

      <div className="flex gap-4 items-center flex-wrap">
        <label className="text-tan-400 text-sm font-semibold font-sans tracking-widest uppercase">
          Your Team
        </label>
        <select
          value={yourTeam}
          onChange={(e) => setYourTeam(e.target.value)}
          className="bg-white border-2 border-gold-500 rounded-sm px-4 py-2 text-brown-800 font-body cursor-pointer outline-none min-w-[280px] shadow-md focus:ring-2 focus:ring-gold-500/50"
        >
          {INITIAL_TEAMS.map((team) => (
            <option key={team.name} value={team.name}>
              {team.name}
            </option>
          ))}
        </select>

        {yourTeamData && (
          <div className="flex gap-3 ml-auto items-center">
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-sm border-2 text-sm font-semibold font-sans tracking-wide uppercase ${
                isTop8
                  ? 'bg-green-600/10 border-green-600 text-green-700'
                  : 'bg-red-600/10 border-red-600 text-red-700'
              }`}
            >
              {isTop8 ? (
                <Trophy size={16} />
              ) : (
                <AlertCircle size={16} />
              )}
              Rank #{yourTeamData.rank}
            </div>
            <div className="bg-gold-500/15 border-2 border-gold-500 rounded-sm px-4 py-2 text-sm font-semibold font-sans tracking-wide">
              {yourTeamData.rating.toFixed(2)} ELO
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
