import type { ColorKey, StatOption } from '../types';

export class ChartDimensions {
  public readonly x: string;
  public readonly y: string;
  public readonly color: ColorKey;

  constructor(x: string, y: string, color: ColorKey) {
    this.x = x;
    this.y = y;
    this.color = color;
  }

  public isValid(availableStats: StatOption[]): boolean {
    const ids = new Set(availableStats.map(opt => opt.id));
    return ids.has(this.x) && ids.has(this.y);
  }

  public withX(newX: string): ChartDimensions {
    return new ChartDimensions(newX, this.y, this.color);
  }

  public withY(newY: string): ChartDimensions {
    return new ChartDimensions(this.x, newY, this.color);
  }

  public withColor(newColor: ColorKey): ChartDimensions {
    return new ChartDimensions(this.x, this.y, newColor);
  }
}
