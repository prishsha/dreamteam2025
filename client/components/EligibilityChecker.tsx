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

  return (
    <div className="rounded-lg bg-gray-900 p-4 pb-6">
      {allCriteriaSatisfied ? (
        <div className="text-2xl font-bold text-green-500">
          ✅ All criteria satisfied
          <p className="text-lg font-normal mt-2">Your team has satisfied all criterias!</p>
        </div>
      ) : (
        <div>
          <p className="text-xl font-bold text-red-500 mb-4">Your team is not satisfying all criterias</p>
          <div className={`flex items-center ${teamStats?.bowlerCountSatisfied ? 'text-green-500' : 'text-red-500'}`}>
            {teamStats?.bowlerCountSatisfied ? '✅' : '❌'} Minimum 4 bowlers
          </div>
          <div className={`flex items-center ${teamStats?.batsmanCountSatisfied ? 'text-green-500' : 'text-red-500'}`}>
            {teamStats?.batsmanCountSatisfied ? '✅' : '❌'} Minimum 4 batsmen
          </div>
          <div className={`flex items-center ${teamStats?.allRounderCountSatisfied ? 'text-green-500' : 'text-red-500'}`}>
            {teamStats?.allRounderCountSatisfied ? '✅' : '❌'} Minimum 2 all rounders
          </div>
          <div className={`flex items-center ${teamStats?.wicketKeeperCountSatisfied ? 'text-green-500' : 'text-red-500'}`}>
            {teamStats?.wicketKeeperCountSatisfied ? '✅' : '❌'} Minimum 1 wicket keeper
          </div>
          <div className={`flex items-center ${teamStats?.internationalCountSatisfied ? 'text-green-500' : 'text-red-500'}`}>
            {teamStats?.internationalCountSatisfied ? '✅' : '❌'} Maximum of 4 international players
          </div>
        </div>
      )}
    </div>
  );
};

export default EligibilityChecker;
