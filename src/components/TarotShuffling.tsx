"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useMemo } from "react";

const TOTAL_CARDS = 22;

export function TarotShuffling() {
  const cards = useMemo(() => {
    return Array.from({ length: TOTAL_CARDS }, (_, i) => {
      const centerIndex = (TOTAL_CARDS - 1) / 2;
      const offset = i - centerIndex;
      const angle = offset * 4;
      const xOffset = offset * 18;
      const yOffset = Math.abs(offset) * 3;
      const zIndex = TOTAL_CARDS - Math.abs(offset);

      return { angle, xOffset, yOffset, zIndex, delay: i * 0.02 };
    });
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-12 relative">
      {/* Mystical background glow */}
      <motion.div
        className="absolute inset-0 bg-gradient-radial from-amber-500/20 via-purple-500/10 to-transparent rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Fan of 22 shuffling cards */}
      <div className="relative w-[500px] h-36 flex items-end justify-center">
        {cards.map((card, i) => (
          <motion.div
            key={i}
            className="absolute w-14 h-24 rounded overflow-hidden shadow-lg"
            style={{
              transformOrigin: "bottom center",
              left: "50%",
              marginLeft: "-28px",
              zIndex: card.zIndex,
            }}
            initial={{ rotate: card.angle, x: card.xOffset, y: card.yOffset }}
            animate={{
              rotate: [
                card.angle,
                card.angle + (i % 2 === 0 ? 8 : -8),
                card.angle + (i % 2 === 0 ? -5 : 5),
                card.angle,
              ],
              x: [
                card.xOffset,
                card.xOffset + (i % 3 === 0 ? 5 : -5),
                card.xOffset + (i % 3 === 1 ? -3 : 3),
                card.xOffset,
              ],
              y: [
                card.yOffset,
                card.yOffset - 8,
                card.yOffset + 4,
                card.yOffset,
              ],
            }}
            transition={{
              duration: 0.5,
              repeat: 2,
              ease: "easeInOut",
              delay: card.delay,
            }}
          >
            <img
              src="/tarot/card_back.webp"
              alt="Card back"
              className="w-full h-full object-cover"
            />
          </motion.div>
        ))}
      </div>

      {/* Shuffling text */}
      <motion.div
        className="mt-8 flex items-center gap-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Sparkles className="h-4 w-4 text-amber-400 animate-pulse" />
        <span className="text-sm font-medium text-amber-200/80 tracking-wider uppercase">
          Shuffling the cosmic deck
        </span>
        <Sparkles className="h-4 w-4 text-amber-400 animate-pulse" />
      </motion.div>

      {/* Animated dots */}
      <motion.div
        className="flex gap-1 mt-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-amber-400"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </motion.div>

      {/* Floating particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-amber-400/60 rounded-full"
          initial={{
            x: 0,
            y: 0,
            opacity: 0,
          }}
          animate={{
            x: [0, (i % 2 === 0 ? 1 : -1) * (20 + i * 10)],
            y: [0, -30 - i * 10],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: i * 0.3,
            ease: "easeOut",
          }}
          style={{
            left: `${50 + (i - 3) * 15}%`,
            top: "60%",
          }}
        />
      ))}
    </div>
  );
}
