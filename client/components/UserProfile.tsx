import { useState } from 'react';
import Image from 'next/image';
import { useUser } from '@/contexts/UserContext';

const UserProfile: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useUser();

  const handleLogout = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/logout`;
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition-all duration-300 hover:shadow-lg"
      >
        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-inner">
          <Image
            src={user?.picture || '/default-avatar.png'}
            alt={user?.name || "User"}
            width={40}
            height={40}
            className="object-cover"
          />
        </div>
        <span className="text-white font-semibold">
          {user?.name || user?.givenName}
        </span>
        <svg
          className={`w-5 h-5 text-white transition-transform duration-300 ${
            isOpen ? 'transform rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-64 bg-white rounded-lg overflow-hidden shadow-2xl z-10 transform transition-all duration-300 ease-in-out">
          <div className="px-4 py-3 bg-gradient-to-r from-purple-600 to-indigo-600">
            <p className="text-sm text-white font-medium break-words">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200 flex items-center space-x-2"
          >
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Logout</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
