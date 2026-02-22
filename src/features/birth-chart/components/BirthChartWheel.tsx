"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  BirthChartReading,
  PlanetPosition,
  ZodiacSign,
  Planet,
} from "@vibes/shared-types";
import { getZodiacDisplay, getZodiacSymbol } from "@vibes/shared-utils";

interface BirthChartWheelProps {
  reading: BirthChartReading;
}

const SIGN_COLORS: Record<ZodiacSign, string> = {
  [ZodiacSign.ARIES]: "#ef4444",
  [ZodiacSign.TAURUS]: "#16a34a",
  [ZodiacSign.GEMINI]: "#eab308",
  [ZodiacSign.CANCER]: "#94a3b8",
  [ZodiacSign.LEO]: "#f97316",
  [ZodiacSign.VIRGO]: "#059669",
  [ZodiacSign.LIBRA]: "#ec4899",
  [ZodiacSign.SCORPIO]: "#b91c1c",
  [ZodiacSign.SAGITTARIUS]: "#a855f7",
  [ZodiacSign.CAPRICORN]: "#b45309",
  [ZodiacSign.AQUARIUS]: "#06b6d4",
  [ZodiacSign.PISCES]: "#818cf8",
};

const PLANET_COLORS: Record<Planet, string> = {
  sun: "#fbbf24",
  moon: "#e2e8f0",
  mercury: "#22d3ee",
  venus: "#f472b6",
  mars: "#ef4444",
  jupiter: "#fb923c",
  saturn: "#d97706",
  uranus: "#67e8f9",
  neptune: "#60a5fa",
  pluto: "#a78bfa",
};

const PLANET_NAMES: Record<Planet, string> = {
  sun: "Sun",
  moon: "Moon",
  mercury: "Mercury",
  venus: "Venus",
  mars: "Mars",
  jupiter: "Jupiter",
  saturn: "Saturn",
  uranus: "Uranus",
  neptune: "Neptune",
  pluto: "Pluto",
};

// Zodiac signs in order starting from Aries (0 degrees)
const ZODIAC_ORDER: ZodiacSign[] = [
  ZodiacSign.ARIES,
  ZodiacSign.TAURUS,
  ZodiacSign.GEMINI,
  ZodiacSign.CANCER,
  ZodiacSign.LEO,
  ZodiacSign.VIRGO,
  ZodiacSign.LIBRA,
  ZodiacSign.SCORPIO,
  ZodiacSign.SAGITTARIUS,
  ZodiacSign.CAPRICORN,
  ZodiacSign.AQUARIUS,
  ZodiacSign.PISCES,
];

function getSignIndex(sign: ZodiacSign): number {
  return ZODIAC_ORDER.indexOf(sign);
}

// Convert degree (0-359) to angle on the wheel (0 = right, clockwise)
function degreeToAngle(degree: number): number {
  // In astrology, 0 degrees Aries is at the top, and signs go clockwise
  // SVG coordinate system: 0 degrees = right, positive = clockwise
  // We need to offset by -90 degrees to put Aries at top, then reverse for clockwise
  return (degree - 90 + 360) % 360;
}

// Calculate position of a planet on the wheel
function getPlanetPosition(
  planet: PlanetPosition,
  centerX: number,
  centerY: number,
  outerRadius: number,
  innerRadius: number,
): { x: number; y: number } {
  // Calculate the absolute degree in the zodiac (sign * 30 + degree in sign)
  const signIndex = getSignIndex(planet.sign);
  const absoluteDegree = signIndex * 30 + planet.degree + planet.minutes / 60;

  const angle = (absoluteDegree - 90) * (Math.PI / 180);

  // Position planets in the middle of their sign's section
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;

  return {
    x: centerX + radius * Math.cos(angle),
    y: centerY + radius * Math.sin(angle),
  };
}

interface TooltipData {
  planet: Planet;
  sign: ZodiacSign;
  degree: number;
  minutes: number;
  isRetrograde: boolean;
  x: number;
  y: number;
}

