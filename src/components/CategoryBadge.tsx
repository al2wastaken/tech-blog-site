import React from 'react';

type Props = {
  name?: string;
  color?: string; // hex (#rrggbb) or Tailwind class like 'bg-blue-600'
  className?: string;
};

function textColorForHex(hex?: string) {
  if (!hex || !/^#([0-9A-Fa-f]{6})$/.test(hex)) return 'text-white';
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 125 ? 'text-black' : 'text-white';
}

export default function CategoryBadge({ name = '', color, className = '' }: Props) {
  const isHex = typeof color === 'string' && color.startsWith('#');
  const style = isHex ? { backgroundColor: color } : undefined;
  const textClass = isHex ? textColorForHex(color) : 'text-white';
  const colorClass = !isHex && color ? color : '';

  return (
    <span
      className={`${textClass} text-sm font-medium px-2 py-0.5 rounded ${colorClass} ${className}`.trim()}
      style={style}
    >
      {name}
    </span>
  );
}
