export const CLASSIFICATIONS = {
  industrial_fire: {
    id: 'industrial_fire',
    label: 'Industrial Fire / Incident',
    shortLabel: 'Industrial Fire',
    color: '#EF4444', // Crimson
    rgb: [239, 68, 68],
    badgeBg: 'bg-red-500/15 border-red-500/30 text-red-400',
    description: 'Acute thermal spike within built-up industrial complex, refinery or factory perimeter.',
    iconName: 'Flame',
    severity: 'Critical'
  },
  gas_flare: {
    id: 'gas_flare',
    label: 'Gas Flare / Persistent Source',
    shortLabel: 'Gas Flare / Stack',
    color: '#F97316', // Plasma orange
    rgb: [249, 115, 22],
    badgeBg: 'bg-orange-500/15 border-orange-500/30 text-orange-400',
    description: 'Continuous, long-duration thermal emission (furnace, flare stack, smelter).',
    iconName: 'Activity',
    severity: 'Medium'
  },
  forest_fire: {
    id: 'forest_fire',
    label: 'Wildfire / Forest Fire',
    shortLabel: 'Forest Wildfire',
    color: '#10B981', // Emerald
    rgb: [16, 185, 129],
    badgeBg: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400',
    description: 'Rapidly spreading biomass fire in tree cover / dense canopy far from industry.',
    iconName: 'Trees',
    severity: 'High'
  },
  agricultural_burn: {
    id: 'agricultural_burn',
    label: 'Agricultural / Stubble Burn',
    shortLabel: 'Agri Burning',
    color: '#EAB308', // Amber yellow
    rgb: [234, 179, 8],
    badgeBg: 'bg-amber-500/15 border-amber-500/30 text-amber-400',
    description: 'Seasonal crop residue burning in rural agricultural parcels (short 1-2 day duration).',
    iconName: 'Wheat',
    severity: 'Low'
  },
  mining_activity: {
    id: 'mining_activity',
    label: 'Mining / Extraction Thermal',
    shortLabel: 'Mining / Quarry',
    color: '#06B6D4', // Cyan
    rgb: [6, 182, 212],
    badgeBg: 'bg-cyan-500/15 border-cyan-500/30 text-cyan-400',
    description: 'Thermal activity co-located with open-cast coal mines, blast areas, or quarries.',
    iconName: 'Pickaxe',
    severity: 'Medium'
  }
};

export const PRESET_HOTSPOTS = [
  { name: 'India (Overview)', lat: 22.5937, lon: 78.9629, zoom: 4.8 },
  { name: 'Jamnagar Petrochem Complex (GJ)', lat: 22.4707, lon: 70.0577, zoom: 11.5 },
  { name: 'Singrauli Thermal Energy Hub (MP/UP)', lat: 24.1997, lon: 82.6644, zoom: 11 },
  { name: 'Angul & Talcher Steel-Coal Belt (OR)', lat: 20.8444, lon: 85.1511, zoom: 11 },
  { name: 'Korba Industrial & Power Belt (CG)', lat: 22.3595, lon: 82.7501, zoom: 11 },
  { name: 'Dhanbad & Jharia Coalfields (JH)', lat: 23.7957, lon: 86.4304, zoom: 11.5 },
  { name: 'Hazira Petrochemicals & Port (GJ)', lat: 21.1070, lon: 72.6390, zoom: 12 },
  { name: 'Haldia Industrial Complex (WB)', lat: 22.0667, lon: 88.0698, zoom: 11.5 },
  { name: 'Punjab Agri Stubble Zone', lat: 30.9010, lon: 75.8573, zoom: 8 }
];

export const BASEMAPS = [
  {
    id: 'dark',
    name: 'Dark Canvas GIS',
    icon: 'Moon',
    style: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json'
  },
  {
    id: 'satellite',
    name: 'Satellite True Color',
    icon: 'Satellite',
    style: {
      version: 8,
      sources: {
        'esri-satellite': {
          type: 'raster',
          tiles: [
            'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
          ],
          tileSize: 256,
          attribution: 'Esri World Imagery'
        }
      },
      layers: [
        {
          id: 'esri-satellite-layer',
          type: 'raster',
          source: 'esri-satellite',
          minzoom: 0,
          maxzoom: 19
        }
      ]
    }
  },
  {
    id: 'positron',
    name: 'Light Carto',
    icon: 'Sun',
    style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json'
  }
];
