export interface TeamColours {
  start: string;
  end: string;
}

const getTeamColours = (team: string): TeamColours => {
  switch (team) {
    case 'Chennai Super Kings':
      return { start: '#EA9C08', end: '#EDD819' };
    case 'Lucknow Super Giants':
      return { start: '#232661', end: '#A14308' };
    case 'Kolkata Knight Riders':
      return { start: '#4F1787', end: '#A947DD' };
    case 'Delhi Capitals':
      return { start: '#24255E', end: '#20429B' };
    case 'Punjab Kings':
      return { start: '#B31312', end: '#E4003A' };
    case 'Royal Challengers Bangalore':
      return { start: '#E82324', end: '#44154F' };
    case 'Gujarat Titans':
      return { start: '#0C0350', end: '#C49846' };
    case 'Deccan Chargers':
      return { start: '#353030', end: '#979797' };
    case 'Sunrisers Hyderabad':
      return { start: '#E85C0D', end: '#FF8343' };
    case 'Mumbai Indians':
      return { start: '#0055B5', end: '#04aae6' };
    case 'Rising Pune Supergiants':
      return { start: '#660660', end: '#F14E8B' };
    case 'Rajasthan Royals':
      return { start: '#DF026F', end: '#FF8A9E' };
    default:
      return { start: '#1a1a2e', end: '#16213e' };
  }
}


export default getTeamColours;
