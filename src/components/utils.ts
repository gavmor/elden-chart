import React from 'react';
import { HardHat, Shirt, Hand, Footprints, Circle } from 'lucide-react';
import type { LucideProps } from 'lucide-react';
import { generateColor } from '@marko19907/string-to-color';
import type { ArmorItem } from './types';

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
  
  const wornBy = sentences.find(s => s.toLowerCase().includes('worn by'));
  if (wornBy) return wornBy.trim();
  
  const droppedBy = sentences.find(s => s.toLowerCase().includes('dropped by'));
  if (droppedBy) return droppedBy.trim();
  
  const foundIn = sentences.find(s => s.toLowerCase().includes('found'));
  if (foundIn) return foundIn.trim();

  const choice = sentences.find(s => s.toLowerCase().includes('worn') || s.toLowerCase().includes('used by') || s.toLowerCase().includes('created by') || s.toLowerCase().includes('armor of'));
  if (choice) return choice.trim();

  if (sentences[0]) {
    const firstSentence = sentences[0].trim();
    if (firstSentence.length > 5) return firstSentence;
  }
  
  return 'Unknown';
};

export const getItemStat = (item: ArmorItem, statName: string): number => {
  if (statName === 'weight') return item.weight;
  if (statName === 'total_negation') {
    return item.dmgNegation.reduce((sum, s) => sum + s.amount, 0);
  }
  if (statName === 'total_resistance') {
    return item.resistance.filter(s => s.name !== 'Poise').reduce((sum, s) => sum + s.amount, 0);
  }
  
  const negation = item.dmgNegation.find(s => s.name === statName);
  if (negation) return negation.amount;
  
  const resistance = item.resistance.find(s => s.name === statName);
  if (resistance) return resistance.amount;
  
  return 0;
};