export function BirthChartWheel({ reading }: BirthChartWheelProps) {
  const { chart } = reading;
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);

  const size = 320;
  const centerX = size / 2;
  const centerY = size / 2;
  const outerRadius = 140;
  const innerRadius = 90;
  const houseRadius = 60;
  const centerRadius = 35;

  return (
    <div className="relative flex items-center justify-center">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="overflow-visible"
      >
        {/* Outer glow */}
        <defs>
          <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
          </radialGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Center glow */}
        <circle
          cx={centerX}
          cy={centerY}
          r={centerRadius}
          fill="url(#centerGlow)"
        />

        {/* Zodiac ring segments */}
        {ZODIAC_ORDER.map((sign, index) => {
          const startAngle = (index * 30 - 90) * (Math.PI / 180);
          const endAngle = ((index + 1) * 30 - 90) * (Math.PI / 180);

          const x1 = centerX + outerRadius * Math.cos(startAngle);
          const y1 = centerY + outerRadius * Math.sin(startAngle);
          const x2 = centerX + outerRadius * Math.cos(endAngle);
          const y2 = centerY + outerRadius * Math.sin(endAngle);
          const x3 = centerX + innerRadius * Math.cos(endAngle);
          const y3 = centerY + innerRadius * Math.sin(endAngle);
          const x4 = centerX + innerRadius * Math.cos(startAngle);
          const y4 = centerY + innerRadius * Math.sin(startAngle);

          const isCurrentSign = chart.sunSign === sign;

          return (
            <g key={sign}>
              <path
                d={`M ${x1} ${y1} A ${outerRadius} ${outerRadius} 0 0 1 ${x2} ${y2} L ${x3} ${y3} A ${innerRadius} ${innerRadius} 0 0 0 ${x4} ${y4} Z`}
                fill={SIGN_COLORS[sign]}
                fillOpacity={isCurrentSign ? 0.25 : 0.08}
                stroke={SIGN_COLORS[sign]}
                strokeWidth={isCurrentSign ? 2 : 0.5}
                strokeOpacity={isCurrentSign ? 1 : 0.4}
                className="transition-all duration-300"
              />
            </g>
          );
        })}

        {/* Zodiac symbols on outer ring */}
        {ZODIAC_ORDER.map((sign, index) => {
          const angle = (index * 30 + 15 - 90) * (Math.PI / 180);
          const symbolRadius = outerRadius + 18;
          const x = centerX + symbolRadius * Math.cos(angle);
          const y = centerY + symbolRadius * Math.sin(angle);

          return (
            <text
              key={`symbol-${sign}`}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-xs fill-muted-foreground font-medium"
              style={{ fontSize: 14 }}
            >
              {getZodiacSymbol(sign)}
            </text>
          );
        })}

        {/* Houses (small ticks) */}
        {[...Array(12)].map((_, i) => {
          const angle = (i * 30 - 90) * (Math.PI / 180);
          const x1 = centerX + (innerRadius - 5) * Math.cos(angle);
          const y1 = centerY + (innerRadius - 5) * Math.sin(angle);
          const x2 = centerX + houseRadius * Math.cos(angle);
          const y2 = centerY + houseRadius * Math.sin(angle);

          return (
            <line
              key={`house-${i}`}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="rgba(255,255,255,0.2)"
              strokeWidth={i === 0 ? 2 : 1}
            />
          );
        })}

        {/* ASC (Rising Sign) marker */}
        {(() => {
          const ascAngle = (chart.ascendantDegree - 90) * (Math.PI / 180);
          const x1 = centerX + (innerRadius - 8) * Math.cos(ascAngle);
          const y1 = centerY + (innerRadius - 8) * Math.sin(ascAngle);
          const x2 = centerX + (outerRadius + 8) * Math.cos(ascAngle);
          const y2 = centerY + (outerRadius + 8) * Math.sin(ascAngle);

          return (
            <line
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="#22d3ee"
              strokeWidth={2}
              strokeDasharray="4 2"
              filter="url(#glow)"
            />
          );
        })()}

        {/* Center circle with rising sign */}
        <circle
          cx={centerX}
          cy={centerY}
          r={centerRadius}
          fill="rgba(0,0,0,0.4)"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth={1}
        />
        <text
          x={centerX}
          y={centerY - 8}
          textAnchor="middle"
          dominantBaseline="middle"
          className="text-xs fill-cyan-400 font-bold"
          style={{ fontSize: 12 }}
        >
          ASC
        </text>
        <text
          x={centerX}
          y={centerY + 10}
          textAnchor="middle"
          dominantBaseline="middle"
          className="fill-muted-foreground"
          style={{ fontSize: 16 }}
        >
          {getZodiacSymbol(chart.risingSign)}
        </text>

        {/* Planets */}
        {chart.planets.map((pos) => {
          const { x, y } = getPlanetPosition(
            pos,
            centerX,
            centerY,
            outerRadius,
            innerRadius,
          );

          return (
            <g key={pos.planet}>
              <motion.circle
                cx={x}
                cy={y}
                r={pos.planet === "sun" || pos.planet === "moon" ? 10 : 8}
                fill={PLANET_COLORS[pos.planet]}
                stroke="rgba(0,0,0,0.5)"
                strokeWidth={2}
                filter="url(#glow)"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="cursor-pointer"
                onMouseEnter={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  setTooltip({
                    planet: pos.planet,
                    sign: pos.sign,
                    degree: pos.degree,
                    minutes: pos.minutes,
                    isRetrograde: pos.isRetrograde,
                    x: rect.left + rect.width / 2,
                    y: rect.top - 10,
                  });
                }}
                onMouseLeave={() => setTooltip(null)}
              />
              {/* Planet label */}
              <text
                x={x}
                y={y + 20}
                textAnchor="middle"
                className="text-[8px] fill-muted-foreground uppercase"
                style={{ fontSize: 8, fontWeight: 600 }}
              >
                {pos.planet === "sun"
                  ? "☀"
                  : pos.planet === "moon"
                    ? "☾"
                    : pos.planet.slice(0, 3)}
              </text>
              {pos.isRetrograde && (
                <text
                  x={x + 6}
                  y={y - 6}
                  className="text-[8px] fill-amber-400"
                  style={{ fontSize: 8, fontWeight: "bold" }}
                >
                  R
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="fixed z-50 px-3 py-2 bg-card/95 backdrop-blur-md border border-border rounded-lg shadow-xl pointer-events-none"
          style={{
            left: tooltip.x,
            top: tooltip.y,
            transform: "translate(-50%, -100%)",
          }}
        >
          <div className="flex items-center gap-2 mb-1">
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: PLANET_COLORS[tooltip.planet] }}
            />
            <span className="font-bold text-sm">
              {PLANET_NAMES[tooltip.planet]}
            </span>
            {tooltip.isRetrograde && (
              <span className="text-xs bg-amber-500/20 text-amber-500 px-1 rounded">
                R
              </span>
            )}
          </div>
          <div className="text-xs text-muted-foreground">
            {getZodiacSymbol(tooltip.sign)} {getZodiacDisplay(tooltip.sign)} •{" "}
            {tooltip.degree}°{tooltip.minutes}'
          </div>
        </div>
      )}
    </div>
  );
}
