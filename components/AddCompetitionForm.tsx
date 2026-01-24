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
        className="w-full bg-gradient-to-r from-gold-500 to-bronze-500 text-white px-4 py-3 rounded-sm font-semibold flex items-center justify-center gap-2 hover:from-gold-600 hover:to-bronze-600 transition-all shadow-md"
      >
        <Plus size={20} />
        Add New Competition
      </button>
    )
  }

  return (
    <div className="bg-white border-2 border-gold-500 rounded-sm p-4 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-brown-800">Add New Competition</h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-tan-400 hover:text-brown-800 transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      <div className="space-y-4">
        {/* Competition Name */}
        <div>
          <label className="block text-sm font-semibold text-tan-400 mb-1 uppercase tracking-wide">
            Competition Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Spring Showcase"
            className="w-full border-2 border-tan-300 rounded-sm px-3 py-2 text-brown-800 focus:border-gold-500 focus:outline-none"
          />
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm font-semibold text-tan-400 mb-1 uppercase tracking-wide">
            Date
          </label>
          <input
            type="text"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            placeholder="e.g., Mar 15, 2026"
            className="w-full border-2 border-tan-300 rounded-sm px-3 py-2 text-brown-800 focus:border-gold-500 focus:outline-none"
          />
        </div>

        {/* Team Selection */}
        <div>
          <label className="block text-sm font-semibold text-tan-400 mb-1 uppercase tracking-wide">
            Select Teams ({selectedTeams.length} selected, min 4)
          </label>
          <div className="border-2 border-tan-300 rounded-sm max-h-48 overflow-y-auto">
            {availableTeams.map((team) => (
              <label
                key={team}
                className={`flex items-center px-3 py-2 cursor-pointer hover:bg-cream-100 border-b border-tan-200 last:border-b-0 ${
                  selectedTeams.includes(team) ? 'bg-gold-500/10' : ''
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedTeams.includes(team)}
                  onChange={() => handleTeamToggle(team)}
                  className="mr-3 accent-gold-500"
                />
                <span className="text-brown-800 text-sm">{team}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className={`w-full px-4 py-3 rounded-sm font-semibold flex items-center justify-center gap-2 transition-all ${
            canSubmit
              ? 'bg-green-600 text-white hover:bg-green-700'
              : 'bg-tan-300 text-tan-400 cursor-not-allowed'
          }`}
        >
          <Plus size={18} />
          Add Competition
        </button>

        {selectedTeams.length > 0 && selectedTeams.length < 4 && (
          <p className="text-sm text-red-600 text-center">
            Please select at least 4 teams
          </p>
        )}
      </div>
    </div>
  )
}
