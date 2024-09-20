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
      return 'https://documents.iplt20.com/ipl/GT/Logos/Logooutline/GToutline.png';
    case 'Deccan Chargers':
      return 'https://upload.wikimedia.org/wikipedia/en/thumb/a/a6/HyderabadDeccanChargers.png/200px-HyderabadDeccanChargers.png';
    case 'Rising Pune Supergiant':
      return 'https://www.pngall.com/wp-content/uploads/2017/04/Rising-Pune-Supergiants-Logo-PNG.png'
    case 'Kochi Tuskers Kerala':
      return 'https://upload.wikimedia.org/wikipedia/en/thumb/9/96/Kochi_Tuskers_Kerala_Logo.svg/1200px-Kochi_Tuskers_Kerala_Logo.svg.png'
    case 'Gujarat Lions':
      return 'https://upload.wikimedia.org/wikipedia/en/c/c4/Gujarat_Lions.png'
    default:
      return '';
  }
};

export default TeamLogos;
