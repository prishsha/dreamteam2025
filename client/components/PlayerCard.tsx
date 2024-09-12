import { Player } from '@/types/player';
import GetCountryFlagIcon from '@/utils/flags';
import { humanizePrice } from '@/utils/humanize';
import Image from 'next/image';

const PlayerCard: React.FC<Player> = ({ id, name, country, role, rating, basePrice, avatarUrl }) => {
  const getCardStyle = (rating: number) => {
    if (rating >= 90) return 'bg-gradient-to-br from-yellow-400 to-yellow-600 border-yellow-300';
    if (rating >= 80) return 'bg-gradient-to-br from-gray-300 to-gray-500 border-gray-200';
    if (rating >= 70) return 'bg-gradient-to-br from-amber-600 to-amber-800 border-amber-500';
    return 'bg-gradient-to-br from-gray-200 to-gray-400 border-gray-100';
  };

  return (
    <div key={id} className={`relative ${getCardStyle(rating)} rounded-lg overflow-hidden shadow-lg p-4 border-4`}>
      <div className="absolute top-4 left-4 z-10">
        <span className="text-6xl font-bold text-white opacity-80">{rating}</span>
      </div>
      <div className="absolute top-20 left-4 z-10 bg-white rounded-full p-1">
        <Image src={GetCountryFlagIcon(country)} alt={country} width={32} height={32} />
      </div>
      <div className="relative h-80">
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-0"></div>

        <Image
          src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/assets/players/${avatarUrl.String}`}
          alt={name}
          layout="fill"
          objectFit="cover"
          className="rounded-t-lg"
        />
      </div>
      <div className="mt-4 text-center relative z-10">
        <h2 className="text-3xl font-bold text-white">{name}</h2>
        <p className="text-sm text-gray-200">{country}</p>
        <div className="mt-4 flex justify-between items-center">
          <span className="bg-white text-gray-800 font-bold py-1 px-3 rounded-full">{role}</span>
          <span className="text-white font-semibold">Base Price: <span className="text-yellow-300 font-bold">₹{humanizePrice(basePrice)}</span></span>
        </div>
      </div>
    </div>
  )
}

export default PlayerCard;
