import React from 'react';
import { HardHat, Shirt, Hand, Footprints, Circle } from 'lucide-react';
import type { LucideProps } from 'lucide-react';
import { generateColor } from '@marko19907/string-to-color';

export const stringToColor = (str: string | undefined): string => {
  if (!str) return '#94a3b8';
  return generateColor(str, { saturation: 80, lightness: 65 });
};

export const getCategoryIcon = (category: string, props: LucideProps) => {
  switch(category) {
    case 'Helm': return React.createElement(HardHat, props);
    case 'Chest Armor': return React.createElement(Shirt, props);
    case 'Gauntlets': return React.createElement(Hand, props);
    case 'Leg Armor': return React.createElement(Footprints, props);
    default: return React.createElement(Circle, props);
  }
};
