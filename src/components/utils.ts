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

export const extractLocationOrLore = (description: string | undefined): string => {
  if (!description) return 'Unknown';
  
  const sentences = description.split(/[.!?]+/);
  
  // Look for "Worn by", "Dropped by", "Held by", "Belonging to", "Awarded to", "Found in", "Worn during"
  const wornBy = sentences.find(s => s.toLowerCase().includes('worn by'));
  if (wornBy) return wornBy.trim();
  
  const droppedBy = sentences.find(s => s.toLowerCase().includes('dropped by'));
  if (droppedBy) return droppedBy.trim();
  
  const foundIn = sentences.find(s => s.toLowerCase().includes('found'));
  if (foundIn) return foundIn.trim();

  const choice = sentences.find(s => s.toLowerCase().includes('worn') || s.toLowerCase().includes('used by') || s.toLowerCase().includes('created by') || s.toLowerCase().includes('armor of'));
  if (choice) return choice.trim();

  // Fallback to the first sentence of the description if it's informative
  if (sentences[0]) {
    const firstSentence = sentences[0].trim();
    if (firstSentence.length > 5) return firstSentence;
  }
  
  return 'Unknown';
};
