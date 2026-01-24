'use client'

import { useSimulator } from '@/hooks/useSimulator'
import { Header } from '@/components/Header'
import { ControlPanel } from '@/components/ControlPanel'
import { CompetitionList } from '@/components/CompetitionList'
import { AddCompetitionForm } from '@/components/AddCompetitionForm'
import { RankingsPanel } from '@/components/RankingsPanel'
import { QualificationAnalysis } from '@/components/QualificationAnalysis'

export default function Home() {
  const {
    competitions,
    competitionResults,
    simulatedCompetitions,
    yourTeam,
    setYourTeam,
    showAnalysis,
    setShowAnalysis,
    predictedRankings,
    yourTeamPredicted,
    isPredictedTop8,
    addCompetition,
    deleteCompetition,
    isCustomCompetition,
    handlePlacementSelect,
    clearPlacement,
    simulateCompetition,
    unsimulateCompetition,
    simulateAll,
    predictRemaining,
    resetSimulation,
    getLastYearRating,
  } = useSimulator()

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-100 via-cream-200 to-cream-300 text-brown-800 font-body relative overflow-hidden">
      {/* Background pattern */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, rgba(218, 165, 32, 0.03) 0%, transparent 50%),
                            radial-gradient(circle at 80% 80%, rgba(205, 127, 50, 0.03) 0%, transparent 50%),
                            radial-gradient(circle at 40% 20%, rgba(184, 134, 11, 0.02) 0%, transparent 50%)`,
        }}
      />

      <div className="max-w-7xl mx-auto px-6 py-10 relative z-10">
        <Header
          yourTeam={yourTeam}
          setYourTeam={setYourTeam}
          yourTeamData={yourTeamPredicted}
          isTop8={isPredictedTop8}
        />

        <ControlPanel
          onSimulateAll={simulateAll}
          onPredictRemaining={predictRemaining}
          onReset={resetSimulation}
          showAnalysis={showAnalysis}
          onToggleAnalysis={() => setShowAnalysis(!showAnalysis)}
        />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_450px] gap-6">
          <div className="flex flex-col gap-4">
            <AddCompetitionForm onAdd={addCompetition} />
            <CompetitionList
              competitions={competitions}
              competitionResults={competitionResults}
              simulatedCompetitions={simulatedCompetitions}
              onPlacementSelect={handlePlacementSelect}
              onClearPlacement={clearPlacement}
              onSimulateCompetition={simulateCompetition}
              onUnsimulateCompetition={unsimulateCompetition}
              onDeleteCompetition={deleteCompetition}
              isCustomCompetition={isCustomCompetition}
            />
          </div>

          <div>
            <RankingsPanel
              predictedRankings={predictedRankings}
              yourTeam={yourTeam}
              getLastYearRating={getLastYearRating}
            />

            {showAnalysis && (
              <QualificationAnalysis
                yourTeam={yourTeam}
                yourTeamData={yourTeamPredicted}
                isTop8={isPredictedTop8}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
