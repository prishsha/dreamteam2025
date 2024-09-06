const TeamLogos = (team: string) => {
  switch (team) {
    case 'Chennai Super Kings':
      return 'https://documents.iplt20.com/ipl/CSK/logos/Logooutline/CSKoutline.png';
    case 'Delhi Capitals':
      return 'https://documents.iplt20.com/ipl/DC/Logos/LogoOutline/DCoutline.png';
    case 'Kolkata Knight Riders':
      return 'https://documents.iplt20.com/ipl/KKR/Logos/Logooutline/KKRoutline.png';
    case 'Mumbai Indians':
      return 'https://documents.iplt20.com/ipl/MI/Logos/Logooutline/MIoutline.png';
    case 'Lucknow Super Giants':
      return 'https://documents.iplt20.com/ipl/LSG/Logos/Logooutline/LSGoutline.png'
    case 'Punjab Kings':
      return 'https://documents.iplt20.com/ipl/PBKS/Logos/Logooutline/PBKSoutline.png';
    case 'Rajasthan Royals':
      return 'https://documents.iplt20.com/ipl/RR/Logos/Logooutline/RRoutline.png';
    case 'Royal Challengers Bangalore':
      return 'https://documents.iplt20.com/ipl/RCB/Logos/Logooutline/RCBoutline.png';
    case 'Sunrisers Hyderabad':
      return 'https://documents.iplt20.com/ipl/SRH/Logos/Logooutline/SRHoutline.png';
    case 'Gujarat Titans':
      return 'https://documents.iplt20.com/ipl/GT/Logos/Logooutline/GToutline.png'
    default:
      return '';
  }
};

export default TeamLogos;
