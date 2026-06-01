export class CategoryFilter {
  private readonly active: Record<string, boolean>;

  constructor(active: Record<string, boolean> = {}) {
    this.active = active;
  }

  public isActive(category: string): boolean {
    return !!this.active[category];
  }

  public getRawActive(): Record<string, boolean> {
    return this.active;
  }

  public withToggled(category: string, checked: boolean): CategoryFilter {
    return new CategoryFilter({ ...this.active, [category]: checked });
  }

  public withGroupToggled(categories: string[], selectAll: boolean): CategoryFilter {
    const next = { ...this.active };
    for (const cat of categories) {
      next[cat] = selectAll;
    }
    return new CategoryFilter(next);
  }

  public withAllToggled(categoryGroups: { categories: string[] }[], selectAll: boolean): CategoryFilter {
    const next = { ...this.active };
    for (const group of categoryGroups) {
      for (const cat of group.categories) {
        next[cat] = selectAll;
      }
    }
    return new CategoryFilter(next);
  }

  public get activeNames(): string[] {
    return Object.entries(this.active)
      .filter(([, active]) => active)
      .map(([name]) => name);
  }
}
