import React from 'react';
import Modal from './Modal';
import AnimatedStamp from './AnimatedStamp';
import { UnsoldPlayerMessage } from '@/types/server';
import unsoldStamp from '@/assets/unsoldStamp.png';
import { humanizePrice } from '@/utils/humanize';

interface UnsoldModalProps {
  isOpen: boolean;
  onClose: () => void;
  unsoldInfo: UnsoldPlayerMessage | null;
}

const UnsoldModal: React.FC<UnsoldModalProps> = ({ isOpen, onClose, unsoldInfo }) => {
  if (!unsoldInfo) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="text-center">
        <h2 className="text-4xl font-bold mb-6 text-red-400">Player went Unsold!</h2>
        <div className="mb-8">
          <p className="text-3xl font-semibold mb-2">{unsoldInfo.player.name}</p>
          <p className="text-xl">Base Price: ₹{humanizePrice(unsoldInfo.player.basePrice)}</p>
        </div>
        <AnimatedStamp src={unsoldStamp} alt="Unsold" />
      </div>
    </Modal>
  );
};

export default UnsoldModal;
