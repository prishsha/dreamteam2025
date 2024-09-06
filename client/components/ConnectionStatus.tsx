import React from 'react';

interface ConnectionStatusProps {
  connected: boolean;
}

const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ connected }) => {
  return (
    <div className="flex items-center bg-gray-100 rounded-full px-4 py-2 shadow-md">
      <div
        className={`w-3 h-3 rounded-full mr-2 transition-colors duration-300 ${
          connected ? 'bg-green-500' : 'bg-red-500'
        }`}
      />
      <span className="font-bold text-sm text-gray-800">
        {connected ? 'Connected' : 'Disconnected'}
      </span>
    </div>
  );
};

export default ConnectionStatus;
