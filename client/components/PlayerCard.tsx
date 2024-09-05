import { Player } from '@/types/player';
import React, { useEffect, useState } from 'react';


const PlayerCard: React.FC<Player> = ({ id, name, country, role, rating, basePrice, avatarUrl }) => {
  return (
    <div>
      {name}
    </div>
  )
}

export default PlayerCard;

