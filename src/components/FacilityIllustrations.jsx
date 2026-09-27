import React from 'react';

/**
 * Architectural vector illustrations styled to match clean isometric / 2.5D campus map cards.
 * Designed with precise lines, high contrast outlines (2px solid #000), subtle highlights, and no emojis.
 */

export function IndustrialPlantBuilding() {
  return (
    <svg width="84" height="52" viewBox="0 0 84 52" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Base Foundation / Plinth */}
      <rect x="4" y="24" width="76" height="24" rx="2" fill="#E2E8F0" stroke="#0F172A" strokeWidth="2.5" />
      
      {/* Front Entrance / Column Portico */}
      <rect x="26" y="16" width="32" height="32" rx="2" fill="#F8FAFC" stroke="#0F172A" strokeWidth="2.5" />
      
      {/* Roof pediment / cornices */}
      <path d="M24 16H60L56 12H28L24 16Z" fill="#CBD5E1" stroke="#0F172A" strokeWidth="2" strokeLinejoin="round" />
      <rect x="6" y="22" width="72" height="3" fill="#94A3B8" />

      {/* Main Portico Columns */}
      <rect x="30" y="20" width="4" height="26" fill="#94A3B8" rx="0.5" />
      <rect x="38" y="20" width="4" height="26" fill="#94A3B8" rx="0.5" />
      <rect x="46" y="20" width="4" height="26" fill="#94A3B8" rx="0.5" />
      <rect x="54" y="20" width="4" height="26" fill="#94A3B8" rx="0.5" />

      {/* Windows — Blue Tinted Grid */}
      <rect x="10" y="28" width="6" height="7" rx="1" fill="#3B82F6" stroke="#1E293B" strokeWidth="1.2" />
      <rect x="18" y="28" width="6" height="7" rx="1" fill="#3B82F6" stroke="#1E293B" strokeWidth="1.2" />
      <rect x="10" y="38" width="6" height="7" rx="1" fill="#3B82F6" stroke="#1E293B" strokeWidth="1.2" />
      <rect x="18" y="38" width="6" height="7" rx="1" fill="#3B82F6" stroke="#1E293B" strokeWidth="1.2" />

      <rect x="62" y="28" width="6" height="7" rx="1" fill="#3B82F6" stroke="#1E293B" strokeWidth="1.2" />
      <rect x="70" y="28" width="6" height="7" rx="1" fill="#3B82F6" stroke="#1E293B" strokeWidth="1.2" />
      <rect x="62" y="38" width="6" height="7" rx="1" fill="#3B82F6" stroke="#1E293B" strokeWidth="1.2" />
      <rect x="70" y="38" width="6" height="7" rx="1" fill="#3B82F6" stroke="#1E293B" strokeWidth="1.2" />

      {/* Center Portal / Glass Door */}
      <rect x="36" y="32" width="16" height="14" rx="1" fill="#1E293B" stroke="#0F172A" strokeWidth="1.5" />
      <line x1="44" y1="32" x2="44" y2="46" stroke="#64748B" strokeWidth="1.2" />

      {/* Incident Status indicator beam on roof */}
      <rect x="38" y="7" width="12" height="5" rx="1" fill="#EF4444" stroke="#0F172A" strokeWidth="1.5" />
      <circle cx="44" cy="9.5" r="1.5" fill="#FEF2F2" />
    </svg>
  );
}

export function GasFlareTower() {
  return (
    <svg width="84" height="52" viewBox="0 0 84 52" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Flare Platform base */}
      <rect x="12" y="38" width="60" height="10" rx="1.5" fill="#E2E8F0" stroke="#0F172A" strokeWidth="2.5" />
      <rect x="18" y="41" width="14" height="5" rx="1" fill="#3B82F6" stroke="#0F172A" strokeWidth="1.2" />
      <rect x="52" y="41" width="14" height="5" rx="1" fill="#3B82F6" stroke="#0F172A" strokeWidth="1.2" />

      {/* Industrial Tanker / Spherical Vessel on right */}
      <ellipse cx="60" cy="30" rx="10" ry="9" fill="#CBD5E1" stroke="#0F172A" strokeWidth="2" />
      <rect x="58" y="21" width="4" height="2" fill="#94A3B8" />

      {/* Flare Stack Tower Truss Structure */}
      <path d="M30 38L37 12H45L52 38" stroke="#0F172A" strokeWidth="2.5" strokeLinejoin="round" fill="#F8FAFC" />
      <line x1="32" y1="31" x2="50" y2="31" stroke="#0F172A" strokeWidth="1.5" />
      <line x1="35" y1="23" x2="47" y2="23" stroke="#0F172A" strokeWidth="1.5" />
      <line x1="32" y1="38" x2="50" y2="23" stroke="#94A3B8" strokeWidth="1.2" />
      <line x1="50" y1="38" x2="32" y2="23" stroke="#94A3B8" strokeWidth="1.2" />

      {/* Flare Stack Tip */}
      <rect x="38.5" y="8" width="5" height="5" rx="0.5" fill="#475569" stroke="#0F172A" strokeWidth="1.5" />
      
      {/* Vector Flame Flare Plume */}
      <path d="M41 1C43 4 46 6 44 9C42.5 7.5 40 7 39 8.5C38 7 39.5 4 41 1Z" fill="#F97316" stroke="#0F172A" strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M41 4C42 5.5 43.5 6.5 42.5 8C41.8 7.2 40.5 7 40 7.8C39.5 7 40.2 5.5 41 4Z" fill="#FEF08A" />
    </svg>
  );
}

