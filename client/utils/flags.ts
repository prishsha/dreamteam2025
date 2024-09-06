const GetCountryFlagIcon = (country: string): string => {
  switch (country) {
    case 'South Africa':
      return 'https://hatscripts.github.io/circle-flags/flags/za.svg';
    case 'West Indies':
      return 'https://s.ndtvimg.com/images/entities/300/west-indies-2119.png';
    case 'Bangladesh':
      return 'https://hatscripts.github.io/circle-flags/flags/bd.svg';
    case 'New Zealand':
      return 'https://hatscripts.github.io/circle-flags/flags/nz.svg';
    case 'England':
      return 'https://hatscripts.github.io/circle-flags/flags/gb.svg';
    case 'Australia':
      return 'https://hatscripts.github.io/circle-flags/flags/au.svg';
    case 'Afghanistan':
      return 'https://hatscripts.github.io/circle-flags/flags/af.svg';
    case 'Sri Lanka':
      return 'https://hatscripts.github.io/circle-flags/flags/lk.svg';
    case 'India':
      return 'https://hatscripts.github.io/circle-flags/flags/in.svg';
    default:
      return 'https://thumbs.dreamstime.com/b/cricket-ball-crown-king-icon-vector-logo-design-template-cricket-king-vector-logo-design-cricket-ball-crown-icon-design-245947496.jpg';
  }
};

export default GetCountryFlagIcon;
