import React from 'react';

interface CornerDotsProps {
  color?: string;
  borderColor?: string;
  size?: string;
  offset?: string;
}

export function CornerDots({
  color = 'bg-[#4b5563]',
  borderColor = 'border-[#11141a]',
  size = 'w-2 h-2',
  offset = '-top-1 -left-1',
}: CornerDotsProps) {
  return (
    <>
      <div className={`absolute -top-1 -left-1 ${size} ${color} border ${borderColor} z-20 pointer-events-none`} />
      <div className={`absolute -top-1 -right-1 ${size} ${color} border ${borderColor} z-20 pointer-events-none`} />
      <div className={`absolute -bottom-1 -left-1 ${size} ${color} border ${borderColor} z-20 pointer-events-none`} />
      <div className={`absolute -bottom-1 -right-1 ${size} ${color} border ${borderColor} z-20 pointer-events-none`} />
    </>
  );
}
