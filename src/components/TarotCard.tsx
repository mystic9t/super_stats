'use client';

import { DrawnCard } from '@super-stats/shared-types';
import { getPositionDescription } from '@super-stats/shared-utils';

interface TarotCardProps {
    drawnCard: DrawnCard;
}

export function TarotCard({ drawnCard }: TarotCardProps) {
    const { card, position, isReversed } = drawnCard;
    const positionInfo = getPositionDescription(position);
    const meaning = isReversed ? card.reversedMeaning : card.uprightMeaning;

    return (
        <div className="flex flex-col items-center gap-3 group">
            {/* Position Label */}
            <div className="text-center">
                <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400">
                    {positionInfo.title}
                </h3>
                <p className="text-xs text-slate-400 max-w-[140px]">
                    {positionInfo.description}
                </p>
            </div>

            {/* Card Container with Starry Night Frame */}
            <div
                className={`
          relative p-2 rounded-lg
          bg-gradient-to-br from-amber-700 via-amber-600 to-amber-800
          shadow-[0_0_20px_rgba(251,191,36,0.3)]
          group-hover:shadow-[0_0_30px_rgba(251,191,36,0.5)]
          transition-all duration-300
          ${isReversed ? 'rotate-180' : ''}
        `}
            >
                {/* Decorative corner ornaments */}
                <div className="absolute top-1 left-1 w-3 h-3 border-t-2 border-l-2 border-amber-300 rounded-tl-sm" />
                <div className="absolute top-1 right-1 w-3 h-3 border-t-2 border-r-2 border-amber-300 rounded-tr-sm" />
                <div className="absolute bottom-1 left-1 w-3 h-3 border-b-2 border-l-2 border-amber-300 rounded-bl-sm" />
                <div className="absolute bottom-1 right-1 w-3 h-3 border-b-2 border-r-2 border-amber-300 rounded-br-sm" />

                {/* Card Image */}
                <div className="relative overflow-hidden rounded bg-slate-900">
                    <img
                        src={card.imageUrl}
                        alt={`${card.name}${isReversed ? ' (Reversed)' : ''}`}
                        className="w-28 h-44 sm:w-32 sm:h-52 object-cover"
                        loading="lazy"
                    />

                    {/* Subtle glow overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/20 to-transparent pointer-events-none" />
                </div>
            </div>

            {/* Card Name */}
            <div className={`text-center ${isReversed ? '' : ''}`}>
                <h4 className="font-bold text-white text-sm sm:text-base">
                    {card.name}
                </h4>
                {isReversed && (
                    <span className="text-xs text-red-400 font-medium">(Reversed)</span>
                )}
            </div>

            {/* Card Meaning */}
            <p className="text-xs text-slate-300 text-center max-w-[160px] leading-relaxed">
                {meaning}
            </p>
        </div>
    );
}
