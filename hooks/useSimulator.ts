'use client'

import { useState, useCallback, useMemo } from 'react'
import { INITIAL_TEAMS, LAST_YEAR_RATINGS } from '@/data/teams'
import { COMPETITION_SCHEDULE } from '@/data/competitions'
import {
  updateEloRatings,
  calculateAveragedRatings,
  calculateSequentialRatings
} from '@/lib/elo'
import { CompetitionResults, Ratings, TeamRanking, CompetitionCounts } from '@/types'

export interface TeamRankingWithDelta extends TeamRanking {
  originalRank: number
  delta: number // positive = improved, negative = dropped
}

function getInitialRatings(): Ratings {
  const initial: Ratings = {}
  INITIAL_TEAMS.forEach((team) => {
    initial[team.name] = team.rating
  })
  return initial
}

export function useSimulator() {
  const [ratings, setRatings] = useState<Ratings>(getInitialRatings)
  const [competitionCounts, setCompetitionCounts] = useState<CompetitionCounts>({})
  const [competitionResults, setCompetitionResults] = useState<CompetitionResults>({})
  const [simulatedCompetitions, setSimulatedCompetitions] = useState<Set<number>>(new Set())
  const [yourTeam, setYourTeam] = useState("UW Awaaz")
  const [showAnalysis, setShowAnalysis] = useState(false)

  // Original rankings (before any simulations)
  const originalRankings: TeamRanking[] = useMemo(() => {
    const initialRatings = getInitialRatings()
    return Object.entries(initialRatings)
      .map(([name, rating]) => ({ name, rating }))
      .sort((a, b) => b.rating - a.rating)
      .map((team, idx) => ({ ...team, rank: idx + 1 }))
  }, [])

  // Current rankings (after manual simulations)
  const rankings: TeamRanking[] = useMemo(() => {
    return Object.entries(ratings)
      .map(([name, rating]) => ({ name, rating }))
      .sort((a, b) => b.rating - a.rating)
      .map((team, idx) => ({ ...team, rank: idx + 1 }))
  }, [ratings])

  // Predicted rankings using permutation-averaged ELO (per ASA documentation)
  const predictedRankings: TeamRankingWithDelta[] = useMemo(() => {
    const initialRatings = getInitialRatings()

    // Use permutation-averaged ratings for predictions (per ASA spec)
    const averagedRatings = calculateAveragedRatings(
      initialRatings,
      COMPETITION_SCHEDULE,
      competitionResults
    )

    // Calculate predicted rankings
    const predicted = Object.entries(averagedRatings)
      .map(([name, rating]) => ({ name, rating }))
      .sort((a, b) => b.rating - a.rating)
      .map((team, idx) => {
        const originalTeam = originalRankings.find((t) => t.name === team.name)
        const originalRank = originalTeam?.rank ?? idx + 1
        const predictedRank = idx + 1
        return {
          ...team,
          rank: predictedRank,
          originalRank,
          delta: originalRank - predictedRank, // positive = moved up
        }
      })

    return predicted
  }, [competitionResults, originalRankings])

  const yourTeamData = useMemo(() => {
    return rankings.find((t) => t.name === yourTeam)
  }, [rankings, yourTeam])

  const yourTeamPredicted = useMemo(() => {
    return predictedRankings.find((t) => t.name === yourTeam)
  }, [predictedRankings, yourTeam])

  const isTop8 = yourTeamData ? yourTeamData.rank <= 8 : false
  const isPredictedTop8 = yourTeamPredicted ? yourTeamPredicted.rank <= 8 : false

  const recalculateFromSimulated = useCallback(
    (simulatedSet: Set<number>) => {
      const initialRatings = getInitialRatings()
      let currentRatings = { ...initialRatings }
      let currentCounts: CompetitionCounts = {}

      // Sort by date, then by ID for competitions on same date
      const sortedCompIds = Array.from(simulatedSet).sort((a, b) => {
        const compA = COMPETITION_SCHEDULE.find((c) => c.id === a)
        const compB = COMPETITION_SCHEDULE.find((c) => c.id === b)
        if (!compA || !compB) return a - b

        // Compare dates first
        const dateA = new Date(compA.date)
        const dateB = new Date(compB.date)
        if (dateA.getTime() !== dateB.getTime()) {
          return dateA.getTime() - dateB.getTime()
        }
        // Same date, sort by ID
        return a - b
      })

      for (const compId of sortedCompIds) {
        const comp = COMPETITION_SCHEDULE.find((c) => c.id === compId)
        if (!comp) continue
        const placements = competitionResults[compId]
        if (placements && placements.length >= 4) {
          const result = updateEloRatings(currentRatings, comp, placements, currentCounts)
          currentRatings = result.ratings
          currentCounts = result.counts
        }
      }
      return { ratings: currentRatings, counts: currentCounts }
    },
    [competitionResults]
  )

  const handlePlacementSelect = useCallback(
    (competitionId: number, position: number, teamName: string) => {
      setCompetitionResults((prev) => {
        const newResults = { ...prev }
        if (!newResults[competitionId]) {
          newResults[competitionId] = []
        }

        // Remove team from any existing position
        newResults[competitionId] = newResults[competitionId].filter(
          (t) => t !== teamName
        )

        // Add to new position
        const updated = [...newResults[competitionId]]
        updated.splice(position, 0, teamName)
        newResults[competitionId] = updated

        return newResults
      })
    },
    []
  )

  const clearPlacement = useCallback(
    (competitionId: number, position: number) => {
      setCompetitionResults((prev) => {
        const newResults = { ...prev }
        if (newResults[competitionId]) {
          const updated = [...newResults[competitionId]]
          updated.splice(position, 1)
          newResults[competitionId] = updated
        }
        return newResults
      })
    },
    []
  )

  const simulateCompetition = useCallback(
    (compId: number) => {
      const comp = COMPETITION_SCHEDULE.find((c) => c.id === compId)
      if (!comp) return

      if (!competitionResults[compId] || competitionResults[compId].length < 4) {
        return
      }

      const newSimulated = new Set(simulatedCompetitions)
      newSimulated.add(compId)
      setSimulatedCompetitions(newSimulated)

      const result = recalculateFromSimulated(newSimulated)
      setRatings(result.ratings)
      setCompetitionCounts(result.counts)
    },
    [competitionResults, simulatedCompetitions, recalculateFromSimulated]
  )

  const unsimulateCompetition = useCallback(
    (compId: number) => {
      const newSimulated = new Set(simulatedCompetitions)
      newSimulated.delete(compId)
      setSimulatedCompetitions(newSimulated)

      const result = recalculateFromSimulated(newSimulated)
      setRatings(result.ratings)
      setCompetitionCounts(result.counts)
    },
    [simulatedCompetitions, recalculateFromSimulated]
  )

  const simulateAll = useCallback(() => {
    const allWithResults = new Set<number>()
    COMPETITION_SCHEDULE.forEach((comp) => {
      if (competitionResults[comp.id] && competitionResults[comp.id].length >= 4) {
        allWithResults.add(comp.id)
      }
    })
    setSimulatedCompetitions(allWithResults)

    const result = recalculateFromSimulated(allWithResults)
    setRatings(result.ratings)
    setCompetitionCounts(result.counts)
  }, [competitionResults, recalculateFromSimulated])

  // Auto-fill remaining competitions with random placements
  const predictRemaining = useCallback(() => {
    const newResults = { ...competitionResults }

    COMPETITION_SCHEDULE.forEach((comp) => {
      // Only fill if no manual results (or less than 4)
      if (!newResults[comp.id] || newResults[comp.id].length < 4) {
        // Shuffle teams randomly using Fisher-Yates
        const shuffled = [...comp.teams]
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1))
          ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
        }
        newResults[comp.id] = shuffled
      }
    })

    setCompetitionResults(newResults)
  }, [competitionResults])

  const resetSimulation = useCallback(() => {
    setRatings(getInitialRatings())
    setCompetitionCounts({})
    setCompetitionResults({})
    setSimulatedCompetitions(new Set())
  }, [])

  const getRatingChange = useCallback(
    (teamName: string): number => {
      const original = INITIAL_TEAMS.find((t) => t.name === teamName)
      if (!original) return 0
      return ratings[teamName] - original.rating
    },
    [ratings]
  )

  const getLastYearRating = useCallback(
    (teamName: string): number | null => {
      return LAST_YEAR_RATINGS[teamName] ?? null
    },
    []
  )

  return {
    ratings,
    competitionResults,
    competitionCounts,
    simulatedCompetitions,
    yourTeam,
    setYourTeam,
    showAnalysis,
    setShowAnalysis,
    rankings,
    originalRankings,
    predictedRankings,
    yourTeamData,
    yourTeamPredicted,
    isTop8,
    isPredictedTop8,
    handlePlacementSelect,
    clearPlacement,
    simulateCompetition,
    unsimulateCompetition,
    simulateAll,
    predictRemaining,
    resetSimulation,
    getRatingChange,
    getLastYearRating,
  }
}
