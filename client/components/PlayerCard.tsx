import { Player } from '@/types/player';
import GetCountryFlagIcon from '@/utils/flags';
import { humanizePrice } from '@/utils/humanize';
import teamGradiants from '@/utils/teamColours';
import Image from 'next/image';
import RatingHolder from '@/assets/RatingHolder.svg';
import Star from '@/assets/Star.svg';
import HalfStar from '@/assets/HalfStar.svg';


const PlayerCard: React.FC<Player> = ({ id, name, country, role, rating, basePrice, iplTeamName, avatarUrl }) => {
  const getBorder = () => {
    if (rating >= 90) return 'border-yellow-300';
    if (rating >= 80) return 'border-gray-200';
    if (rating >= 70) return 'border-amber-500';
    return 'border-gray-100';
  };


  const colours = teamGradiants(iplTeamName.String)

  const getGradient = () => {
    return {
      background: `linear-gradient(to bottom right, ${colours.start}, ${colours.end})`
    };
  };

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating / 20);
    const halfStar = rating % 20 >= 10;
    return (
      <div className="flex space-x-1">
        {[...Array(5)].map((_, i) => (
          <span key={i} className="w-4 h-4 relative">
            {i < fullStars ? (
              <Image src={Star} alt="Full Star" layout="fill" />
            ) : i === fullStars && halfStar ? (
              <Image src={HalfStar} alt="Half Star" layout="fill" />
            ) : (
              <Image src={Star} alt="Empty Star" layout="fill" className="opacity-30" />
            )}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div key={id} className={`relative ${getBorder()} rounded-lg overflow-hidden shadow-lg border-4`} style={getGradient()}>

      <div className="absolute top-4 left-4 z-10">
        <div className="relative w-12 h-12">
          <Image src={RatingHolder} alt="Star" layout="fill" className="text-yellow-300" />
          <span className="absolute inset-0 flex items-center justify-center text-lg font-bold text-white">{rating}</span>
        </div>
      </div>

      <div className="absolute top-4 right-4 z-10">
        <div className="relative w-12 h-12">
          <Image src={GetCountryFlagIcon(country)} alt={country} layout="fill" objectFit="cover" />
        </div>
      </div>

      <div className="relative h-80 pt-4">
        <div className="absolute inset-0 z-0">
          <Image
            src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/assets/cardbg.png`}
            alt="Dream Team Logo"
            className='opacity-30'
            layout='fill'
          />
        </div>
        <Image
          src={`${avatarUrl.String}`}
          alt={name}
          layout="fill"
          objectFit="cover"
          className="rounded-t-lg"
        />
      </div>
      <div className="relative">
        <div className={`absolute -top-6 left-1/2 transform -translate-x-1/2 bg-white text-gray-800 font-bold py-2 px-4 rounded-full shadow-lg text-center z-10 border-4 whitespace-nowrap overflow-hidden text-ellipsis max-w-full`} style={{ borderColor: colours.end }}>
          {name.toUpperCase()}
        </div>
        <div className="flex">
          <div className="bg-violet-950 relative flex-grow w-3/4">
            <div className="w-full pr-2">
              <div className="mt-3 mb-4 relative z-10 flex flex-col items-center justify-center h-full">
                <div className="mt-4">
                  {renderStars(rating)}
                </div>
                <div className="mt-2">
                  <span className="text-white font-bold text-3xl uppercase">{role}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="p-4 flex flex-col items-center justify-center w-1/4" style={{ backgroundColor: colours.end }}>
            <span className="text-white font-bold text-right text-3xl"><span className="text-white font-bold">{humanizePrice(basePrice).replace(/(\d+)([A-Za-z]+)/, '$1')}</span></span>
            <span className="text-white font-bold text-right text-xl">{humanizePrice(basePrice).replace(/(\d+)([A-Za-z]+)/, '$2').toUpperCase()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlayerCard;
