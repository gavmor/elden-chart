import { useQuery } from '@tanstack/react-query';
import request from 'graphql-request';
import type { EquipmentItem, ArmorItem, WeaponItem, ShieldItem } from '../components/types';
// @ts-ignore
import { graphql } from '../gql/gql';

const API_URL = 'https://eldenring.fanapis.com/api/graphql';

const GET_ARMOR_PAGE = graphql(/* GraphQL */ `
  query GetArmorPage($page: Int!, $limit: Int!) {
    armor(page: $page, limit: $limit) {
      id
      name
      image
      description
      category
      weight
      dmgNegation {
        name
        amount
      }
      resistance {
        name
        amount
      }
    }
  }
`);

const GET_WEAPON_PAGE = graphql(/* GraphQL */ `
  query GetWeaponPage($page: Int!, $limit: Int!) {
    weapon(page: $page, limit: $limit) {
      id
      name
      image
      description
      category
      weight
      attack {
        name
        amount
      }
      defence {
        name
        amount
      }
      scalesWith {
        name
        scaling
      }
      requiredAttributes {
        name
        amount
      }
    }
  }
`);

const GET_SHIELD_PAGE = graphql(/* GraphQL */ `
  query GetShieldPage($page: Int!, $limit: Int!) {
    shield(page: $page, limit: $limit) {
      id
      name
      image
      description
      category
      weight
      attack {
        name
        amount
      }
      defence {
        name
        amount
      }
      scalesWith {
        name
        scaling
      }
      requiredAttributes {
        name
        amount
      }
    }
  }
`);

const safeFloat = (val: any): number => {
  if (typeof val === 'number') return val;
  if (!val) return 0;
  const parsed = parseFloat(val);
  return isNaN(parsed) ? 0 : parsed;
};

const fetchAllPages = async (
  query: any,
  field: string,
  maxPage: number,
  limit = 100
): Promise<any[]> => {
  const allItems: any[] = [];

  for (let page = 0; page <= maxPage; page++) {
    try {
      const response = await request(API_URL, query, { page, limit });
      const pageData = response[field] || [];
      if (pageData.length === 0) break;
      allItems.push(...pageData);
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data[field]) {
        allItems.push(...err.response.data[field]);
      } else {
        console.error(`Fetch ${field} page failed:`, err);
      }
    }
  }

  return allItems;
};

const deduplicate = <T extends { name: string }>(items: T[]): T[] => {
  return Array.from(new Map(items.map(item => [item.name, item])).values());
};

export const useEquipmentData = () => {
  return useQuery({
    queryKey: ['equipment'],
    queryFn: async () => {
      const [rawArmors, rawWeapons, rawShields] = await Promise.all([
        fetchAllPages(GET_ARMOR_PAGE, 'armor', 5),
        fetchAllPages(GET_WEAPON_PAGE, 'weapon', 4),
        fetchAllPages(GET_SHIELD_PAGE, 'shield', 1),
      ]);

      const armors: ArmorItem[] = deduplicate(
        rawArmors.map((item: any) => ({
          id: item.id || '',
          name: item.name || '',
          image: item.image || null,
          category: item.category || '',
          description: item.description || '',
          weight: safeFloat(item.weight),
          kind: 'armor' as const,
          dmgNegation: (item.dmgNegation || []).map((s: any) => ({
            name: s.name || '',
            amount: safeFloat(s.amount),
          })),
          resistance: (item.resistance || []).map((s: any) => ({
            name: s.name || '',
            amount: safeFloat(s.amount),
          })),
        }))
      );

      const weapons: WeaponItem[] = deduplicate(
        rawWeapons.map((item: any) => ({
          id: item.id || '',
          name: item.name || '',
          image: item.image || null,
          category: item.category || '',
          description: item.description || '',
          weight: safeFloat(item.weight),
          kind: 'weapon' as const,
          attack: (item.attack || []).map((s: any) => ({
            name: s.name || '',
            amount: safeFloat(s.amount),
          })),
          defence: (item.defence || []).map((s: any) => ({
            name: s.name || '',
            amount: safeFloat(s.amount),
          })),
          scalesWith: (item.scalesWith || []).map((s: any) => ({
            name: s.name || '',
            scaling: s.scaling || '',
          })),
          requiredAttributes: (item.requiredAttributes || []).map((s: any) => ({
            name: s.name || '',
            amount: safeFloat(s.amount),
          })),
        }))
      );

      const shields: ShieldItem[] = deduplicate(
        rawShields.map((item: any) => ({
          id: item.id || '',
          name: item.name || '',
          image: item.image || null,
          category: item.category || '',
          description: item.description || '',
          weight: safeFloat(item.weight),
          kind: 'shield' as const,
          attack: (item.attack || []).map((s: any) => ({
            name: s.name || '',
            amount: safeFloat(s.amount),
          })),
          defence: (item.defence || []).map((s: any) => ({
            name: s.name || '',
            amount: safeFloat(s.amount),
          })),
          scalesWith: (item.scalesWith || []).map((s: any) => ({
            name: s.name || '',
            scaling: s.scaling || '',
          })),
          requiredAttributes: (item.requiredAttributes || []).map((s: any) => ({
            name: s.name || '',
            amount: safeFloat(s.amount),
          })),
        }))
      );

      const all: EquipmentItem[] = [...armors, ...weapons, ...shields];
      return all;
    },
  });
};
