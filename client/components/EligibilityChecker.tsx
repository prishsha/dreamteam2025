import { MyTeamStats } from '@/types/teams';
import React from 'react';

interface EligibilityCheckerProps {
  teamStats?: MyTeamStats | null
}

const EligibilityChecker: React.FC<EligibilityCheckerProps> = ({ teamStats }) => {
  const allCriteriaSatisfied =
    teamStats?.bowlerCountSatisfied &&
    teamStats?.batsmanCountSatisfied &&
    teamStats?.allRounderCountSatisfied &&
    teamStats?.wicketKeeperCountSatisfied &&
    teamStats?.internationalCountSatisfied;

  console.log(teamStats?.internationalCountSatisfied, "hi");

  return (
    <div className="rounded-lg bg-gray-900 p-4 pb-6">
      {allCriteriaSatisfied && (
        <div className="text-2xl font-bold text-green-500 mb-4">
          ✅ All criteria satisfied
          <p className="text-lg font-normal mt-2">Your team has satisfied all criteria!</p>
        </div>
      )}
      <div>
        <div className={`flex items-center ${teamStats?.bowlerCountSatisfied ? 'text-green-500' : 'text-red-500'}`}>
          {teamStats?.bowlerCountSatisfied ? '✅' : '❌'} Minimum 4 bowlers ({teamStats?.bowlerCount}/4)
        </div>
        <div className={`flex items-center ${teamStats?.batsmanCountSatisfied ? 'text-green-500' : 'text-red-500'}`}>
          {teamStats?.batsmanCountSatisfied ? '✅' : '❌'} Minimum 4 batsmen ({teamStats?.batsmanCount}/4)
        </div>
        <div className={`flex items-center ${teamStats?.allRounderCountSatisfied ? 'text-green-500' : 'text-red-500'}`}>
          {teamStats?.allRounderCountSatisfied ? '✅' : '❌'} Minimum 2 all rounders ({teamStats?.allRounderCount}/2)
        </div>
        <div className={`flex items-center ${teamStats?.wicketKeeperCountSatisfied ? 'text-green-500' : 'text-red-500'}`}>
          {teamStats?.wicketKeeperCountSatisfied ? '✅' : '❌'} Minimum 1 wicket keeper ({teamStats?.wicketKeeperCount}/1)
        </div>
        <div className={`flex items-center ${teamStats?.internationalCountSatisfied ? 'text-green-500' : 'text-red-500'}`}>
          {teamStats?.internationalCountSatisfied ? '✅' : '❌'} Maximum of 4 international players ({teamStats?.internationalCount}/4)
        </div>
      </div>
    </div>
  );
};

export default EligibilityChecker;
