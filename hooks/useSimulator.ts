'use client'

import { useState, useCallback, useMemo } from 'react'
import { INITIAL_TEAMS, LAST_YEAR_RATINGS } from '@/data/teams'
import { COMPETITION_SCHEDULE } from '@/data/competitions'
import {
  updateEloRatings,
  predictPlacements,
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
  const [currentCompetition, setCurrentCompetition] = useState(0)
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

    // Use permutation-averaged ratings for predictions
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
      if (!comp || !competitionResults[compId] || competitionResults[compId].length < 4) {
        return
      }

      const result = updateEloRatings(
        ratings,
        comp,
        competitionResults[compId],
        competitionCounts
      )
      setRatings(result.ratings)
      setCompetitionCounts(result.counts)
      setCurrentCompetition(compId)
    },
    [ratings, competitionResults, competitionCounts]
  )

  const simulateAll = useCallback(() => {
    const initialRatings = getInitialRatings()
    const result = calculateSequentialRatings(
      initialRatings,
      COMPETITION_SCHEDULE,
      competitionResults
    )

    setRatings(result.ratings)
    setCompetitionCounts(result.counts)
    setCurrentCompetition(COMPETITION_SCHEDULE[COMPETITION_SCHEDULE.length - 1].id)
  }, [competitionResults])

  // Predict remaining competitions (auto-fill based on ELO)
  const predictRemaining = useCallback(() => {
    const newResults = { ...competitionResults }

    COMPETITION_SCHEDULE.forEach((comp) => {
      // Only predict if no manual results (or less than 4)
      if (!newResults[comp.id] || newResults[comp.id].length < 4) {
        newResults[comp.id] = predictPlacements(ratings, comp)
      }
    })

    setCompetitionResults(newResults)
  }, [ratings, competitionResults])

  const resetSimulation = useCallback(() => {
    setRatings(getInitialRatings())
    setCompetitionCounts({})
    setCompetitionResults({})
    setCurrentCompetition(0)
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
    currentCompetition,
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
    simulateAll,
    predictRemaining,
    resetSimulation,
    getRatingChange,
    getLastYearRating,
  }
}
