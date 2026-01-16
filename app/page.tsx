'use client'

import { useSimulator } from '@/hooks/useSimulator'
import { Header } from '@/components/Header'
import { ControlPanel } from '@/components/ControlPanel'
import { CompetitionList } from '@/components/CompetitionList'
import { RankingsPanel } from '@/components/RankingsPanel'
import { QualificationAnalysis } from '@/components/QualificationAnalysis'

export default function Home() {
  const {
    competitionResults,
    currentCompetition,
    yourTeam,
    setYourTeam,
    showAnalysis,
    setShowAnalysis,
    rankings,
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
          yourTeamData={yourTeamPredicted ?? yourTeamData}
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
          <CompetitionList
            competitionResults={competitionResults}
            currentCompetition={currentCompetition}
            onPlacementSelect={handlePlacementSelect}
            onClearPlacement={clearPlacement}
            onSimulateCompetition={simulateCompetition}
          />

          <div>
            <RankingsPanel
              rankings={rankings}
              predictedRankings={predictedRankings}
              yourTeam={yourTeam}
              getRatingChange={getRatingChange}
              getLastYearRating={getLastYearRating}
            />

            {showAnalysis && (
              <QualificationAnalysis
                yourTeam={yourTeam}
                yourTeamData={yourTeamPredicted ?? yourTeamData}
                isTop8={isPredictedTop8}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
