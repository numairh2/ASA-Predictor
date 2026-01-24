'use client'

import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { INITIAL_TEAMS } from '@/data/teams'

interface AddCompetitionFormProps {
  onAdd: (name: string, date: string, teams: string[]) => void
}

export function AddCompetitionForm({ onAdd }: AddCompetitionFormProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [name, setName] = useState('')
  const [date, setDate] = useState('')
  const [selectedTeams, setSelectedTeams] = useState<string[]>([])

  const availableTeams = INITIAL_TEAMS.map(t => t.name)

  const handleTeamToggle = (teamName: string) => {
    setSelectedTeams(prev =>
      prev.includes(teamName)
        ? prev.filter(t => t !== teamName)
        : [...prev, teamName]
    )
  }

  const handleSubmit = () => {
    if (!name.trim() || !date.trim() || selectedTeams.length < 4) {
      return
    }
    onAdd(name.trim(), date.trim(), selectedTeams)
    // Reset form
    setName('')
    setDate('')
    setSelectedTeams([])
    setIsOpen(false)
  }

  const canSubmit = name.trim() && date.trim() && selectedTeams.length >= 4

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full bg-gradient-to-r from-gold-500 to-bronze-500 text-white px-4 py-3 rounded-sm font-semibold flex items-center justify-center gap-2 hover:from-gold-600 hover:to-bronze-600 transition-all shadow-md min-h-[44px]"
      >
        <Plus size={20} />
        Add New Competition
      </button>
    )
  }

  return (
    <div className="bg-white dark:bg-slate-800 border-2 border-gold-500 dark:border-gold-400 rounded-sm p-4 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base md:text-lg font-bold text-brown-800 dark:text-slate-100">Add New Competition</h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-tan-400 dark:text-slate-400 hover:text-brown-800 dark:hover:text-slate-100 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
        >
          <X size={20} />
        </button>
      </div>

      <div className="space-y-4">
        {/* Competition Name */}
        <div>
          <label className="block text-xs md:text-sm font-semibold text-tan-400 dark:text-slate-400 mb-1 uppercase tracking-wide">
            Competition Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Spring Showcase"
            className="w-full border-2 border-tan-300 dark:border-slate-600 rounded-sm px-3 py-2 text-brown-800 dark:text-slate-100 bg-white dark:bg-slate-700 focus:border-gold-500 dark:focus:border-gold-400 focus:outline-none min-h-[44px]"
          />
        </div>

        {/* Date */}
        <div>
          <label className="block text-xs md:text-sm font-semibold text-tan-400 dark:text-slate-400 mb-1 uppercase tracking-wide">
            Date
          </label>
          <input
            type="text"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            placeholder="e.g., Mar 15, 2026"
            className="w-full border-2 border-tan-300 dark:border-slate-600 rounded-sm px-3 py-2 text-brown-800 dark:text-slate-100 bg-white dark:bg-slate-700 focus:border-gold-500 dark:focus:border-gold-400 focus:outline-none min-h-[44px]"
          />
        </div>

        {/* Team Selection */}
        <div>
          <label className="block text-xs md:text-sm font-semibold text-tan-400 dark:text-slate-400 mb-1 uppercase tracking-wide">
            Select Teams ({selectedTeams.length} selected, min 4)
          </label>
          <div className="border-2 border-tan-300 dark:border-slate-600 rounded-sm max-h-48 overflow-y-auto">
            {availableTeams.map((team) => (
              <label
                key={team}
                className={`flex items-center px-3 py-2 cursor-pointer hover:bg-cream-100 dark:hover:bg-slate-700 border-b border-tan-200 dark:border-slate-600 last:border-b-0 min-h-[44px] ${
                  selectedTeams.includes(team) ? 'bg-gold-500/10 dark:bg-gold-500/20' : ''
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedTeams.includes(team)}
                  onChange={() => handleTeamToggle(team)}
                  className="mr-3 accent-gold-500 w-5 h-5"
                />
                <span className="text-brown-800 dark:text-slate-100 text-sm">{team}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className={`w-full px-4 py-3 rounded-sm font-semibold flex items-center justify-center gap-2 transition-all min-h-[44px] ${
            canSubmit
              ? 'bg-green-600 text-white hover:bg-green-700'
              : 'bg-tan-300 dark:bg-slate-600 text-tan-400 dark:text-slate-400 cursor-not-allowed'
          }`}
        >
          <Plus size={18} />
          Add Competition
        </button>

        {selectedTeams.length > 0 && selectedTeams.length < 4 && (
          <p className="text-sm text-red-600 dark:text-red-400 text-center">
            Please select at least 4 teams
          </p>
        )}
      </div>
    </div>
  )
}
