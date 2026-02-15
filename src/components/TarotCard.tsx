"use client";

import { motion } from "framer-motion";
import { DrawnCard } from "@vibes/shared-types";
import { getPositionDescription } from "@vibes/shared-utils";

interface TarotCardProps {
  drawnCard: DrawnCard;
  isRevealed?: boolean;
  showBack?: boolean;
}

export function TarotCard({
  drawnCard,
  isRevealed = true,
  showBack = false,
}: TarotCardProps) {
  const { card, position, isReversed } = drawnCard;
  const positionInfo = getPositionDescription(position);
  const meaning = isReversed ? card.reversedMeaning : card.uprightMeaning;

  return (
    <div className="flex flex-col items-center gap-3 group">
      {/* Position Description */}
      <div className="text-center">
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
          ${isReversed ? "rotate-180" : ""}
        `}
      >
        {/* Decorative corner ornaments */}
        <div className="absolute top-1 left-1 w-3 h-3 border-t-2 border-l-2 border-amber-300 rounded-tl-sm" />
        <div className="absolute top-1 right-1 w-3 h-3 border-t-2 border-r-2 border-amber-300 rounded-tr-sm" />
        <div className="absolute bottom-1 left-1 w-3 h-3 border-b-2 border-l-2 border-amber-300 rounded-bl-sm" />
        <div className="absolute bottom-1 right-1 w-3 h-3 border-b-2 border-r-2 border-amber-300 rounded-br-sm" />

        {/* Card with Flip Animation */}
        <div
          className="relative w-28 h-44 sm:w-32 sm:h-52"
          style={{ perspective: "1000px" }}
        >
          <motion.div
            className="relative w-full h-full"
            style={{ transformStyle: "preserve-3d" }}
            initial={{ rotateY: 180 }}
            animate={{ rotateY: isRevealed ? 0 : 180 }}
            transition={{
              duration: 0.4,
              ease: [0.4, 0, 0.2, 1],
            }}
          >
            {/* Card Front */}
            <div
              className="absolute inset-0 overflow-hidden rounded bg-slate-900"
              style={{ backfaceVisibility: "hidden" }}
            >
              <img
                src={card.imageUrl}
                alt={`${card.name}${isReversed ? " (Reversed)" : ""}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />

              {/* Subtle glow overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/20 to-transparent pointer-events-none" />
            </div>

            {/* Card Back */}
            <div
              className="absolute inset-0 rounded overflow-hidden"
              style={{
                backfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
              }}
            >
              <img
                src="/tarot/card_back.webp"
                alt="Card back"
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Card Name */}
      <div className={`text-center ${isReversed ? "" : ""}`}>
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
