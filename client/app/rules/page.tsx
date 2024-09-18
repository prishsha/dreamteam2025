import React from 'react';

const RulesPage: React.FC = () => {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="rounded-t-lg shadow-2xl overflow-hidden transform hover:scale-105 transition duration-300">
          <div className="bg-purple-800 py-6 px-8 border-b-4 border-purple-600">
            <h1 className="text-4xl font-extrabold text-white text-center animate-pulse">
              Dream Team 5.0 Rulebook
            </h1>
          </div>
          
          <div className="p-8 space-y-10">
            <Section title="Participating Rules">
              <ul className="space-y-2 text-gray-300">
                <ListItem>The event will consist of 2 rounds.</ListItem>
                <ListItem>All participating teams are required to build a team of 11-13 players.</ListItem>
                <ListItem>The IPL team name will be assigned to the participating teams on the day of the event by lottery.</ListItem>
                <ListItem>The monetary prizes will be awarded in the second round only.</ListItem>
              </ul>
            </Section>

            <Section title="Event and Evaluation Rules">
              <ul className="space-y-2 text-gray-300">
                <ListItem>For teams with more than 11 players satisfying the criteria, the final 11 will be picked on the basis of higher rating in their respective roles.</ListItem>
                <ListItem>Winners will be declared on the basis of the total team points. In case of a tie, the team with the higher budget remaining is placed higher.</ListItem>
                <ListItem>Exhaustion of budget before satisfying the cricket team criterias will lead to disqualification.</ListItem>
                <ListItem>The top selected teams will be moving to the final round to be conducted on 24th September, 2023 at the same venue.</ListItem>
              </ul>
            </Section>

            <Section title="Cricket Team Criteria">
              <p className="mb-2 text-gray-300">Each team must conform to the following specification:</p>
              <ul className="space-y-2 text-gray-300">
                <ListItem>Minimum 4 bowlers</ListItem>
                <ListItem>Minimum 4 batsmen</ListItem>
                <ListItem>Minimum 2 all rounders</ListItem>
                <ListItem>Minimum 1 wicket keeper</ListItem>
                <ListItem>Maximum of 4 international players</ListItem>
              </ul>
            </Section>

            <Section title="Bidding Rules">
              <ul className="space-y-2 text-gray-300">
                <ListItem>The Purse amount will be 60 crore.</ListItem>
                <ListItem>The bidding process will be initiated by the Auctioneer.</ListItem>
                <ListItem>To place a bid, one member from a team is required to raise the placard only once.</ListItem>
                <ListItem>Bid once placed can't be canceled.</ListItem>
                <ListItem>The sale of a player will be declared by the auctioneer only.</ListItem>
                <ListItem>For every sold player, the team moderator will be provided a stamped player receipt, which is to be kept safe till the final evaluation.</ListItem>
                <ListItem>Players will be sold to the team with the highest bid.</ListItem>
                <ListItem>
                  The bid increments will be done in the following fashion:
                  <ul className="ml-6 mt-2 space-y-1 text-sm">
                    <li>20L - 50L : by 5L</li>
                    <li>50L - 1Cr : by 10L</li>
                    <li>1Cr - 5Cr : by 20L</li>
                    <li>5Cr - 10Cr : by 50L</li>
                    <li>Above 10 Cr : by 1Cr</li>
                  </ul>
                </ListItem>
                <ListItem>Each team will be issued a warning when their budget drops to 5 crore. Budget warning will be issued only once.</ListItem>
                <ListItem>In case of dispute, the decision of the auctioneer will be final and binding.</ListItem>
                <ListItem>A team placing a bid higher than their available budget will be disqualified.</ListItem>
              </ul>
            </Section>
          </div>
        </div>
      </div>
    </div>
  );
};

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <section className="bg-gray-800 rounded-lg p-6 shadow-lg transform hover:scale-102 transition duration-300">
    <h2 className="text-2xl font-semibold mb-4 text-purple-400 border-b-2 border-purple-500 pb-2">
      {title}
    </h2>
    {children}
  </section>
);

const ListItem: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <li className="flex items-start">
    <span className="text-purple-400 mr-2 mt-1">•</span>
    <span>{children}</span>
  </li>
);

export default RulesPage;
