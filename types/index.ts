export interface Team {
  name: string
  rating: number
}

export interface Competition {
  id: number
  name: string
  date: string
  teams: string[]
}

export interface TeamRanking {
  name: string
  rating: number
  rank: number
}

export interface CompetitionResults {
  [competitionId: number]: string[]
}

export interface Ratings {
  [teamName: string]: number
}

export interface CompetitionCounts {
  [teamName: string]: number
}

export interface EloUpdateResult {
  ratings: Ratings
  counts: CompetitionCounts
}