export function ForestWildfireAsset() {
  return (
    <svg width="84" height="52" viewBox="0 0 84 52" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Ground elevation base */}
      <rect x="8" y="38" width="68" height="10" rx="2" fill="#E2E8F0" stroke="#0F172A" strokeWidth="2.5" />
      
      {/* Pine / Forest Canopy 1 (Left) */}
      <path d="M22 38L22 33M14 33L22 21L30 33H14ZM16 23L22 13L28 23H16Z" fill="#10B981" stroke="#0F172A" strokeWidth="2" strokeLinejoin="round" />
      
      {/* Dense Canopy Tree (Center) */}
      <rect x="40" y="32" width="4" height="7" fill="#78350F" stroke="#0F172A" strokeWidth="1.5" />
      <circle cx="42" cy="22" r="14" fill="#059669" stroke="#0F172A" strokeWidth="2.5" />
      <circle cx="36" cy="20" r="8" fill="#10B981" />
      <circle cx="48" cy="22" r="8" fill="#34D399" />

      {/* Pine / Forest Canopy 3 (Right) */}
      <path d="M62 38L62 33M54 33L62 21L70 33H54ZM56 23L62 13L68 23H56Z" fill="#047857" stroke="#0F172A" strokeWidth="2" strokeLinejoin="round" />

      {/* Forest Watch Tower or Alert Beacon */}
      <path d="M40 8H44V12H40V8Z" fill="#EF4444" stroke="#0F172A" strokeWidth="1.5" />
    </svg>
  );
}

export function MiningQuarryAsset() {
  return (
    <svg width="84" height="52" viewBox="0 0 84 52" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Stepped quarry pit terrace */}
      <path d="M6 46H78V36H66V26H54V18H30V26H18V36H6V46Z" fill="#E2E8F0" stroke="#0F172A" strokeWidth="2.5" strokeLinejoin="round" />
      
      {/* Terraces shading */}
      <rect x="6" y="38" width="72" height="6" fill="#CBD5E1" />
      <rect x="18" y="28" width="48" height="6" fill="#94A3B8" />

      {/* Extraction excavator / crane boom */}
      <rect x="36" y="16" width="12" height="8" rx="1.5" fill="#06B6D4" stroke="#0F172A" strokeWidth="2" />
      <line x1="42" y1="16" x2="56" y2="7" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="56" y1="7" x2="56" y2="15" stroke="#0F172A" strokeWidth="1.5" />
      <circle cx="56" cy="16" r="2.5" fill="#475569" stroke="#0F172A" strokeWidth="1.2" />

      {/* Cabin Window */}
      <rect x="42" y="18" width="4" height="4" rx="0.5" fill="#3B82F6" stroke="#0F172A" strokeWidth="1" />
    </svg>
  );
}

export function AgriculturalAsset() {
  return (
    <svg width="84" height="52" viewBox="0 0 84 52" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Field / Barn Foundation */}
      <rect x="8" y="36" width="68" height="12" rx="2" fill="#E2E8F0" stroke="#0F172A" strokeWidth="2.5" />
      <line x1="8" y1="42" x2="76" y2="42" stroke="#94A3B8" strokeWidth="1.5" strokeDasharray="3 3" />

      {/* Grain Silo (Right) */}
      <path d="M54 36V18C54 14 66 14 66 18V36H54Z" fill="#CBD5E1" stroke="#0F172A" strokeWidth="2.5" strokeLinejoin="round" />
      <line x1="54" y1="24" x2="66" y2="24" stroke="#0F172A" strokeWidth="1.2" />
      <line x1="54" y1="30" x2="66" y2="30" stroke="#0F172A" strokeWidth="1.2" />

      {/* Barn House (Left) */}
      <path d="M16 36V22L34 12L50 22V36H16Z" fill="#F8FAFC" stroke="#0F172A" strokeWidth="2.5" strokeLinejoin="round" />
      <polygon points="16,22 34,12 50,22" fill="#EAB308" stroke="#0F172A" strokeWidth="2" />
      
      {/* Barn Door */}
      <rect x="28" y="27" width="12" height="9" fill="#78350F" stroke="#0F172A" strokeWidth="1.5" />
      <line x1="28" y1="27" x2="40" y2="36" stroke="#0F172A" strokeWidth="1" />
      <line x1="40" y1="27" x2="28" y2="36" stroke="#0F172A" strokeWidth="1" />
    </svg>
  );
}

export function getFacilityIllustration(classification) {
  switch (classification) {
    case 'industrial_fire':
      return <IndustrialPlantBuilding />;
    case 'gas_flare':
      return <GasFlareTower />;
    case 'mining_activity':
      return <MiningQuarryAsset />;
    case 'forest_fire':
      return <ForestWildfireAsset />;
    case 'agricultural_burn':
      return <AgriculturalAsset />;
    default:
      return <IndustrialPlantBuilding />;
  }
}
