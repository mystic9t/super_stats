"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  DrawnCard,
  TarotCard as TarotCardType,
  UserProfile,
} from "@vibes/shared-types";
import {
  getPositionDescription,
  isCardFavorited,
  toggleFavoriteCard,
} from "@vibes/shared-utils";
import { Button } from "@/components/ui/button";
import { X, Heart, Sparkles, BookOpen, History, Star } from "lucide-react";

interface TarotCardDetailProps {
  drawnCard: DrawnCard;
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile | null;
}

export function TarotCardDetail({
  drawnCard,
  isOpen,
  onClose,
  profile,
}: TarotCardDetailProps) {
  const { card, position, isReversed } = drawnCard;
  const positionInfo = getPositionDescription(position);
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    if (profile && isOpen) {
      setIsFavorited(isCardFavorited(profile, card.id));
    }
  }, [profile, card.id, isOpen]);

  const handleToggleFavorite = () => {
    if (!profile) return;
    const newStatus = toggleFavoriteCard(profile, card.id);
    setIsFavorited(newStatus);
  };

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl border border-amber-500/30 shadow-2xl"
        >
          {/* Close button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute top-4 right-4 z-10 text-slate-400 hover:text-white hover:bg-slate-700/50"
          >
            <X className="h-5 w-5" />
          </Button>

          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl" />

          <div className="relative p-6 sm:p-8">
            {/* Card Header with Image */}
            <div className="flex flex-col sm:flex-row gap-6 mb-6">
              {/* Card Image */}
              <div
                className={`
                  relative shrink-0 mx-auto sm:mx-0 w-40 h-64 rounded-lg overflow-hidden
                  bg-gradient-to-br from-amber-700 via-amber-600 to-amber-800
                  shadow-[0_0_30px_rgba(251,191,36,0.3)]
                  ${isReversed ? "rotate-180" : ""}
                `}
              >
                {/* Corner ornaments */}
                <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-amber-300 rounded-tl-sm z-10" />
                <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-amber-300 rounded-tr-sm z-10" />
                <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-amber-300 rounded-bl-sm z-10" />
                <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-amber-300 rounded-br-sm z-10" />

                <div className="absolute inset-1 rounded">
                  <Image
                    src={card.imageUrl}
                    alt={card.name}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>

              {/* Card Info */}
              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-2xl font-bold text-white mb-1">
                  {card.name}
                </h2>
                {isReversed && (
                  <span className="inline-block px-3 py-1 text-xs font-medium text-red-400 bg-red-500/20 rounded-full mb-3">
                    Reversed
                  </span>
                )}
                <p className="text-amber-400 text-sm mb-4">
                  {positionInfo.description}
                </p>

                {/* Favorite Button */}
                {profile && (
                  <Button
                    variant={isFavorited ? "default" : "outline"}
                    size="sm"
                    onClick={handleToggleFavorite}
                    className={`
                      ${
                        isFavorited
                          ? "bg-red-500 hover:bg-red-600 text-white"
                          : "border-amber-500/50 text-amber-400 hover:bg-amber-500/20"
                      }
                    `}
                  >
                    <Heart
                      className={`h-4 w-4 mr-2 ${isFavorited ? "fill-current" : ""}`}
                    />
                    {isFavorited ? "Favorited" : "Add to Favorites"}
                  </Button>
                )}
              </div>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
              <Sparkles className="h-5 w-5 text-amber-400" />
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
            </div>

            {/* Meanings Section */}
            <div className="space-y-4">
              {/* Upright Meaning */}
              <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700">
                <h3 className="flex items-center gap-2 text-amber-400 font-semibold mb-2">
                  <Star className="h-4 w-4" />
                  Upright Meaning
                </h3>
                <p className="text-slate-300 leading-relaxed text-sm">
                  {card.uprightMeaning}
                </p>
              </div>

              {/* Reversed Meaning */}
              <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700">
                <h3 className="flex items-center gap-2 text-red-400 font-semibold mb-2">
                  <Star className="h-4 w-4" />
                  Reversed Meaning
                </h3>
                <p className="text-slate-300 leading-relaxed text-sm">
                  {card.reversedMeaning}
                </p>
              </div>
            </div>

            {/* Description Section */}
            <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-amber-500/10 to-purple-500/10 border border-amber-500/20">
              <h3 className="flex items-center gap-2 text-amber-400 font-semibold mb-2">
                <BookOpen className="h-4 w-4" />
                About this Card
              </h3>
              <p className="text-slate-300 leading-relaxed text-sm">
                {card.description}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
