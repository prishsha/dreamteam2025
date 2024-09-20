import React from 'react';
import Modal from './Modal';
import AnimatedStamp from './AnimatedStamp';
import { AssignPlayerMessage } from '@/types/server';
import { humanizePrice } from '@/utils/humanize';
import soldStamp from '@/assets/soldStamp.png';

interface AssignModalProps {
  isOpen: boolean;
  onClose: () => void;
  assignInfo: AssignPlayerMessage | null;
}

const AssignModal: React.FC<AssignModalProps> = ({ isOpen, onClose, assignInfo }) => {
  if (!assignInfo) return null;

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <div className="text-center">
          <h2 className="text-4xl font-bold mb-6 text-green-400">Player Sold!</h2>
          <div className="mb-8">
            <p className="text-3xl font-semibold mb-2">{assignInfo.player.name}</p>
            <p className="text-xl mb-2">Sold to: <span className="text-yellow-400">{assignInfo.participatingTeam.name}</span></p>
            <p className="text-2xl font-bold">Price: <span className="text-green-400">₹{humanizePrice(assignInfo.bidAmount)}</span></p>
          </div>
          <AnimatedStamp src={soldStamp} alt="Sold" />
        </div>
      </Modal>
    </>
  );
};

export default AssignModal;
