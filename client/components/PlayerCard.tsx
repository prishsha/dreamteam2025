import { Player } from '@/types/player';
import GetCountryFlagIcon from '@/utils/flags';
import { humanizePrice } from '@/utils/humanize';
import Image from 'next/image';

const PlayerCard: React.FC<Player> = ({ id, name, country, role, rating, basePrice, avatarUrl }) => {
  const getBorderColor = (rating: number) => {
    if (rating >= 90) return 'border-yellow-400'; // Gold
    if (rating >= 80) return 'border-gray-400'; // Silver
    if (rating >= 70) return 'border-amber-700'; // Bronze
    return 'border-gray-200'; // Plain
  };

  return (
    <div key={id} className={`relative bg-gradient-to-br from-blue-600 to-purple-700 rounded-lg overflow-hidden shadow-lg p-4 ${getBorderColor(rating)} border-4`}>
      <div className="absolute top-4 left-4 z-10">
        <span className="text-6xl font-bold text-white opacity-80">{rating}</span>
      </div>
      <div className="absolute top-20 left-4 z-10 bg-white rounded-full p-1">
        <Image src={GetCountryFlagIcon(country)} alt={country} width={32} height={32} />
      </div>
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-0"></div>
        <Image src={avatarUrl.String} alt={name} width={300} height={300} className="mx-auto rounded-full object-contain" />
      </div>
      <div className="mt-4 text-center relative z-10">
        <h2 className="text-3xl font-bold text-white">{name}</h2>
        <p className="text-sm text-gray-200">{country}</p>
        <div className="mt-4 flex justify-between items-center">
          <span className="bg-yellow-400 text-gray-800 font-bold py-1 px-3 rounded-full">{role}</span>
          <span className="text-white font-semibold">Base Price: <span className="text-yellow-300 font-bold">₹{humanizePrice(basePrice)}</span></span>
        </div>
      </div>
    </div>
  )
}

export default PlayerCard;
