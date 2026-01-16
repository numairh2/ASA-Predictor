import { Competition, Ratings, CompetitionResults, CompetitionCounts, EloUpdateResult } from '@/types'

const D = 400 // ELO sensitivity parameter
const K_NEW = 20 // K factor for teams with 0-1 competitions
const K_ESTABLISHED = 16 // K factor for teams with 2+ competitions

export function calculateExpectedScore(ratingA: number, ratingB: number): number {
  return 1 / (1 + Math.pow(10, (ratingB - ratingA) / D))
}

export function calculateExpectedScoreMultiTeam(
  teamRating: number,
  allRatings: number[]
): number {
  let sum = 0
  for (let i = 0; i < allRatings.length; i++) {
    if (allRatings[i] !== teamRating) {
      sum += calculateExpectedScore(teamRating, allRatings[i])
    }
  }
  const N = allRatings.length
  return sum / ((N * (N - 1)) / 2)
}

export function calculateActualScores(
  rankings: string[],
  teamNames: string[]
): Record<string, number> {
  const scores: Record<string, number> = {}
  const N = teamNames.length

  const deltas: number[] = []
  let totalDelta = 0

  for (let i = 0; i < N; i++) {
    const placement = rankings.indexOf(teamNames[i])
    const delta = placement === -1 ? 0 : N - 1 - placement
    deltas.push(delta)
    totalDelta += delta
  }

  for (let i = 0; i < N; i++) {
    scores[teamNames[i]] = totalDelta > 0 ? deltas[i] / totalDelta : 0
  }

  return scores
}

/**
 * Predicts placements for a competition based on current ELO ratings.
 * Teams are sorted by rating (highest first) to generate predicted placements.
 */
export function predictPlacements(
  currentRatings: Ratings,
  competition: Competition
): string[] {
  const teamsWithRatings = competition.teams.map((team) => ({
    name: team,
    rating: currentRatings[team] ?? 1500,
  }))

  teamsWithRatings.sort((a, b) => b.rating - a.rating)

  return teamsWithRatings.map((t) => t.name)
}

/**
 * Get K factor for a team based on their competition count.
 * K=20 for teams with 0-1 competitions, K=16 for teams with 2+ competitions.
 */
function getKFactor(competitionCount: number): number {
  return competitionCount <= 1 ? K_NEW : K_ESTABLISHED
}

/**
 * Updates ELO ratings for all teams in a competition.
 * Uses variable K factor based on each team's competition history.
 */
export function updateEloRatings(
  currentRatings: Ratings,
  competition: Competition,
  placements: string[],
  competitionCounts: CompetitionCounts = {}
): EloUpdateResult {
  const newRatings = { ...currentRatings }
  const newCounts = { ...competitionCounts }
  const competingTeams = competition.teams

  if (!placements || placements.length === 0) {
    return { ratings: newRatings, counts: newCounts }
  }

  const teamRatings = competingTeams.map((team) => currentRatings[team] ?? 1500)

  const expectedScores: Record<string, number> = {}
  competingTeams.forEach((team) => {
    expectedScores[team] = calculateExpectedScoreMultiTeam(
      currentRatings[team] ?? 1500,
      teamRatings
    )
  })

  const actualScores = calculateActualScores(placements, competingTeams)

  competingTeams.forEach((team) => {
    const currentCount = newCounts[team] ?? 0
    const K = getKFactor(currentCount)
    const N = competingTeams.length

    const ratingChange = K * (N - 1) * (actualScores[team] - expectedScores[team])
    newRatings[team] = (currentRatings[team] ?? 1500) + ratingChange

    // Increment competition count for this team
    newCounts[team] = currentCount + 1
  })

  return { ratings: newRatings, counts: newCounts }
}

/**
 * Groups competitions by their date string.
 */
function groupCompetitionsByDate(competitions: Competition[]): Map<string, Competition[]> {
  const groups = new Map<string, Competition[]>()

  competitions.forEach((comp) => {
    const existing = groups.get(comp.date) || []
    existing.push(comp)
    groups.set(comp.date, existing)
  })

  return groups
}

/**
 * Generates all permutations of an array.
 */
function* permutations<T>(arr: T[]): Generator<T[]> {
  if (arr.length <= 1) {
    yield arr
    return
  }

  for (let i = 0; i < arr.length; i++) {
    const rest = [...arr.slice(0, i), ...arr.slice(i + 1)]
    for (const perm of permutations(rest)) {
      yield [arr[i], ...perm]
    }
  }
}

/**
 * Flattens grouped competitions based on a date order permutation.
 */
function flattenWithDateOrder(
  dateGroups: Map<string, Competition[]>,
  dateOrder: string[]
): Competition[] {
  const result: Competition[] = []
  for (const date of dateOrder) {
    const comps = dateGroups.get(date) || []
    result.push(...comps)
  }
  return result
}

/**
 * Calculates averaged ELO ratings across all date permutations.
 * This removes time-based bias from the ELO system per ASA documentation.
 */
export function calculateAveragedRatings(
  initialRatings: Ratings,
  competitions: Competition[],
  results: CompetitionResults
): Ratings {
  // Group competitions by date
  const dateGroups = groupCompetitionsByDate(competitions)
  const uniqueDates = Array.from(dateGroups.keys())

  // If only 1 or 2 unique dates, permutations don't matter much
  // but we still calculate for consistency
  const allPermutations = Array.from(permutations(uniqueDates))

  // Track sum of ratings for averaging
  const ratingsSums: Ratings = {}
  const teamNames = Object.keys(initialRatings)

  // Initialize sums
  teamNames.forEach((team) => {
    ratingsSums[team] = 0
  })

  // Calculate ratings for each permutation
  for (const dateOrder of allPermutations) {
    const orderedCompetitions = flattenWithDateOrder(dateGroups, dateOrder)

    let currentRatings = { ...initialRatings }
    let currentCounts: CompetitionCounts = {}

    // Process competitions in this order
    for (const comp of orderedCompetitions) {
      const placements = results[comp.id]
      if (placements && placements.length >= 4) {
        const result = updateEloRatings(currentRatings, comp, placements, currentCounts)
        currentRatings = result.ratings
        currentCounts = result.counts
      } else {
        // Auto-predict if no results
        const predicted = predictPlacements(currentRatings, comp)
        const result = updateEloRatings(currentRatings, comp, predicted, currentCounts)
        currentRatings = result.ratings
        currentCounts = result.counts
      }
    }

    // Add this permutation's final ratings to sums
    Object.keys(currentRatings).forEach((team) => {
      ratingsSums[team] = (ratingsSums[team] || 0) + currentRatings[team]
    })
  }

  // Calculate average ratings
  const numPermutations = allPermutations.length
  const averagedRatings: Ratings = {}

  Object.keys(ratingsSums).forEach((team) => {
    averagedRatings[team] = ratingsSums[team] / numPermutations
  })

  return averagedRatings
}

/**
 * Simple sequential calculation (no permutation averaging).
 * Used for step-by-step simulation.
 */
export function calculateSequentialRatings(
  initialRatings: Ratings,
  competitions: Competition[],
  results: CompetitionResults
): { ratings: Ratings; counts: CompetitionCounts } {
  let currentRatings = { ...initialRatings }
  let currentCounts: CompetitionCounts = {}

  for (const comp of competitions) {
    const placements = results[comp.id]
    if (placements && placements.length >= 4) {
      const result = updateEloRatings(currentRatings, comp, placements, currentCounts)
      currentRatings = result.ratings
      currentCounts = result.counts
    }
  }

  return { ratings: currentRatings, counts: currentCounts }
}
