import React from 'react';
import Image, { StaticImageData } from 'next/image';

interface AnimatedStampProps {
  src: StaticImageData;
  alt: string;
}

const AnimatedStamp: React.FC<AnimatedStampProps> = ({ src, alt }) => {
  return (
    <div className="relative w-64 h-64 mx-auto animate-stamp">
      <Image src={src} alt={alt} layout="fill" objectFit="contain" />
    </div>
  );
};

export default AnimatedStamp;
