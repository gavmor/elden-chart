import { useQuery } from '@tanstack/react-query';
import request from 'graphql-request';
import type { EquipmentItem, ArmorItem, WeaponItem, ShieldItem } from '../components/types';
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

/** Raw shape of a { name, amount } stat as returned by the API (amount may be a string or number). */
interface RawStat { name?: unknown; amount?: unknown; }
/** Raw shape of a { name, scaling } scaling stat. */
interface RawScalingStat { name?: unknown; scaling?: unknown; }
/** Raw shape of a top-level item record from the API. */
interface RawItem {
  id?: unknown;
  name?: unknown;
  image?: unknown;
  category?: unknown;
  description?: unknown;
  weight?: unknown;
  dmgNegation?: RawStat[];
  resistance?: RawStat[];
  attack?: RawStat[];
  defence?: RawStat[];
  scalesWith?: RawScalingStat[];
  requiredAttributes?: RawStat[];
}

const safeFloat = (val: unknown): number => {
  if (typeof val === 'number') return val;
  if (!val) return 0;
  const parsed = parseFloat(String(val));
  return isNaN(parsed) ? 0 : parsed;
};

const safeStr = (val: unknown): string =>
  typeof val === 'string' ? val : '';

const safeStrOrNull = (val: unknown): string | null =>
  typeof val === 'string' ? val : null;

const mapStat = (s: RawStat) => ({ name: safeStr(s.name), amount: safeFloat(s.amount) });
const mapScaling = (s: RawScalingStat) => ({ name: safeStr(s.name), scaling: safeStr(s.scaling) });

const fetchAllPages = async (
  query: unknown,
  field: string,
  maxPage: number,
  limit = 100
): Promise<RawItem[]> => {
  const allItems: RawItem[] = [];

  for (let page = 0; page <= maxPage; page++) {
    try {
      const response = await request(API_URL, query as Parameters<typeof request>[1], { page, limit });
      const pageData = (response as Record<string, RawItem[]>)[field] || [];
      if (pageData.length === 0) break;
      allItems.push(...pageData);
    } catch (err: unknown) {
      const e = err as { response?: { data?: Record<string, RawItem[]> } };
      if (e.response?.data?.[field]) {
        allItems.push(...e.response.data[field]);
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
        rawArmors.map((item: RawItem) => ({
          id: safeStr(item.id),
          name: safeStr(item.name),
          image: safeStrOrNull(item.image),
          category: safeStr(item.category),
          description: safeStr(item.description),
          weight: safeFloat(item.weight),
          kind: 'armor' as const,
          dmgNegation: (item.dmgNegation || []).map(mapStat),
          resistance: (item.resistance || []).map(mapStat),
        }))
      );

      const weapons: WeaponItem[] = deduplicate(
        rawWeapons.map((item: RawItem) => ({
          id: safeStr(item.id),
          name: safeStr(item.name),
          image: safeStrOrNull(item.image),
          category: safeStr(item.category),
          description: safeStr(item.description),
          weight: safeFloat(item.weight),
          kind: 'weapon' as const,
          attack: (item.attack || []).map(mapStat),
          defence: (item.defence || []).map(mapStat),
          scalesWith: (item.scalesWith || []).map(mapScaling),
          requiredAttributes: (item.requiredAttributes || []).map(mapStat),
        }))
      );

      const shields: ShieldItem[] = deduplicate(
        rawShields.map((item: RawItem) => ({
          id: safeStr(item.id),
          name: safeStr(item.name),
          image: safeStrOrNull(item.image),
          category: safeStr(item.category),
          description: safeStr(item.description),
          weight: safeFloat(item.weight),
          kind: 'shield' as const,
          attack: (item.attack || []).map(mapStat),
          defence: (item.defence || []).map(mapStat),
          scalesWith: (item.scalesWith || []).map(mapScaling),
          requiredAttributes: (item.requiredAttributes || []).map(mapStat),
        }))
      );

      const all: EquipmentItem[] = [...armors, ...weapons, ...shields];
      return all;
    },
  });
};
