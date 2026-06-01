import type { EquipmentItem } from '../types';

export class BuildSet {
  public readonly items: EquipmentItem[];

  constructor(items: EquipmentItem[] = []) {
    this.items = items;
  }

  public get totalWeight(): number {
    return this.items.reduce((sum, item) => sum + item.weight, 0);
  }

  public get size(): number {
    return this.items.length;
  }

  public contains(item: EquipmentItem): boolean {
    return this.items.some(i => i.id === item.id);
  }

  public containsId(id: string): boolean {
    return this.items.some(i => i.id === id);
  }

  public withToggled(item: EquipmentItem): BuildSet {
    const exists = this.contains(item);
    const nextItems = exists
      ? this.items.filter(i => i.id !== item.id)
      : [...this.items, item];
    return new BuildSet(nextItems);
  }

  public withRemoved(item: EquipmentItem): BuildSet {
    return new BuildSet(this.items.filter(i => i.id !== item.id));
  }

  public toArray(): EquipmentItem[] {
    return this.items;
  }
}
